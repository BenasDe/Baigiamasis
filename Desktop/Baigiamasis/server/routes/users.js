import express from "express";
//importing the controllers
import {
  getUser,
} from "../controllers/users.js";
//importing the middleware
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read routes
router.get("/:id", verifyToken, getUser);

export default router;
