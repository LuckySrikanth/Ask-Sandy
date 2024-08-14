import React, { useState } from "react";
import "./App.css";
import AskQuestion from "./component/AskQuestion/AskQuestion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [activeTab, setActiveTab] = useState("Demo");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [websitevalue, setWebSitevalue] = useState("");

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);

  const chunkingData = async (d) => {
    try {
      const response = await fetch("http://localhost:5000/api/feeding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chunkingData: d }),
      });

      const data = await response.json();
      console.log("Chunking data response:", data);
    } catch (error) {
      console.error("Error during chunking data:", error);
    }
  };

  const Feedhandler = () => {
    const fetchPromise = fetch("http://localhost:5000/api/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: websitevalue }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          return chunkingData(data.message).then(() => data);
        } else {
          throw new Error("No message received");
        }
      });

    toast.promise(fetchPromise, {
      pending: "Loading 50%... Please wait.",
      success:
        "Loading complete (100%) 👌. You can now ask questions from your site.",
      error: "An error occurred 🤯. Please try again.",
    });
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
            onChange={(e) => setWebSitevalue(e.target.value)}
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
