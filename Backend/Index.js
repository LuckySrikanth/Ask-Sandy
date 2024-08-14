import express, { json } from "express";
import CrawlerRouter from "./Routes/CrawlerRoute.js";
import FeedingRouter from "./Routes/FeedingRoute.js";
import SearchRouter from "./Routes/SearchRouter.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", CrawlerRouter);
app.use("/api", FeedingRouter);
app.use("/api", SearchRouter);

app.listen(5000, () => {
  console.log("Express is running in 5000 port ");
});
