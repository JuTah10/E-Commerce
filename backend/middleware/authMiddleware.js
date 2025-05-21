import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { db } from "../config/db.js";

dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        console.log("access token" + accessToken)
        if (!accessToken) return res.status(401).json({ message: "Unauthorized - No access token provided" });

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await db`
                SELECT email, name, role FROM active_user WHERE email = ${decoded.userEmail};
            `;
            if (user.length === 0) {
                return res.status(401).json({ message: "User not found!" });
            }
            req.userEmail = user[0].email;
            req.userName = user[0].name;
            req.userRole = user[0].role;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Accesstoken Expired" });
            }
            throw error; //else throw error for the under catch block to catch
        }
    } catch (error) {
        console.log("Error in protectRoute inside middle folder ", error);
        res.status(401).json({ message: "Unauthorized - No access token provided" });
    }
}

export const adminRoute = async (req, res, next) => {
    if (req.userRole && req.userRole === "admin") {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Unauthorized - Admin only" });
    }
}