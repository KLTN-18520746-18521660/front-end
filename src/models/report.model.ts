export default class Report {
  id?: number;
  user_id?: string;
  post_id?: number;
  comment_id?: number;
  report_type?: string;
  content?: string;
  status?: string;
  report_id?: string;
  created_timestamp?: string;
  last_modified_timestamp?: string;
  fromNow?: {
    created?: string;
    updated?: string;
  };
}

export class ReportSendModel {
  user_id?: string;
  post_id?: number;
  comment_id?: number;
  report_type?: string;
  content?: string;
}