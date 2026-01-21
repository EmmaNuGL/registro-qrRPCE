CREATE TABLE movements (
  id SERIAL PRIMARY KEY,

  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),

  movement_type VARCHAR(30) NOT NULL
    CHECK (movement_type IN ('CREATE', 'UPDATE', 'STATUS_CHANGE', 'SCAN')),

  previous_status VARCHAR(20),
  new_status VARCHAR(20),

  notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
