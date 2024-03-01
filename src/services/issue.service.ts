import Issue from "../entities/issue.entity";
import { CreateIssueDTO } from "../dtos/create-issue.dto";

export default class IssueService {
  private issues: Issue[];
  private static instance: IssueService;

  private constructor() {
    this.issues = [];
  }

  static getInstance() {
    if (!IssueService.instance) {
      IssueService.instance = new IssueService();
    }

    return IssueService.instance;
  }

  getIssues(): Issue[] {
    return this.issues;
  }

  createIssue(request: CreateIssueDTO): Issue {
    return Issue.new(request);
  }

  createIssues(requests: CreateIssueDTO[]): Issue[] {
    const createdIssues = requests.map((request) => Issue.new(request));
    this.issues = [...createdIssues];
    return createdIssues;
  }
}
