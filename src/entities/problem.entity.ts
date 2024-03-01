import Issue from "./issue.entity";
import { IssueStatus } from "../object-values/issue.status";
import { ProblemStatus } from "../object-values/problem.status";
import { ProblemStatusTransition } from "../object-values/problem-status.transition";

export default class Problem {
  id: string;
  status: ProblemStatus;
  issues: Issue[];

  constructor(id: string, issues: Issue[]) {
    this.id = id;
    this.issues = issues;
    this.status = ProblemStatus.PENDING;
  }

  public static new(issues: Issue[]) {
    const id = this.generateId();
    return new Problem(id, issues);
  }

  public static generateId(): string {
    return "xxxx-xxxx-xxxx-xxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  setStatus(status: ProblemStatus) {
    if (!ProblemStatusTransition.includes(status)) {
      throw new Error("Invalid status");
    }
    const newStatusIndex = ProblemStatusTransition.indexOf(status);
    const currentStatusIndex = ProblemStatusTransition.indexOf(this.status);
    if (currentStatusIndex > newStatusIndex) {
      throw new Error(
        "Invalid status transition, could not go back to previous status",
      );
    }
    if (newStatusIndex - currentStatusIndex > 1) {
      throw new Error("Invalid status transition, could not skip status");
    }
    this.status = status;
    this.issues.forEach((issue) => {
      if (this.status === ProblemStatus.READY) {
        issue.setStatus(IssueStatus.WAITING);
      }
      if (
        this.status === ProblemStatus.OPEN ||
        this.status === ProblemStatus.CLOSED
      ) {
        issue.setStatus(IssueStatus.GROUPED);
      }
    });
  }
}
