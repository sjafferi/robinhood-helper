import { Message } from "./constants";

export interface MessagePayload {
  message: Message;
  payload: any;
}

export interface JiraIssue {
  title: string;
  description: string;
  tests: string[];
  link: string;
}
