import express from "express";
import { handleSearch } from "../Controllers/SearchController.js";
import { chunkDataController } from "../Controllers/FeedingController.js";

const SearchRouter = express.Router();

SearchRouter.post("/search", handleSearch, chunkDataController);

export default SearchRouter;
