import { OpenAIChatApi } from "llm-api";
import { completion } from "zod-gpt";
import { config } from "dotenv";
import { searchResults } from "../Controllers/FeedingController.js";

config();

export const handleSearch = async (req, res) => {
  try {
    const { question } = req.body;

    const Results = await searchResults(question);

    const openai = new OpenAIChatApi(
      {
        apiKey: process.env.AZURE_OPENAI_KEY,
        azureDeployment: process.env.AZURE_DEPLOYMENT_NAME,
        azureEndpoint: process.env.AZURE_ENDPOINT,
      },
      { model: "gpt-4-0613" }
    );

    // Generate the prompt
    const prompt = `Answer the following question using the provided information:

    **Question:** ${question}

    **Information:**

    * ${Results.map((doc) => doc)}
    `;

    const response = await completion(openai, prompt);

    console.log(response.message.content, "response");
    res.json(response.message.content);
  } catch (error) {
    console.error("Error performing search:", error);
    res
      .status(500)
      .json({ error: "An error occurred while performing the search" });
  }
};
