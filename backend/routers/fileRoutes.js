import express from "express";
import { getFileList } from "../controllers/fileController.js";

const router = express.Router();

router.get("/files", getFileList);

export default router;
