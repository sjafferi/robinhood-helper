import {
  Message,
  brokenTestsJiraFilterUrl,
  brokenTestsJenkinsNiteUrl,
} from "../constants";
import { onOpen as onJenkinsOpen } from "./jenkins/injector";
import { onOpen as onJiraOpen } from "./jira/parser";

const readyStateCheckInterval = setInterval(() => {
  if (document.readyState === "complete") {
    // ----------------------------------------------------------
    // This part of the script triggers when page is done loading
    clearInterval(readyStateCheckInterval);

    switch (document.URL) {
      case brokenTestsJenkinsNiteUrl: {
        onJenkinsOpen();
        break;
      }
      case brokenTestsJiraFilterUrl: {
        onJiraOpen();
        break;
      }
    }
  }
}, 10);
