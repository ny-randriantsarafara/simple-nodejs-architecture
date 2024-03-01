import { AppOneTicketStatus } from "../object-values/app-one-ticket.status";
import { Owner } from "../object-values/owner.type";
import ThirdPartyTicket from "./third-party-ticket";

export default class AppOneTicket implements ThirdPartyTicket {
  problemId: string;
  myStatus: AppOneTicketStatus;
  count: number;
  owner: Owner;

  constructor({ reference, count }: { reference: string; count: number }) {
    this.problemId = reference;
    this.count = count;
    this.owner = "csTeam";
    this.myStatus = AppOneTicketStatus.RUNNING;
  }

  static new({ reference, count }: { reference: string; count: number }) {
    return new AppOneTicket({ reference, count });
  }

  getReference(): string {
    return this.problemId;
  }

  updateNumbers(count: number) {
    this.count = count;
  }

  closeTicket(count: number) {
    this.myStatus = AppOneTicketStatus.RESOLVED;
  }
}
