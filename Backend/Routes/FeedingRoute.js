import express from "express";
import { chunkDataController } from "../Controllers/FeedingController.js";

const router = express.Router();

router.post("/feeding", chunkDataController);

export default router;
