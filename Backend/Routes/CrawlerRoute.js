import express from "express";
import { crawlWebsite } from "../Controllers/CrawlerController.js";

const CrawlerRouter = express.Router();

CrawlerRouter.post("/crawl", crawlWebsite);

export default CrawlerRouter;
