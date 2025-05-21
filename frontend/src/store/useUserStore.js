import { create } from "zustand"
import axios from "../lib/axios.js"
import { toast } from "react-hot-toast"

export const useUserStore = create((set, get) => ({
    user: {
        email: "",
        userName: "",
        userRole: ""
    },
    loading: false,
    error: null,
    checkingAuth: true,

    createNewAccount: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true, error: null });
        try {
            if (password !== confirmPassword) {
                set({ error: "Password not matching!" });
                throw error();
            }
            else {
                const response = await axios.post("/auth/signup", { email, password, name });
                set({ user: { email: response.data.data.email, userName: response.data.data.name } });
            }

        } catch (error) {
            set({ error: error.response.data.message });

        } finally {
            set({ loading: false });
        }
    },
    signIn: async ({ email, password }) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("/auth/login", { email, password });

            set({ user: { email: response.data.data.email, userName: response.data.data.name, userRole: response.data.data.userRole } })
            await new Promise((res) => setTimeout(res, 200));
        } catch (error) {
            set({ error: error?.response?.data?.message });
        } finally {
            set({ loading: false });
        }
    },

    logOut: async () => {
        set({ checkingAuth: true });
        try {
            await axios.post("/auth/logout")
            set({ user: { email: "", userName: "", userRole: "" } });
        } catch (error) {
            set({ error: error.response.data.message });
        } finally {
            set({ checkingAuth: false })
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile", {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                }
            });
            set({ user: { email: response.data.data.email, userName: response.data.data.name, userRole: response.data.data.userRole } });

        } catch (error) {
            set({ error: error.response.data.message });
        } finally {
            set({ checkingAuth: false });
            set({ error: null })
        }
    },

    refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            await axios.post("/auth/refresh-token", {
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache",
                    "Expires": "0",
                }
            })

        } catch (error) {
            set({ error: error.response.data.message });
        } finally {
            set({ checkingAuth: false });
            set({ error: null })
        }
    }
}));

let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {

                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }

                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;

                return axios(originalRequest);
            } catch (refreshError) {

                useUserStore.getState().logOut();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);