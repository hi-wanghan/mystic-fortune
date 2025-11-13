CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  timezone TEXT NOT NULL,
  gender TEXT NOT NULL,
  bazi_data JSONB NOT NULL,        -- 存储计算好的占星数据（星座等）
  elements JSONB NOT NULL,          -- 存储元素分布
  summary TEXT NOT NULL,            -- AI 生成的免费摘要
  full_analysis JSONB,              -- AI 生成的完整解读（付费后才有）
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