import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { htmlToText } from "html-to-text";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const scrapingData = "./Data";

if (!fs.existsSync(scrapingData)) {
  fs.mkdirSync(scrapingData);
}

export const crawlWebsite = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const loader = new PlaywrightWebBaseLoader(url);
    const docs = await loader.load();
    const extractedHtml = docs[0]?.pageContent || "";

    //
    const extractedText = htmlToText(extractedHtml, {
      wordwrap: 130,
    });

    const fileName = `${new URL(url).hostname}.txt`;
    const filePath = path.join(scrapingData, fileName);

    await writeFile(filePath, extractedText);

    res.json({ message: `${extractedText}` });
  } catch (error) {
    console.error("Error during web scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
