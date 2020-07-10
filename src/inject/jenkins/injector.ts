import { inject } from "../inject";
import { Message } from "../../constants";
import { MessagePayload, JiraIssue } from "../../types";
import { Widget, TableHeader } from "./Widget";

let jiraIssues: JiraIssue[] = [];

const injectWidgets = () => {
  if (jiraIssues.length) {
    const failingTestsElements = Array.from(
      document.querySelectorAll<HTMLTableRowElement>(
        "#projectstatus > tbody > tr"
      )
    );
    failingTestsElements.forEach((tr, index) => {
      const testName = tr.id?.split("E2E-UI-")[1];
      const jiraIssue = jiraIssues.find(
        ({ tests }) => tests.indexOf(testName) > -1
      );
      if (index === 0) {
        inject(TableHeader, {}, tr.lastElementChild);
      } else {
        inject(Widget, { testName, jiraIssue }, tr.lastElementChild);
      }
    });
  }
};

const handleMessage = (request: MessagePayload, sender) => {
  switch (request.message) {
    case Message.RECEIVE_JIRA_ISSUES: {
      jiraIssues.push(request.payload);
      injectWidgets();
      break;
    }
  }
};

export const onOpen = () => {
  chrome.runtime.sendMessage({
    message: Message.OPEN_BROKEN_TESTS_JIRA_FILTER,
  });
  chrome.runtime.onMessage.addListener(handleMessage);
};
