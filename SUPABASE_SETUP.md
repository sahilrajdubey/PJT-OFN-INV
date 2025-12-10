# Supabase Database Setup Guide

## Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project

## Step 2: Get API Keys
1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key

## Step 3: Update .env.local
Replace the placeholder values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Create Database Tables

### Table 1: computer_submissions
Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE computer_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_tag VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) NOT NULL,
  computer_type VARCHAR(50) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  processor VARCHAR(100) NOT NULL,
  ram VARCHAR(50) NOT NULL,
  storage VARCHAR(50) NOT NULL,
  operating_system VARCHAR(100) NOT NULL,
  assigned_to VARCHAR(255) NOT NULL,
  section VARCHAR(255) NOT NULL,
  purchase_date DATE NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE computer_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations" ON computer_submissions
  FOR ALL USING (true);
```

### Table 2: computer_transfers
Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE computer_transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_tag VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  from_section VARCHAR(255) NOT NULL,
  to_section VARCHAR(255),
  transferred_to VARCHAR(255),
  reason TEXT NOT NULL,
  exit_date DATE NOT NULL,
  approved_by VARCHAR(255) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  accessories TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE computer_transfers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON computer_transfers
  FOR ALL USING (true);
```

## Step 5: Restart Development Server
After updating `.env.local`, restart your Next.js server:
```bash
npm run dev
```

## Database Schema

### computer_submissions
- `id`: UUID (Primary Key)
- `asset_tag`: String
- `serial_number`: String
- `computer_type`: String (desktop, laptop, workstation, server)
- `brand`: String
- `model`: String
- `processor`: String
- `ram`: String
- `storage`: String
- `operating_system`: String
- `assigned_to`: String
- `section`: String
- `purchase_date`: Date
- `remarks`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

### computer_transfers
- `id`: UUID (Primary Key)
- `asset_tag`: String
- `serial_number`: String
- `action_type`: String (transfer, exit, return, repair)
- `from_section`: String
- `to_section`: String (nullable)
- `transferred_to`: String (nullable)
- `reason`: Text
- `exit_date`: Date
- `approved_by`: String
- `condition`: String (excellent, good, fair, poor, damaged)
- `accessories`: Text
- `remarks`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp
