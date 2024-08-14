import { http, HttpResponse, delay } from "msw";

import { DocumentScreen } from "./YourPage";

export default {
  title: "Example Story Book.js",
  component: DocumentScreen,
};

// 👇 The mocked data that will be used in the story
const TestData = {
  user: {
    userID: 1,
    name: "Someone",
  },
  document: {
    id: 1,
    userID: 1,
    title: "Something",
    brief: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: "approved",
  },
  subdocuments: [
    {
      id: 1,
      userID: 1,
      title: "Something",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "approved",
    },
  ],
};

export const MockedSuccess = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts", () => {
          return HttpResponse.json(TestData);
        }),
      ],
    },
  },
};

export const MockedError = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/posts", async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
