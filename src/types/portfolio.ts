export interface CaseStudy {
  id: string;
  title: string;
  discipline: string;
  year: string;
  client: string;
  summary: string;
  challenge: string;
  outcome: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  imageSrc: string;
  imageAlt: string;
  featured?: boolean;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  license?: {
    name: string;
    spdx_id: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  location: string | null;
}

export interface CapabilityItem {
  index: string;
  title: string;
  description: string;
  focusAreas: string[];
}
