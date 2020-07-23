import { waitUntil } from "../util";
import { onOpen as onHomeOpen } from "./home/home";

enum RobinhoodPages {
  HOME = "home",
}

waitUntil(
  () =>
    document.readyState === "complete" &&
    document.querySelector("#react_root div[data-page-name]")
).then(() => {
  const pageName = document
    .querySelector("#react_root div[data-page-name]")
    .getAttribute("data-page-name");

  switch (pageName) {
    case RobinhoodPages.HOME: {
      onHomeOpen();
      break;
    }
  }
});
