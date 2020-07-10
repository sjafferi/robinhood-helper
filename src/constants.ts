export const brokenTestsJiraFilterUrl =
  "https://jira.kumoroku.com/jira/browse/SUMO-141992?filter=22557&jql=labels%20in%20(jenkins_breakage)%20AND%20labels%20in%20(bvt)%20AND%20(Deployment%20in%20(nite%2C%20Nite)%20OR%20labels%20%3D%20bvt-nite%20OR%20labels%20%3D%20bvt-nite)%20AND%20resolution%20%3D%20Unresolved";

export const brokenTestsJenkinsNiteUrl =
  "https://jenkins.kumoroku.com/view/PradaIT/view/NITE/view/Broken(All)/";

export enum Message {
  OPEN_BROKEN_TESTS_JIRA_FILTER,
  SEND_JIRA_ISSUES,
  RECEIVE_JIRA_ISSUES,
  CLOSE_TAB,
}
