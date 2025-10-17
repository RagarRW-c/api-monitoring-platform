-- Tworzenie tabeli logs (jeśli nie istnieje)
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexy dla lepszej wydajności
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);

-- Przykładowe dane dla testów
INSERT INTO logs (level, message, metadata) VALUES
    ('info', 'Application started', '{"source": "system"}'),
    ('info', 'Database connected', '{"source": "system"}'),
    ('warn', 'High memory usage detected', '{"usage": "85%", "source": "monitoring"}')
ON CONFLICT DO NOTHING;