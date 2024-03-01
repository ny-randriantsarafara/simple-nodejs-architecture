import { ThirdPartyApp } from "../object-values/third-party.app";

export default interface CreateTicketDto {
  appName: ThirdPartyApp;
  reference: string;
  count: number;
}
