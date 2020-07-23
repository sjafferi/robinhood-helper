import { Messages } from "../../constants";
import { JiraIssue, MessagePayload } from "../../types";

/*
    1. Get all issue numbers
    2. Follow all links
    3. Scrape title / description
    4. Store in persistent data structure
*/

export const getIssueLinks = () => {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".issue-list a")
  );
};

export const parseIssues = () => {
  const issues: JiraIssue[] = [];
  const issueLinks = getIssueLinks();
  const onFetchIssueSuccess = (issue: JiraIssue) => {
    // chrome.runtime.sendMessage({
    //   message: Message.SEND_JIRA_ISSUES,
    //   payload: issue,
    // });
  };
  const fetchIssue = (idx) => {
    if (idx >= issueLinks.length) {
      chrome.runtime.sendMessage({
        message: Messages.CLOSE_TAB,
      });
      return;
    }
    issueLinks[idx].click();
    var interval = setInterval(() => {
      const isLoading = document.querySelector(".loading");

      if (!isLoading) {
        const title = document
          .querySelector("#issue-content h1")
          ?.textContent.trim();
        const description = document
          .querySelector("#issue-content #description-val")
          ?.textContent.trim();

        if (title && description) {
          const tests = new Set<string>();

          const testRegex = /E2E-UI-\w+/gi;
          let match = testRegex.exec(`${title}\n${description}`);

          while (match) {
            tests.add(match[0].split("E2E-UI-")[1]);
            match = testRegex.exec(`${title}\n${description}`);
          }

          const issue = {
            title,
            description,
            tests: Array.from(tests),
            link: issueLinks[idx].href,
          };
          issues.push(issue);
          onFetchIssueSuccess(issue);

          clearInterval(interval);

          if (idx < issueLinks.length) {
            fetchIssue(idx + 1);
          }
        }
      }
    }, 100);
  };

  fetchIssue(0);
};

export const onOpen = () => {
  parseIssues();
};
