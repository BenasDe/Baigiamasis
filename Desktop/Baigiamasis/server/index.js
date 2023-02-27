import express from "express";// for server
import bodyParser from "body-parser";// for parsing json
import mongoose from "mongoose";// for database
import cors from "cors";// for cross origin requests
import dotenv from "dotenv";// for environment variables
import multer from "multer"; // for file uploads
import helmet from "helmet"; // for security
import morgan from "morgan";// for logging
import path from "path";// for file paths
import { fileURLToPath } from "url";// for file paths
import authRoutes from "./routes/auth.js";// for auth routes
import userRoutes from "./routes/users.js";// for user routes
import postRoutes from "./routes/posts.js";// for post routes
import { register } from "./controllers/auth.js";// for register
import { createPost } from "./controllers/posts.js";// for createPost
import { verifyToken } from "./middleware/auth.js";// for verifyToken


// CONFIGURATIONS 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES WITH FILES 
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES 
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP 
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

   
  })
  .catch((error) => console.log(`${error} did not connect`));
