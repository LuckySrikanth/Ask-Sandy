import React, { useState } from "react";
import "./App.css";
import AskQuestion from "./component/AskQuestion/AskQuestion";
import { useWebsite } from "./Context/WebsiteContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("Demo");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { websiteValue, setWebsiteValue, extractDomain } = useWebsite();
  let toastId = null; // Variable to store the toast ID

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  const chunkingData = async (d) => {
    const domain = extractDomain(websiteValue);
    try {
      const response = await fetch(
        "https://asksandy-server.fly.dev/api/feeding",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chunkingData: d, url: domain }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error during chunking data");
      }

      const data = await response.json();
      console.log("Chunking data response:", data);
      toast.update(toastId, {
        render:
          "Loading complete (100%) 👌. You can now ask questions from your site.",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error during chunking data:", error);
      toast.update(toastId, {
        render: `An error occurred: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const Feedhandler = async () => {
    toastId = toast.loading("Loading 25%");
    try {
      const response = await fetch(
        "https://asksandy-server.fly.dev/api/crawl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: websiteValue }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.update(toastId, {
          render: `Error: ${errorData.message}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.message) {
        toast.update(toastId, {
          render: "Loading 50%",
          type: "info",
          isLoading: true,
        });
        await chunkingData(data.message);
      } else {
        throw new Error("No message received");
      }
    } catch (error) {
      toast.update(toastId, {
        render: `An error occurred 🤯: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="info-container">
      <h1>Ask Sandy</h1>
      <p>Get intelligent answers from any website content you desire.</p>
      <div className="tabs">
        {["Demo", "Examples", "How it works", "Ask Question"].map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              if (tab === "Ask Question") {
                openPanel();
              }
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      {activeTab === "Demo" && (
        <div className="demo-content">
          <label htmlFor="website-url">Website URL:</label>
          <input
            type="text"
            id="website-url"
            onChange={(e) => setWebsiteValue(e.target.value)}
            name="website-url"
          />
          <button className="Feed-btn" onClick={Feedhandler}>
            Feed
          </button>
        </div>
      )}
      {activeTab === "How it works" && (
        <ul className="how-it-works">
          <li>User will be given a prompt to input website URL.</li>
          <li>The website content will be vectorized by using LLM chain.</li>
          <li>
            The vectorized content will be fed to LLM to generate an answer.
          </li>
        </ul>
      )}
      <AskQuestion isOpen={isPanelOpen} onClose={closePanel} />
      <ToastContainer />
    </div>
  );
};

export default App;
