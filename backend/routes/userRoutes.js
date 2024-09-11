import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  google,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/google", google);

export default router;
