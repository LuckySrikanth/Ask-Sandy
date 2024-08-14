import React, { useState, useEffect } from "react";

// Example hook to retrieve data from an external endpoint
function useFetchData() {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);
  useEffect(() => {
    setStatus("loading");
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setStatus("success");
        setData(data);
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);
  return {
    status,
    data,
  };
}
export function DocumentScreen() {
  const { status, data } = useFetchData();

  const { user, document, subdocuments } = data;

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>There was an error fetching the data!</p>;
  }
  return (
    <div>
      {data ? (
        data.map((each) => (
          <div>
            <p>
              {each.id} - title:{each.title}
            </p>
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
