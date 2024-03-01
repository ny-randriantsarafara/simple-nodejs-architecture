import { Request, Response } from "express";

import ProblemService from "../services/problem.service";
import { ProblemStatus } from "../object-values/problem.status";

export const changeProblemStatusController = (req: Request, res: Response) => {
  const {
    params: { status },
  } = req;
  const problemService = ProblemService.getInstance();
  try {
    const updatedProblems = problemService.updateProblemsStatus(
      status as ProblemStatus,
    );
    res.status(200).send(updatedProblems);
  } catch (error: any) {
    res.status(400).send({ message: error?.message });
  }
};
