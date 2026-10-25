CREATE TABLE agent_quota (
  bucket TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX agent_quota_expiry ON agent_quota(expires_at);
