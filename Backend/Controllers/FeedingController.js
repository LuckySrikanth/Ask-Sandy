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
  const { chunkingData } = req.body;

  if (!chunkingData) {
    return res.status(400).json({ error: "data is required" });
  }
  console.log(chunkingData, "chunkingData");
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

  // console.log(array_string, "array_string");
  // console.log(array_ids, "array_ids");

  const db = await connect("./vectordb");
  const table = await db.createTable("vectors", [
    {
      vector: await model.embedQuery("sample"),
      text: `{"sample":"sample"}`,
      id: v4(),
    },
  ]);

  try {
    const vectorStore = await LanceDB.fromTexts(
      array_string,
      array_ids,
      model,
      {
        table,
      }
    );

    // const resultOne = await vectorStore.similaritySearch(
    //   "what are the services provided by italent digital ?  ",
    //   5
    // );
    return res.json({ message: "Data sucessfully stored In Lances DB" });
  } catch (error) {
    console.error("Error during vector store operations:", error);
  }
};

export const searchResults = async (QA) => {
  try {
    const db = await connect("./vectordb");
    const tbl = await db.openTable("vectors");
    const query = await model.embedQuery(QA);
    const searchResults = await tbl.search(query).limit(5).execute();

    const formattedResults = searchResults.map((each) => each.text);
    return formattedResults;
  } catch (error) {
    console.error("Error during searchResults operation:", error);
    throw error;
  }
};
