// src/handlers.js
import { rest } from "msw";

// Define handlers for different endpoints
export const handlers = [
  // A handler for a GET request to '/api/data'
  rest.get("/api/data", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: "Hello, world!" }) // Mock response data
    );
  }),
  // You can add more handlers for other endpoints here
];
