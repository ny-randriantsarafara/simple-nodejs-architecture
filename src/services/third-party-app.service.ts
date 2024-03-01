import { ThirdPartyApp } from "../object-values/third-party.app";
import Problem from "../entities/problem.entity";
import { ProblemStatus } from "../object-values/problem.status";
import ThirdPartyTicket from "../entities/third-party-ticket";
import CreateTicketDto from "../dtos/create-ticket.dto";
import AppOneTicket from "../entities/app-one-ticket.entity";
import AppTwoTicket from "../entities/app-two-ticket.entity";
import { UpdateOrCloseTicketDto } from "../dtos/update-or-close-ticket.dto";

export default class ThirdPartyAppService {
  private static instance: ThirdPartyAppService;
  appOneTickets: ThirdPartyTicket[];
  appTwoTickets: ThirdPartyTicket[];

  constructor() {
    this.appOneTickets = [];
    this.appTwoTickets = [];
  }

  static getInstance() {
    if (!ThirdPartyAppService.instance) {
      ThirdPartyAppService.instance = new ThirdPartyAppService();
    }

    return ThirdPartyAppService.instance;
  }

  isValidThirdPartyApps(appName: any): appName is ThirdPartyApp {
    return Object.values(ThirdPartyApp).includes(appName);
  }

  createTicket(
    createTicketDto: CreateTicketDto,
    problem: Problem,
  ): ThirdPartyTicket {
    if (problem.status !== ProblemStatus.READY) {
      throw new Error("Problem should have status READY to create a ticket");
    }
    if (createTicketDto.appName === ThirdPartyApp.APP_ONE) {
      const createdTicket = AppOneTicket.new({
        reference: createTicketDto.reference,
        count: createTicketDto.count,
      });
      this.appOneTickets.push(createdTicket);
      return createdTicket;
    }
    const createdTicket = AppTwoTicket.new({
      problemRef: createTicketDto.reference,
      issuesCount: createTicketDto.count,
    });
    this.appTwoTickets.push(createdTicket);
    return createdTicket;
  }

  getTicket(app: ThirdPartyApp, problemId: string): ThirdPartyTicket {
    let foundTicket;
    if (app === ThirdPartyApp.APP_ONE) {
      foundTicket = this.appOneTickets.find(
        (ticket) => ticket.getReference() === problemId,
      );
    }
    if (app === ThirdPartyApp.APP_TWO) {
      foundTicket = this.appTwoTickets.find(
        (ticket) => ticket.getReference() === problemId,
      );
    }
    if (!foundTicket) {
      throw new Error("Ticket not found");
    }
    return foundTicket;
  }

  updateTicket(
    updateTicketDto: UpdateOrCloseTicketDto,
    problem: Problem,
  ): ThirdPartyTicket {
    if (problem.status !== ProblemStatus.OPEN) {
      throw new Error("Problem should have status OPEN to update a ticket");
    }
    const foundTicket = this.getTicket(updateTicketDto.appName, problem.id);
    foundTicket.updateNumbers(updateTicketDto.count);
    this.updateStoredTicket(updateTicketDto.appName, problem.id, foundTicket);
    return foundTicket;
  }

  closeTicket(
    closeTicketDto: UpdateOrCloseTicketDto,
    problem: Problem,
  ): ThirdPartyTicket {
    if (problem.status !== ProblemStatus.CLOSED) {
      throw new Error("Problem should have status CLOSED to close a ticket");
    }
    const foundTicket = this.getTicket(closeTicketDto.appName, problem.id);
    foundTicket.updateNumbers(closeTicketDto.count);
    foundTicket.closeTicket(closeTicketDto.count);
    this.updateStoredTicket(closeTicketDto.appName, problem.id, foundTicket);
    return foundTicket;
  }

  private updateStoredTicket(
    app: ThirdPartyApp,
    problemId: string,
    foundTicket: ThirdPartyTicket,
  ): void {
    if (app === ThirdPartyApp.APP_ONE) {
      this.appOneTickets = [
        ...this.appOneTickets.map((ticket) =>
          ticket.getReference() === problemId ? foundTicket : ticket,
        ),
      ];
    }
    if (app === ThirdPartyApp.APP_TWO) {
      this.appTwoTickets = [
        ...this.appTwoTickets.map((ticket) =>
          ticket.getReference() === problemId ? foundTicket : ticket,
        ),
      ];
    }
  }
}
