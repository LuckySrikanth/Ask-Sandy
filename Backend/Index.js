import express, { json } from "express";
import CrawlerRouter from "./Routes/CrawlerRoute.js";
import FeedingRouter from "./Routes/FeedingRoute.js";
import SearchRouter from "./Routes/SearchRouter.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "HELLO ASK SANDY" });
});

app.use("/api", CrawlerRouter);
app.use("/api", FeedingRouter);
app.use("/api", SearchRouter);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});

export default app;
