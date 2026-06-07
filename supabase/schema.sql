-- Rooms (topic-based group voice rooms)
create table rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  topic text not null,
  level text not null check (level in ('Beginner','Intermediate','Advanced','All Levels')),
  max_users int default 6,
  active_count int default 0,
  daily_room_name text,
  created_at timestamptz default now()
);

-- 1-on-1 match queue
create table match_queue (
  id uuid primary key default gen_random_uuid(),
  session_token text unique not null,
  joined_at timestamptz default now(),
  status text default 'waiting' check (status in ('waiting','matched','ended')),
  room_url text,
  meeting_token text,
  matched_at timestamptz,
  country text, -- Dormant country hook
  level text -- Selected speaking level
);

-- Session logs (for future analytics/leaderboard)
create table sessions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id),
  session_type text check (session_type in ('1on1','group')),
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_mins int
);

-- Reports
create table reports (
  id uuid primary key default gen_random_uuid(),
  session_token text,
  reason text not null,
  details text,
  created_at timestamptz default now()
);

-- Push subscriptions
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null,
  keys_p256dh text not null,
  keys_auth text not null,
  created_at timestamptz default now()
);

-- Users (Dormant monetization & profile hooks)
create table users (
  id uuid primary key default gen_random_uuid(),
  session_token text unique not null,
  is_pro boolean default false,
  talk_time_mins int default 0,
  referral_code text unique,
  session_count int default 0,
  created_at timestamptz default now()
);

-- Enable realtime on rooms
alter publication supabase_realtime add table rooms;

-- Seed 5 topic rooms
insert into rooms (slug, name, topic, level, daily_room_name) values
  ('daily-life', 'Daily Life & Routines', 'Talk about your day, hobbies, food, and simple routines.', 'Beginner', 'norinly-daily-life'),
  ('travel', 'Travel Adventures', 'Share travel stories, dream destinations, and local culture.', 'Intermediate', 'norinly-travel'),
  ('debate', 'AI & Society Debates', 'Discuss technology, the future, and global issues.', 'Advanced', 'norinly-debate'),
  ('job-interview', 'Job Interview Practice', 'Practice interviews, CVs, workplace English, and professional conversations.', 'Intermediate', 'norinly-job-interview'),
  ('free-chat', 'Free Chat', 'Talk about anything. No topic, no pressure, just conversation.', 'All Levels', 'norinly-free-chat');
