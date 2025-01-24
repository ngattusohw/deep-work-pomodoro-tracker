/*
  # Pomodoro and Deep Work Tracking Schema

  1. New Tables
    - `pomodoro_sessions`
      - Tracks individual pomodoro sessions
      - Records start/end time, completion status
      - Stores distraction count
    - `deep_work_logs`
      - Aggregates completed pomodoros into deep work sessions
      - Links to pomodoro sessions
    - `screen_time_logs`
      - Stores device screen time data
      - Used for calculating time wasted metrics

  2. Security
    - Enable RLS on all new tables
    - Add policies for secure data access
*/

-- Create custom types
CREATE TYPE pomodoro_status AS ENUM (
  'completed',
  'interrupted',
  'cancelled'
);

-- Create tables
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  duration_minutes integer NOT NULL DEFAULT 25,
  status pomodoro_status,
  distraction_count integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deep_work_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_pomodoros integer DEFAULT 0,
  total_minutes integer DEFAULT 0,
  total_distractions integer DEFAULT 0,
  summary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS screen_time_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  app_name text NOT NULL,
  usage_minutes integer NOT NULL,
  is_productive boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deep_work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_time_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their pomodoro sessions"
  ON pomodoro_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their deep work logs"
  ON deep_work_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their screen time logs"
  ON screen_time_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_pomodoro_sessions_user_date ON pomodoro_sessions (user_id, (DATE(start_time)));
CREATE INDEX idx_deep_work_logs_user_date ON deep_work_logs (user_id, date);
CREATE INDEX idx_screen_time_logs_user_date ON screen_time_logs (user_id, date);

-- Create function to update deep work logs
CREATE OR REPLACE FUNCTION update_deep_work_log()
RETURNS trigger AS $$
BEGIN
  -- Update or insert deep work log for the day
  INSERT INTO deep_work_logs (
    user_id,
    date,
    total_pomodoros,
    total_minutes,
    total_distractions
  )
  SELECT
    NEW.user_id,
    DATE(NEW.start_time),
    COUNT(*),
    SUM(duration_minutes),
    SUM(distraction_count)
  FROM pomodoro_sessions
  WHERE user_id = NEW.user_id
    AND DATE(start_time) = DATE(NEW.start_time)
    AND status = 'completed'
  GROUP BY user_id, DATE(start_time)
  ON CONFLICT (user_id, date) DO UPDATE
  SET
    total_pomodoros = EXCLUDED.total_pomodoros,
    total_minutes = EXCLUDED.total_minutes,
    total_distractions = EXCLUDED.total_distractions,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update deep work logs
CREATE TRIGGER update_deep_work_log_trigger
  AFTER INSERT OR UPDATE ON pomodoro_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_deep_work_log();