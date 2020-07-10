import { Message, brokenTestsJiraFilterUrl } from "./constants";
import { MessagePayload } from "./types";

let jenkinsTab, jiraTab;

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener(
  (request: MessagePayload, sender, sendResponse) => {
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;
    switch (request.message) {
      case Message.OPEN_BROKEN_TESTS_JIRA_FILTER: {
        jenkinsTab = sender.tab;
        openBrokenTestsFilter();
        break;
      }
      case Message.SEND_JIRA_ISSUES: {
        if (jenkinsTab?.id) {
          chrome.tabs.sendMessage(jenkinsTab.id, {
            message: Message.RECEIVE_JIRA_ISSUES,
            payload: request.payload,
          });
        }
        break;
      }
      case Message.CLOSE_TAB: {
        chrome.tabs.remove(sender.tab.id);
        break;
      }
    }

    return isResponseAsync;
  }
);

function createTab(url, options): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, ...options }, async (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === "complete" && tabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  });
}

async function openBrokenTestsFilter() {
  jiraTab = await createTab(brokenTestsJiraFilterUrl, { selected: false });
}
