import { Messages } from "../../constants";
/*
    Steps for analyzing trades
        1. scrape the latest trade, check if cache is up to date
        2. if not up to date
        3. scrape trade history until up to date
*/

/*
    Steps for generating recommendations:
        1. send generate message (ticker list in payload or empty)
        2. receive response, generate table, inject
            useful recommendations:
                  i. interesting options (based on vol / OI, price history, technicals, social media)
                 ii. scraped options (sleekoptions, barcharts)
*/

export const onOpen = () => {
  chrome.runtime.sendMessage({ message: Messages.GENERATE_RECOMMMENDATIONS });
};
