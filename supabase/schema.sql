create table if not exists public.portfolio_content (
  id integer primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

drop policy if exists "Portfolio content is publicly readable" on public.portfolio_content;
create policy "Portfolio content is publicly readable"
  on public.portfolio_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated admins can update portfolio content" on public.portfolio_content;
create policy "Authenticated admins can update portfolio content"
  on public.portfolio_content for all
  to authenticated
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

