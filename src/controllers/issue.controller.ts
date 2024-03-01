import { Request, Response } from "express";
import IssueService from "../services/issue.service";
import ProblemService from "../services/problem.service";

export const createIssuesController = (req: Request, res: Response) => {
  const { body: issues } = req;
  const issueService = IssueService.getInstance();
  const problemService = ProblemService.getInstance();
  const createdIssues = issueService.createIssues(issues);
  const problems = problemService.createProblems(createdIssues);
  res.status(201).send(problems);
};
