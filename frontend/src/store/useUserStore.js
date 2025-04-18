import { create } from "zustand"
import axios from "../lib/axios.js"
import { toast } from "react-hot-toast"

export const useUserStore = create((set, get) => ({
    user: {
        email: "",
        userName: ""
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
            set({ user: { email: response.data.data.email, userName: response.data.data.name } })

        } catch (error) {
            set({ error: error.response.data.message });
        } finally {
            set({ loading: false });
        }
    },

    logOut: async () => {
        set({ checkingAuth: true });
        try {
            await axios.post("/auth/logout")
            set({ user: { email: "", userName: "" } });
        } catch (error) {
            set({ error: error.response.data.message });
        } finally {
            set({ checkingAuth: false })
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: { email: response.data.data.email, userName: response.data.data.name } });
        } catch (error) {
            set({ error: error.response.data.message });
        } finally {
            set({ checkingAuth: false });
            set({ error: null })
        }
    }


}))