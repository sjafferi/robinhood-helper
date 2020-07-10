import React from "react";
import { JiraIssue } from "../../types";
import "./Widget.scss";

interface WidgetProps {
  testName: string;
  jiraIssue?: JiraIssue;
}

enum Area {
  UI_FRONTEND = "11732",
}

interface CreateIssueFields {
  summary: string;
  description: string;
  labels: string[];
  area: string;
  pid: number;
  issueType: number;
}

const buildCreateIssueUrl = ({
  summary,
  description,
  labels = ["bvt", "bvt-nite", "jenkins_breakage"],
  area = Area.UI_FRONTEND,
  issueType = 1,
  pid = 10000,
}: Partial<CreateIssueFields>) => {
  const baseUrl = `https://jira.kumoroku.com/jira/secure/CreateIssueDetails!init.jspa`;
  const formattedLabels = labels.map((label) => `labels=${label}`).join("&");
  const queryParams = `?issuetype=${issueType}&pid=${pid}&summary=${summary}&description=${description}&customfield_10460=${area}&${formattedLabels}`;
  return `${baseUrl}${queryParams}`;
};

const buildJenkinsJobUrl = (testSuiteName: string) =>
  `https://jenkins.kumoroku.com/view/PradaIT/view/NITE/view/Broken(All)/job/${testSuiteName}`;

export const Widget: React.SFC<WidgetProps> = ({ testName, jiraIssue }) => {
  const testSuiteName = `Master-E2E-UI-${testName}`;
  return (
    <div className="widget-container">
      {jiraIssue && (
        <a href={jiraIssue.link} target="_blank">
          Issue
        </a>
      )}
      {!jiraIssue && (
        <a
          href={buildCreateIssueUrl({
            summary: `${testSuiteName} is failing`,
            description: `Link: ${buildJenkinsJobUrl(testSuiteName)}`,
          })}
          target="_blank"
        >
          Create Issue
        </a>
      )}
    </div>
  );
};

export const TableHeader: React.SFC = () => {
  return <a className="table-header sortheader">Jira Action{"  "}</a>;
};
