import React, { useState, useEffect } from "react";

interface CatFactResponse {
  fact: string;
}

const API = "https://catfact.ninja/fact";

const CatFactComponent: React.FC = () => {
  const [catFact, setCatFact] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCatFact() {
      try {
        console.log("Handling request to", API); // Logging the request URL
        const response = await fetch(API);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: CatFactResponse = await response.json();
        setCatFact(`Cat fact: ${data.fact}`);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchCatFact();
  }, []);

  return (
    <div>
      {error && <p>Error fetching cat fact: {error}</p>}
      {catFact ? <p>{catFact}</p> : <p>Loading...</p>}
      <p>Testing from Srikanth in TSX</p>
    </div>
  );
};

export default CatFactComponent;
