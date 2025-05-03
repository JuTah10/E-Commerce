import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import couponRoute from "./routes/couponRoute.js"
import paymentRoute from "./routes/paymentRoute.js"
import cookieParser from "cookie-parser";
import { isSpoofedBot } from "@arcjet/inspect"; //for rate limiting later

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //for destructoring req.body
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true

}));    //for not blocking request from different origin, need to research more to understand
app.use(helmet()); //basically provide extra security that helps you protect your app by setting various HTTP headers
app.use(morgan("dev"));

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/payment", paymentRoute);

console.log('Hello world')

app.listen(PORT, () => {
    console.log(`Server is currently running on ${PORT}`)
})
