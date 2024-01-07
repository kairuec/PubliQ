interface InfoItem {
  id: number;
  title: string;
  url: string;
  image: string;
  description: string;
  updated_at: string;
  tag: string;
  tagUrl: string;
  public: number;
  element: string;
}

interface InfoData {
  current_page: number;
  data: InfoItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface InfoFetch {
  id: number;
  title: string;
  url: string;
  content: string;
  image: string;
  description: string;
  public: boolean;
  noindex: boolean;
  updated_at: string;
  tag: string;
  tagUrl: string;
  tagElement: string;
  child: Child[];
}

interface Child {
  id: number;
  child_title: string;
  child_content: string;
}

type Tag = {
  name: string;
  url: string;
  element: string;
};

interface successInfoImage {
  fileName: string;
  url: String;
}

interface errorInfoImage {
  fileName: string;
  url: string;
  errors: {
    [key: string]: any;
  };
}
