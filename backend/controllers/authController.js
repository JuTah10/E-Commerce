import bcrypt from "bcryptjs"
import { db } from "../config/db.js";
import jwt from "jsonwebtoken"
import { redis } from "../lib/redis.js";

const generateTokens = (userEmail) => {
    const accessToken = jwt.sign({ userEmail }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({ userEmail }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userEmail, refreshToken) => {
    await redis.set(`refresh_token:${userEmail}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevent XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", //prevent CSRF attaack, cross-site request forgery
        maxAge: 15 * 60 * 1000, //15 mins
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevent XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", //prevent CSRF attaack, cross-site request forgery
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    })


}

export const userSignUp = async (req, res) => {

    try {
        let { email, password, name } = req.body;
        const checkEmail = await db`
        SELECT email FROM active_user WHERE email = ${email}
        `
        if (checkEmail.length === 0) { //case where email not registered
            try {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);
                try {
                    const newUser = await db`
                    INSERT INTO active_user(email, password, role, name) VALUES(${email},${password}, ${"customer"}, ${name}) RETURNING *
                `;
                    //create a cart assign to that user
                    await db`
                    INSERT INTO cart(user_email) VALUES(${email})
                    `;

                    //authenticate user
                    const { accessToken, refreshToken } = generateTokens(newUser[0].email);
                    await storeRefreshToken(newUser[0].email, refreshToken);

                    setCookies(res, accessToken, refreshToken);

                    console.log("Success create user: " + newUser[0]);
                    res.status(201).json({ success: true, data: { email: newUser[0].email, name: newUser[0].name } }); //201 means a resource has been created, for inserting
                } catch (error) {
                    console.log("Error in userSignUp", error);
                    res.status(500).json({ success: false, message: error.message }); //500 for server crash
                }
            } catch (error) {
                res.status(500).jason({ success: false, message: "Internal Server Error" })
                console.log("error when salting password ", error);
            }
        }
        else {
            console.log("User email is already registered");
            return res.status(409).json({ success: false, message: "Email is already registered" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}
export const userLogIn = async (req, res) => {
    const { email, password } = req.body;

    try {       //check email
        const user = await db`
        SELECT email, password, name, role FROM active_user WHERE email = ${email}
        `
        if (user.length === 0) {
            res.status(404).json({ success: false, message: "No account with that email" })
        }
        else {
            if (await bcrypt.compare(password, user[0].password)) {
                console.log(user)

                //authentication
                const { accessToken, refreshToken } = generateTokens(user[0].email);
                await storeRefreshToken(user[0].email, refreshToken);
                setCookies(res, accessToken, refreshToken);

                res.status(200).json({ success: true, data: { email: user[0].email, name: user[0].name, userRole: user[0].role } })
            }
            else {
                res.status(401).json({ success: false, message: "Incorrect password!" })
            }
        }
    } catch (error) {
        console.log("Error in userLogIn", error);
        res.status(500).json({ success: false, message: error.message }); //500 for server crash
    }

}
export const userLogOut = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userEmail}`)
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            console.log("No refresh token provided")
            return res.status(401).json({ message: "No refresh token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            console.log("Invalid refresh token")
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const storedToken = await redis.get(`refresh_token:${decoded.userEmail}`);
        if (storedToken !== refreshToken) {
             console.log("Invalid refresh token")
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userEmail: decoded.userEmail }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        })

        res.json({ message: "Token refreshed successfully" });

    } catch (error) {
        console.log("Error inside refreshToken");
        res.status(500).json({ message: error.message });
    }
}


export const getProfile = async (req, res) => {
    try {
        res.setHeader("Cache-Control", "no-store");
        res.status(200).json({ data: { name: req.userName, email: req.userEmail, userRole: req.userRole } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}