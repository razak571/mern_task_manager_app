import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDatabase.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 3000;
const secret = process.env.COOKIE_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secret));

app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello, Welocome To Vooshfoods" });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server started on PORT: ${PORT}`);
});
