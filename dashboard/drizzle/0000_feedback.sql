CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  product_id TEXT NOT NULL,
  target_id TEXT,
  author TEXT NOT NULL,
  author_name TEXT,
  context TEXT NOT NULL,
  ratings_json TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  note TEXT NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp DESC);
