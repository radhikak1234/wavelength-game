# Supabase Setup

Add these values to a local `.env` or `.env.local` file.
This Vite app supports either `VITE_*` names or `NEXT_PUBLIC_*` names.

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key

# or
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
```

Create the `spectrum_cards` table:

```sql
create table if not exists public.spectrum_cards (
  id bigint generated always as identity primary key,
  left_text text not null,
  right_text text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
```

Enable row level security:

```sql
alter table public.spectrum_cards enable row level security;
```

Allow anyone to read active cards:

```sql
create policy "Public read active spectrum cards"
on public.spectrum_cards
for select
using (active = true);
```

Allow inserts from the client-side form:

```sql
create policy "Public insert spectrum cards"
on public.spectrum_cards
for insert
with check (true);
```

Optional seed from the local fallback list by copying rows from [src/components/SpectrumCard/spectrumCards.ts](/Users/radhikakshirsagar/Projects/wavelength-game/src/components/SpectrumCard/spectrumCards.ts).
