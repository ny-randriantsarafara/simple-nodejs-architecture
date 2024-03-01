import { ThirdPartyApp } from "../object-values/third-party.app";

export interface UpdateOrCloseTicketDto {
  appName: ThirdPartyApp;
  count: number;
}
