interface frashMessage {
  element: string;
  message: string;
}

interface SearchData {
  paginate: number;
  order: string;
  sort: string;
  keyword: string;
  element: string;
}

interface BreadCrumbItem {
  name: string;
  url: string;
}

interface DatePeriod {
  index: number;
  startDate: Date;
  endDate: Date;
}

interface PublicEvent {
  element: string;
  object: {};
}
