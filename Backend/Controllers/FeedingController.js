import { v4 as uuidv4, v4 } from "uuid";
import { config } from "dotenv";
import { connect } from "vectordb";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { LanceDB } from "@langchain/community/vectorstores/lancedb";
import { AzureOpenAIEmbeddings } from "@langchain/openai";

config();

const model = new AzureOpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
  azureOpenAIApiEmbeddingsDeploymentName:
    process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
  azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
});

export const chunkDataController = async (req, res) => {
  try {
    const { chunkingData, url } = req.body;
    console.log(`vectors_${url}`);

    if (!chunkingData) {
      return res.status(400).json({ error: "Data is required" });
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 1,
    });

    const splitDocs = await splitter.splitText(chunkingData);

    const array_string = [];
    const array_ids = [];

    splitDocs.forEach((doc) => {
      const a = `${doc}`;
      array_string.push(a);
      array_ids.push({ id: v4() });
    });

    const db = await connect("./vectordb");

    try {
      const table = await db.createTable(`vectors_${url}`, [
        {
          vector: await model.embedQuery("sample"),
          text: `{"sample":"sample"}`,
          id: v4(),
        },
      ]);
      const vectorStore = await LanceDB.fromTexts(
        array_string,
        array_ids,
        model,
        { table }
      );
    } catch (tableError) {
      if (tableError.message.includes("already exists")) {
        console.error("Table already exists:", tableError);
        return res.status(400).json({
          message: "Website already exists. You can now ask questions from it.",
        });
      } else {
        throw tableError;
      }
    }

    return res.json({ message: "Data successfully stored in LanceDB" });
  } catch (error) {
    console.error("Error in chunkDataController:", error);
    res.status(500).json({
      message: `Internal server error: ${error.message}`,
    });
  }
};

export const searchResults = async (QA, url) => {
  try {
    // console.log(url, "searchresults url");
    const db = await connect("./vectordb");
    const tbl = await db.openTable(`vectors_${url}`);
    const query = await model.embedQuery(QA);
    const searchResults = await tbl.search(query).limit(5).execute();

    const formattedResults = searchResults.map((each) => each.text);
    return formattedResults;
  } catch (error) {
    console.error("Error during searchResults operation:", error);
    throw error;
  }
};
