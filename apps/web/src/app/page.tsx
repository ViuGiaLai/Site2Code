'use client';

import { FormEvent, useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const FRONTENDS = ['nextjs', 'react', 'vue', 'angular', 'svelte'] as const;
const CSS_OPTIONS = ['tailwind', 'bootstrap', 'material-ui', 'chakra', 'none'] as const;
const BACKENDS = ['none', 'nestjs', 'express', 'fastapi', 'springboot'] as const;
const DATABASES = ['none', 'postgresql', 'mysql', 'mongodb', 'sqlite'] as const;

export default function Home() {
  const [url, setUrl] = useState('');
  const [frontend, setFrontend] = useState('nextjs');
  const [css, setCss] = useState('tailwind');
  const [backend, setBackend] = useState('none');
  const [database, setDatabase] = useState('none');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<{
    status: string;
    progress: number;
    error?: string;
    zipPath?: string;
  } | null>(null);

  const pollJob = useCallback(async (id: string) => {
    const res = await fetch(`${API}/api/jobs/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setJob(data);
    if (!['completed', 'failed'].includes(data.status)) {
      setTimeout(() => pollJob(id), 2000);
    }
  }, []);

  useEffect(() => {
    if (jobId) pollJob(jobId);
  }, [jobId, pollJob]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setJob(null);
    try {
      const res = await fetch(`${API}/api/crawl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, frontend, css, backend: backend === 'none' ? undefined : backend, database: database === 'none' ? undefined : database }),
      });
      const data = await res.json();
      setJobId(data.jobId);
    } catch {
      setJob({ status: 'failed', progress: 0, error: 'Failed to start job' });
    } finally {
      setLoading(false);
    }
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      crawling: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      analyzing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      generating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      reviewing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      optimizing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      packaging: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-12 sm:py-24">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Site2Code</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Convert any website URL into a downloadable project
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-base"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Frontend</label>
            <select value={frontend} onChange={(e) => setFrontend(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-sm">
              {FRONTENDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">CSS</label>
            <select value={css} onChange={(e) => setCss(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-sm">
              {CSS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Backend</label>
            <select value={backend} onChange={(e) => setBackend(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-sm">
              {BACKENDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Database</label>
            <select value={database} onChange={(e) => setDatabase(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-sm">
              {DATABASES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !url}
          className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-base hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Starting...' : 'Generate Project'}
        </button>
      </form>

      {job && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(job.status)}`}>
              {job.status}
            </span>
            <span className="text-sm text-zinc-500">{job.progress}%</span>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-700"
              style={{ width: `${job.progress}%` }}
            />
          </div>

          {job.status === 'completed' && (
            <div className="text-center pt-4">
              <a
                href={`${API}/api/export/${jobId}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Download ZIP
              </a>
            </div>
          )}

          {job.status === 'failed' && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              {job.error || 'Something went wrong'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
