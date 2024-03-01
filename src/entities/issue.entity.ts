import { CreateIssueDTO } from "../dtos/create-issue.dto";
import { IssueStatusTransition } from "../object-values/issue-status-transition";
import { IssueStatus } from "../object-values/issue.status";

export default class Issue {
  category: string;
  userId: number;
  comment: string;
  status: IssueStatus;
  video: string;

  constructor({ video, category, userId, comment }: CreateIssueDTO) {
    this.video = video;
    this.category = category;
    this.userId = userId;
    this.comment = comment;
    this.status = IssueStatus.WAITING;
  }

  static new(request: CreateIssueDTO) {
    return new Issue(request);
  }

  setStatus(status: IssueStatus) {
    if (!IssueStatusTransition.includes(status)) {
      throw new Error("Invalid status");
    }
    const newStatusIndex = IssueStatusTransition.indexOf(status);
    const currentStatusIndex = IssueStatusTransition.indexOf(this.status);
    if (currentStatusIndex > newStatusIndex) {
      throw new Error("Invalid status transition");
    }
    if (newStatusIndex - currentStatusIndex > 1) {
      throw new Error("Invalid status transition");
    }
    this.status = status;
  }
}
