import React, { createContext, useState, useContext } from "react";

const WebsiteContext = createContext();

const extractDomain = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const parts = hostname.split(".");
    const domain = parts.length > 1 ? parts[parts.length - 2] : hostname;
    return domain;
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
};

export const WebsiteProvider = ({ children }) => {
  const [websiteValue, setWebsiteValue] = useState("");

  return (
    <WebsiteContext.Provider
      value={{ websiteValue, setWebsiteValue, extractDomain }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);
