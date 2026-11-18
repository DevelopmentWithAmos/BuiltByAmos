import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  ExternalLink,
  FolderGit2,
  GitFork,
  RefreshCw,
  Search,
  Star,
  X,
} from 'lucide-react';
import { GitHubRepo, GitHubUserProfile } from '../types/portfolio';

interface ProjectGalleryProps {
  defaultUsername?: string;
}

type SortOption = 'updated' | 'stars' | 'name';

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getSafeExternalUrl(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  defaultUsername = 'DevelopmentWithAmos',
}) => {
  const [usernameInput, setUsernameInput] = useState(defaultUsername);
  const [activeUsername, setActiveUsername] = useState(defaultUsername);
  const [profile, setProfile] = useState<GitHubUserProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');

  const [inspectedRepo, setInspectedRepo] = useState<GitHubRepo | null>(null);
  const [readmePreview, setReadmePreview] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState<boolean>(false);

  const fetchRepositories = useCallback(async (handle: string, signal?: AbortSignal) => {
    const cleanHandle = handle.trim();
    if (!cleanHandle) return;

    setLoading(true);
    setError(null);
    setSelectedLanguage('All');

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(cleanHandle)}`, {
          headers: { Accept: 'application/vnd.github+json' },
          signal,
        }),
        fetch(
          `https://api.github.com/users/${encodeURIComponent(cleanHandle)}/repos?sort=updated&per_page=24`,
          {
            headers: { Accept: 'application/vnd.github+json' },
            signal,
          }
        ),
      ]);

      if (!reposRes.ok) {
        if (reposRes.status === 404) {
          throw new Error(`GitHub user "${cleanHandle}" was not found.`);
        }
        if (reposRes.status === 403) {
          throw new Error(
            'GitHub API rate limit reached for unauthenticated requests. Please retry in a moment.'
          );
        }
        throw new Error(`GitHub API returned status ${reposRes.status}.`);
      }

      const reposJson = (await reposRes.json()) as GitHubRepo[];
      setRepos(Array.isArray(reposJson) ? reposJson : []);

      if (userRes.ok) {
        const userJson = (await userRes.json()) as GitHubUserProfile;
        setProfile(userJson);
      } else {
        setProfile(null);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setRepos([]);
      setProfile(null);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to fetch repositories from GitHub right now.'
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchRepositories(activeUsername, controller.signal);
    return () => controller.abort();
  }, [activeUsername, fetchRepositories]);

  useEffect(() => {
    if (!inspectedRepo) {
      setReadmePreview(null);
      return;
    }

    const controller = new AbortController();
    setReadmeLoading(true);
    setReadmePreview(null);

    fetch(
      `https://api.github.com/repos/${encodeURIComponent(
        inspectedRepo.owner.login
      )}/${encodeURIComponent(inspectedRepo.name)}/readme`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal,
      }
    )
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { content?: string; encoding?: string };
        if (data.content && data.encoding === 'base64') {
          const decoded = atob(data.content.replace(/\n/g, ''));
          return decoded.slice(0, 1200);
        }
        return null;
      })
      .then((text) => {
        setReadmePreview(text);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setReadmePreview(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setReadmeLoading(false);
        }
      });

    return () => controller.abort();
  }, [inspectedRepo]);

  useEffect(() => {
    if (!inspectedRepo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInspectedRepo(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inspectedRepo]);

  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) langs.add(repo.language);
    });
    return ['All', ...Array.from(langs).sort((a, b) => a.localeCompare(b))];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = repos.filter((repo) => {
      const matchesLang =
        selectedLanguage === 'All' || repo.language === selectedLanguage;
      if (!matchesLang) return false;
      if (!q) return true;
      const inName = repo.name.toLowerCase().includes(q);
      const inDesc = (repo.description ?? '').toLowerCase().includes(q);
      const inTopics = (repo.topics ?? []).some((t) => t.toLowerCase().includes(q));
      return inName || inDesc || inTopics;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [repos, selectedLanguage, searchQuery, sortBy]);

  const handleLoadUser = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    if (!trimmed) return;
    if (trimmed === activeUsername) {
      fetchRepositories(trimmed);
    } else {
      setActiveUsername(trimmed);
    }
  };

  return (
    <section
      id="repositories"
      className="border-t border-zinc-200 bg-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header + Live GitHub Handle Switcher */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#2563EB]">
              Open Source &amp; Live Repositories
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 text-balance sm:text-4xl">
              GitHub Project Gallery
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">
              Live repository telemetry pulled directly from the GitHub REST API.
              Inspect architecture, descriptions, stars, and source links for{' '}
              <span className="font-mono text-sm text-zinc-900">
                @{activeUsername}
              </span>{' '}
              or query any public GitHub username.
            </p>
          </div>

          <form
            onSubmit={handleLoadUser}
            className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto"
          >
            <label htmlFor="github-username-input" className="sr-only">
              GitHub username
            </label>
            <div className="relative flex-1 sm:w-56">
              <FolderGit2
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="github-username-input"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="GitHub username"
                className="w-full rounded-lg border border-zinc-200 bg-[#FAFAFB] py-2.5 pr-3 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#2563EB] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={loading || !usernameInput.trim()}
                className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                Load Repos
              </button>
              <button
                type="button"
                onClick={() => fetchRepositories(activeUsername)}
                disabled={loading}
                aria-label="Refresh GitHub repositories"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </form>
        </div>

        {/* Profile Summary Strip (when GitHub user profile resolves) */}
        {profile && !error && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 py-4">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatar_url}
                alt={`${profile.name ?? profile.login} GitHub avatar`}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full border border-zinc-200 object-cover"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-950">
                  <span>{profile.name ?? profile.login}</span>
                  <span aria-hidden="true" className="text-zinc-300">
                    ·
                  </span>
                  <span className="font-mono text-xs font-normal text-zinc-500">
                    @{profile.login}
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  {profile.bio ?? 'UI/UX Designer & Web Developer'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 tabular-nums">
              <span>{profile.public_repos} Public Repos</span>
              <span aria-hidden="true" className="text-zinc-300">
                ·
              </span>
              <span>{profile.followers} Followers</span>
              <span aria-hidden="true" className="text-zinc-300">
                ·
              </span>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
              >
                GitHub Profile
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}

        {/* Filter, Search, and Sort Toolbar */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div
            className="flex flex-wrap items-center gap-1 rounded-lg bg-zinc-100 p-1"
            role="tablist"
            aria-label="Filter repositories by language"
          >
            {availableLanguages.map((lang) => {
              const isActive = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isActive
                      ? 'bg-white text-zinc-950 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories..."
                aria-label="Search repositories"
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pr-3 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20 sm:w-56"
              />
            </div>

            <label htmlFor="repo-sort-select" className="sr-only">
              Sort repositories
            </label>
            <select
              id="repo-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="min-h-[38px] rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
            >
              <option value="updated">Sort: Recently Updated</option>
              <option value="stars">Sort: Most Stars</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Content States: Loading / Error / Empty / Grid */}
        <div className="mt-8">
          {loading ? (
            <div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              aria-busy="true"
              aria-label="Loading GitHub repositories"
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex h-56 flex-col justify-between rounded-xl border border-zinc-200 bg-[#FAFAFB] p-6"
                >
                  <div className="space-y-3">
                    <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
                  </div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-zinc-200 bg-[#FAFAFB] p-8 text-center">
              <p className="text-base font-semibold text-zinc-950">
                Could not load repositories
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">{error}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchRepositories(activeUsername)}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 whitespace-nowrap shrink-0"
                >
                  Retry Fetch
                </button>
                {activeUsername !== 'DevelopmentWithAmos' && (
                  <button
                    type="button"
                    onClick={() => {
                      setUsernameInput('DevelopmentWithAmos');
                      setActiveUsername('DevelopmentWithAmos');
                    }}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 whitespace-nowrap shrink-0"
                  >
                    Reset to @DevelopmentWithAmos
                  </button>
                )}
              </div>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-[#FAFAFB] p-8 text-center">
              <p className="text-base font-semibold text-zinc-950">
                No matching public repositories found
              </p>
              <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-600">
                {repos.length === 0
                  ? `@${activeUsername} currently has 0 public repositories listed on GitHub.`
                  : 'Try clearing your search query or switching the language filter.'}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {repos.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLanguage('All');
                    }}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 whitespace-nowrap shrink-0"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setUsernameInput('vitejs');
                      setActiveUsername('vitejs');
                    }}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 whitespace-nowrap shrink-0"
                  >
                    Preview Public Org (@vitejs)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRepos.map((repo) => {
                const liveDemoUrl = getSafeExternalUrl(repo.homepage);
                const topics = (repo.topics ?? []).slice(0, 3);

                return (
                  <article
                    key={repo.id}
                    className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-[#FAFAFB] p-6 transition-colors hover:border-zinc-300 hover:bg-white"
                  >
                    <div>
                      {/* Unboxed Metadata Row (Zero-Pill Discipline) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 tabular-nums">
                        <span className="font-medium text-zinc-700">
                          {repo.language ?? 'Documentation'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Updated {formatRelativeDate(repo.updated_at)}</span>
                        {repo.archived && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Archived</span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-zinc-950">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 hover:text-[#2563EB] focus-visible:outline-none focus-visible:underline"
                        >
                          <span className="break-words">{repo.name}</span>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#2563EB]"
                            aria-hidden="true"
                          />
                        </a>
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">
                        {repo.description ||
                          'Repository source code and project documentation hosted on GitHub.'}
                      </p>

                      {topics.length > 0 && (
                        <p className="mt-3 text-xs text-zinc-500">
                          {topics.join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 border-t border-zinc-200/80 pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs text-zinc-600 tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                            {repo.stargazers_count.toLocaleString()}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GitFork
                              className="h-3.5 w-3.5 text-zinc-400"
                              aria-hidden="true"
                            />
                            {repo.forks_count.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-medium">
                          <button
                            type="button"
                            onClick={() => setInspectedRepo(repo)}
                            className="inline-flex items-center gap-1 text-zinc-700 transition-colors hover:text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:underline"
                          >
                            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                            Inspect
                          </button>
                          {liveDemoUrl && (
                            <a
                              href={liveDemoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
                            >
                              Live
                              <ExternalLink
                                className="h-3 w-3"
                                aria-hidden="true"
                              />
                            </a>
                          )}
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-zinc-950 hover:text-[#2563EB] whitespace-nowrap shrink-0"
                          >
                            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                            GitHub
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Repository Detail Lightbox Modal */}
      {inspectedRepo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="repo-modal-title"
          onClick={() => setInspectedRepo(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#2563EB]">
                  {inspectedRepo.owner.login} / Repository Details
                </p>
                <h3
                  id="repo-modal-title"
                  className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950"
                >
                  {inspectedRepo.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedRepo(null)}
                aria-label="Close repository details"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              {inspectedRepo.description ||
                'No repository description was provided on GitHub.'}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-zinc-200 py-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs text-zinc-500">Language</dt>
                <dd className="mt-1 font-medium text-zinc-950">
                  {inspectedRepo.language ?? 'Markdown'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Stars</dt>
                <dd className="mt-1 font-mono font-medium text-zinc-950 tabular-nums">
                  {inspectedRepo.stargazers_count.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Default Branch</dt>
                <dd className="mt-1 font-mono font-medium text-zinc-950">
                  {inspectedRepo.default_branch}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Last Updated</dt>
                <dd className="mt-1 font-medium text-zinc-950 tabular-nums">
                  {formatRelativeDate(inspectedRepo.updated_at)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <h4 className="text-xs font-semibold tracking-wide text-zinc-500">
                README Excerpt
              </h4>
              <div className="mt-2 rounded-xl border border-zinc-200 bg-[#FAFAFB] p-4">
                {readmeLoading ? (
                  <p className="text-xs text-zinc-500">Loading README from GitHub...</p>
                ) : readmePreview ? (
                  <pre className="max-h-56 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-700">
                    {readmePreview}
                  </pre>
                ) : (
                  <p className="text-xs text-zinc-500">
                    No README preview available for this repository.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              {getSafeExternalUrl(inspectedRepo.homepage) && (
                <a
                  href={getSafeExternalUrl(inspectedRepo.homepage)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-zinc-50 whitespace-nowrap shrink-0"
                >
                  Open Live Site
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              <a
                href={inspectedRepo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
              >
                View Repository on GitHub
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
