-- pattern_counts: anonymous aggregate logging for evidence-based statistics.
-- One row per edit. NO draft text is ever stored — there is no column for it.
-- Run this once in the Supabase SQL editor (Dashboard → SQL). The app writes
-- with the service-role key via lib/pattern-log.js.

create table if not exists public.pattern_counts (
  id          bigint generated always as identity primary key,
  categories  text[]      not null default '{}',   -- taxonomy ids flagged this run
  word_count  integer     not null,                -- approximate draft length
  created_at  timestamptz not null default now()
);

-- Filter fast by category, e.g. rows where 'buzz-verbs' = any(categories).
create index if not exists pattern_counts_categories_idx
  on public.pattern_counts using gin (categories);
create index if not exists pattern_counts_created_at_idx
  on public.pattern_counts (created_at);

-- RLS on with NO policies: anon/auth clients can neither read nor write.
-- The server inserts with the service-role key, which bypasses RLS.
alter table public.pattern_counts enable row level security;

-- Example aggregate query (run once you have real volume):
--   select unnest(categories) as category,
--          count(*)                                   as drafts_with_pattern,
--          round(100.0 * count(*) /
--                (select count(*) from pattern_counts), 1) as pct_of_all_drafts
--   from pattern_counts
--   group by 1
--   order by 2 desc;
