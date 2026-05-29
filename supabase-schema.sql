-- Toiletten-Tabelle
create table toilets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text not null,
  city text not null default 'München',
  lat double precision not null,
  lng double precision not null,
  rating_avg double precision,
  rating_count integer not null default 0,
  is_accessible boolean not null default false,
  is_free boolean not null default true,
  opening_hours text,
  created_at timestamptz not null default now()
);

-- Bewertungen-Tabelle
create table ratings (
  id uuid primary key default gen_random_uuid(),
  toilet_id uuid not null references toilets(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- Funktion: rating_avg und rating_count automatisch aktualisieren
create or replace function update_toilet_rating()
returns trigger as $$
begin
  update toilets
  set
    rating_avg = (select avg(score) from ratings where toilet_id = coalesce(new.toilet_id, old.toilet_id)),
    rating_count = (select count(*) from ratings where toilet_id = coalesce(new.toilet_id, old.toilet_id))
  where id = coalesce(new.toilet_id, old.toilet_id);
  return new;
end;
$$ language plpgsql;

create trigger on_rating_change
after insert or update or delete on ratings
for each row execute function update_toilet_rating();

-- Row Level Security
alter table toilets enable row level security;
alter table ratings enable row level security;

-- Öffentlich lesbar
create policy "Öffentlich lesen" on toilets for select using (true);
create policy "Öffentlich lesen" on ratings for select using (true);

-- Nur authentifizierte Admins dürfen schreiben
create policy "Admin schreiben" on toilets for all using (auth.role() = 'authenticated');
create policy "Admin schreiben" on ratings for all using (auth.role() = 'authenticated');

-- Beispieldaten (München)
insert into toilets (name, description, address, city, lat, lng, is_free, is_accessible, opening_hours) values
  ('Marienhof', 'Öffentliche Toilette am Marienhof', 'Marienhof, 80331 München', 'München', 48.13748, 11.57549, true, true, 'Mo-So 8:00–22:00'),
  ('Marienplatz U-Bahn', 'Toilette im U-Bahnhof Marienplatz', 'Marienplatz, 80331 München', 'München', 48.13713, 11.57568, false, true, '6:00–24:00'),
  ('Viktualienmarkt', 'Toilettenanlage am Viktualienmarkt', 'Viktualienmarkt 15, 80331 München', 'München', 48.13481, 11.57602, false, false, 'Mo-Sa 8:00–20:00'),
  ('Englischer Garten Eingang', 'Sanitäranlagen am Eingang', 'Englischer Garten, 80538 München', 'München', 48.14397, 11.58531, true, true, '24h'),
  ('Hauptbahnhof', 'Toilettenanlage Hauptbahnhof', 'Bayerstr. 10a, 80335 München', 'München', 48.14039, 11.55941, false, true, '24h');
