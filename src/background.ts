import { Messages } from "./constants";
import { MessagePayload } from "./types";
import { createTab } from "./util";

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener(
  (request: MessagePayload, sender, sendResponse) => {
    let isResponseAsync = false;

    switch (request.message) {
      case Messages.GENERATE_RECOMMMENDATIONS: {
        chrome.tabs.remove(sender.tab.id);
        break;
      }
      case Messages.CLOSE_TAB: {
        chrome.tabs.remove(sender.tab.id);
        break;
      }
    }

    return isResponseAsync;
  }
);
