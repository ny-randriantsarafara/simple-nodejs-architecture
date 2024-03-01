import express from "express";
import { createIssuesController } from "./controllers/issue.controller";
import { changeProblemStatusController } from "./controllers/problem.controller";
import {
  closeTicketController,
  createTicketController,
  updateTicketController,
} from "./controllers/ticket.controller";

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/issues", createIssuesController);

app.post("/change-status/:status", changeProblemStatusController);

app.post("/create-ticket/:thirdPartyApp/:problemId", createTicketController);

app.post("/update-ticket/:thirdPartyApp/:problemId", updateTicketController);

app.post("/close-ticket/:thirdPartyApp/:problemId", closeTicketController);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
