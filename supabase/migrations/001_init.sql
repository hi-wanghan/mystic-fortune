CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  timezone TEXT NOT NULL,
  gender TEXT NOT NULL,
  astro_data JSONB NOT NULL,
  elements JSONB NOT NULL,
  summary TEXT NOT NULL,
  full_analysis JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  payment_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES readings(id),
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  customer_email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);