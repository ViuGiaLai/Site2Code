'use client';

import { FormEvent, useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const FRONTENDS = ['nextjs', 'react', 'vue', 'angular', 'svelte'] as const;
const CSS_OPTIONS = ['tailwind', 'bootstrap', 'material-ui', 'chakra', 'none'] as const;
const BACKENDS = ['none', 'nestjs', 'express', 'fastapi', 'springboot'] as const;
const DATABASES = ['none', 'postgresql', 'mysql', 'mongodb', 'sqlite'] as const;

const STAGES = [
  { key: 'crawling', label: 'Crawl' },
  { key: 'analyzing', label: 'Analyze' },
  { key: 'generating', label: 'Generate' },
  { key: 'reviewing', label: 'Review' },
  { key: 'optimizing', label: 'Optimize' },
  { key: 'security', label: 'Secure' },
  { key: 'packaging', label: 'Package' },
] as const;

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-mono uppercase tracking-[0.14em] text-[#7FA0BF] mb-2">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-sm border border-[#2A5279] bg-[#0F3355] px-3 py-2.5 text-sm text-[#E7EEF5] font-mono focus:outline-none focus:ring-1 focus:ring-[#4FD8E0] focus:border-[#4FD8E0] transition-colors"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-[#0F3355]">
              {o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#4FD8E0]"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </label>
  );
}

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
        body: JSON.stringify({
          url,
          frontend,
          css,
          backend: backend === 'none' ? undefined : backend,
          database: database === 'none' ? undefined : database,
        }),
      });
      const data = await res.json();
      setJobId(data.jobId);
    } catch {
      setJob({ status: 'failed', progress: 0, error: 'Failed to start job' });
    } finally {
      setLoading(false);
    }
  }

  const rawIndex =
    job?.status === 'completed'
      ? STAGES.length
      : STAGES.findIndex((s) => s.key === job?.status);
  const stageIndex = Math.max(0, rawIndex);
  const clampedIndex = Math.min(stageIndex, STAGES.length - 1);
  const progressFraction = clampedIndex / (STAGES.length - 1);

  return (
    <div
      className="min-h-screen w-full bg-[#0B2942] text-[#E7EEF5]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="max-w-2xl mx-auto px-5 py-14 sm:py-20">
        {/* Title block */}
        <header className="mb-10 border-b border-[#1E4A70] pb-4 flex items-end justify-between">
          <div>
            <h1 className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight">
              SITE2CODE
            </h1>
            <p className="mt-1 text-sm text-[#7FA0BF] font-mono">
              url → stack compiler
            </p>
          </div>
          <span className="hidden sm:block text-[11px] font-mono text-[#4A6E90] tracking-wider">
            REV A
          </span>
        </header>

        {/* Input panel */}
        <form
          onSubmit={handleSubmit}
          className="relative border border-[#1E4A70] bg-[#0F3355]/60 p-6 sm:p-8 space-y-8"
        >
          <span className="absolute -top-px -left-px h-3 w-3 border-t border-l border-[#4FD8E0]" />
          <span className="absolute -top-px -right-px h-3 w-3 border-t border-r border-[#4FD8E0]" />
          <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-[#4FD8E0]" />
          <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-[#4FD8E0]" />

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-[#4FD8E0]">01</span>
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#7FA0BF]">
                Source
              </span>
              <span className="flex-1 h-px bg-[#1E4A70]" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full rounded-sm border border-[#2A5279] bg-[#0F3355] px-4 py-3 text-sm font-mono placeholder:text-[#4A6E90] focus:outline-none focus:ring-1 focus:ring-[#4FD8E0] focus:border-[#4FD8E0] transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-[#4FD8E0]">02</span>
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#7FA0BF]">
                Stack
              </span>
              <span className="flex-1 h-px bg-[#1E4A70]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Frontend" value={frontend} onChange={setFrontend} options={FRONTENDS} />
              <Field label="Styling" value={css} onChange={setCss} options={CSS_OPTIONS} />
              <Field label="Backend" value={backend} onChange={setBackend} options={BACKENDS} />
              <Field label="Database" value={database} onChange={setDatabase} options={DATABASES} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !url}
            className="w-full py-3.5 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-[#0B2942] bg-[#E8A33D] hover:bg-[#F0B65C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)' }}
          >
            {loading ? 'Starting…' : '▶ Compile project'}
          </button>
        </form>

        {/* Pipeline */}
        {job && (
          <div className="mt-10 border border-[#1E4A70] bg-[#0F3355]/40 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#7FA0BF]">
                Build pipeline
              </span>
              <span className="font-mono text-sm text-[#4FD8E0]">{job.progress}%</span>
            </div>

            {job.status !== 'failed' ? (
              <div className="relative">
                <div className="absolute top-3 left-3 right-3 h-px bg-[#1E4A70]" />
                <div
                  className="absolute top-3 left-3 h-px bg-[#4FD8E0] transition-all duration-700"
                  style={{ width: `calc(${progressFraction} * (100% - 24px))` }}
                />
                <div className="relative flex justify-between">
                  {STAGES.map((stage, i) => {
                    const done = i < stageIndex;
                    const active = i === stageIndex && job.status !== 'completed';
                    return (
                      <div key={stage.key} className="flex flex-col items-center gap-2 w-0 flex-1">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-mono border transition-colors ${
                            done
                              ? 'bg-[#4FD8E0] border-[#4FD8E0] text-[#0B2942]'
                              : active
                              ? 'border-[#4FD8E0] text-[#4FD8E0] motion-safe:animate-pulse'
                              : 'border-[#2A5279] text-[#4A6E90]'
                          }`}
                        >
                          {done ? '✓' : i + 1}
                        </div>
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wide text-center ${
                            done || active ? 'text-[#E7EEF5]' : 'text-[#4A6E90]'
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="border border-[#5A2A2E] bg-[#3A1518]/60 px-4 py-3 text-sm font-mono text-[#F2A6A0]">
                ⚠ {job.error || 'Build failed'}
              </div>
            )}

            {job.status === 'completed' && (
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                <a
                  href={`${API}/api/export/${jobId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-[#0B2942] bg-[#E8A33D] hover:bg-[#F0B65C] transition-colors"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)' }}
                >
                  ⬇ Download zip
                </a>
                <span className="rotate-[-4deg] border border-dashed border-[#4FD8E0] text-[#4FD8E0] text-[10px] font-mono uppercase tracking-widest px-2 py-1">
                  Build approved
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}