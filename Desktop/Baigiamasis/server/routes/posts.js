import express from "express";
import { getFeedPosts, getUserPosts, likePost, deletePost } from "../controllers/posts.js"; // importing the controllers
import { verifyToken } from "../middleware/auth.js"; // importing the middleware

const router = express.Router();

// Read routes
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

// Update routes
router.patch("/:id/like", verifyToken, likePost);

//DELETE routes
router.delete("/:id", deletePost);

// Insert Comment
router.post("/:id/comments", verifyToken, addComment);

export default router;
