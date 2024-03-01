import { AppTwoTicketStatus } from "../object-values/app-two-ticket.status";
import { Owner } from "../object-values/owner.type";
import ThirdPartyTicket from "./third-party-ticket";

export default class AppTwoTicket implements ThirdPartyTicket {
  problemRef: string;
  status: AppTwoTicketStatus;
  issuesCount: number;
  externalOwner: Owner;

  constructor({
    problemRef,
    issuesCount,
  }: {
    problemRef: string;
    issuesCount: number;
  }) {
    this.problemRef = problemRef;
    this.issuesCount = issuesCount;
    this.status = AppTwoTicketStatus.ON_GOING;
    this.externalOwner = "csTeam";
  }

  static new({
    problemRef,
    issuesCount,
  }: {
    problemRef: string;
    issuesCount: number;
  }) {
    return new AppTwoTicket({ problemRef, issuesCount });
  }

  getReference(): string {
    return this.problemRef;
  }

  updateNumbers(count: number): void {
    this.issuesCount = count;
  }

  closeTicket(): void {
    this.status = AppTwoTicketStatus.ENDED;
  }
}
