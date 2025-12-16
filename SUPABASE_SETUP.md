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
-- Drop existing table if you want to update schema (WARNING: This deletes all data)
DROP TABLE IF EXISTS computer_issues CASCADE;
DROP TABLE IF EXISTS computer_submissions CASCADE;

CREATE TABLE computer_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unique_id VARCHAR(255) NOT NULL UNIQUE,
  inventory_type VARCHAR(50) NOT NULL,
  serial_number VARCHAR(255) NOT NULL,
  computer_type VARCHAR(50),
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  processor VARCHAR(100) NOT NULL,
  ram VARCHAR(50) NOT NULL,
  storage VARCHAR(50) NOT NULL,
  operating_system VARCHAR(100) NOT NULL,
  purchase_date DATE NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on unique_id for faster lookups
CREATE INDEX idx_computer_submissions_unique_id ON computer_submissions(unique_id);
CREATE INDEX idx_computer_submissions_inventory_type ON computer_submissions(inventory_type);

-- Enable Row Level Security
ALTER TABLE computer_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations" ON computer_submissions
  FOR ALL USING (true);
```

**Important Notes:**
- **Unique ID Format**: `OFN/ITC/INV/{TYPE}-{NUMBER}`
  - Examples: `OFN/ITC/INV/PC-001`, `OFN/ITC/INV/Laptop-025`, `OFN/ITC/INV/Monitor-100`
  - Numbers auto-increment per inventory type (001, 002, 003... 999, 1000...)
- **Inventory Types**: PC, Laptop, CPU, UPS, Mouse, Keyboard, Webcam, Monitor, Switch, MediaConverter
- **Computer Type Field**: Removed (no longer used)

### Table 2: computer_issues
Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE computer_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uid VARCHAR(255) NOT NULL UNIQUE,
  inventory_id UUID NOT NULL,
  unique_id VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) NOT NULL,
  issue_type VARCHAR(20) NOT NULL CHECK (issue_type IN ('section', 'employee')),
  employee_section VARCHAR(255) NOT NULL,
  issued_to VARCHAR(255),
  phone_number VARCHAR(50),
  email VARCHAR(255),
  designation VARCHAR(255),
  issue_date DATE NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (inventory_id) REFERENCES computer_submissions(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_computer_issues_inventory_id ON computer_issues(inventory_id);
CREATE INDEX idx_computer_issues_unique_id ON computer_issues(unique_id);
CREATE INDEX idx_computer_issues_uid ON computer_issues(uid);

-- Enable Row Level Security
ALTER TABLE computer_issues ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations" ON computer_issues
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
- `unique_id`: String (Unique, Auto-generated format: OFN/ITC/INV/{TYPE}-{NUMBER})
- `inventory_type`: String (PC, Laptop, CPU, UPS, Mouse, Keyboard, Webcam, Monitor, Switch, MediaConverter)
- `serial_number`: String
- `computer_type`: String (nullable - deprecated, no longer used)
- `brand`: String
- `model`: String
- `processor`: String
- `ram`: String
- `storage`: String
- `operating_system`: String
- `purchase_date`: Date
- `remarks`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Field Notes:**
- Each inventory type has its own unique ID sequence
- `computer_type` field is deprecated and always null

### computer_issues
- `id`: UUID (Primary Key)
- `uid`: String (Unique, Auto-generated format: UID-{NUMBER}, increments globally across all issues)
- `inventory_id`: UUID (Foreign Key to computer_submissions)
- `unique_id`: String (Copied from computer_submissions for quick reference)
- `serial_number`: String
- `issue_type`: String ('section' or 'employee')
- `employee_section`: String (Section name: ITC, HR, Security, Finance, Operations, Administration, Engineering, Marketing)
- `issued_to`: String (nullable - employee name, only for issue_type='employee')
- `phone_number`: String (nullable - only for issue_type='employee')
- `email`: String (nullable - only for issue_type='employee')
- `designation`: String (nullable - only for issue_type='employee')
- `issue_date`: Date
- `remarks`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

**Field Notes:**
- `uid` is a unique identifier for each issue record, independent of inventory type
- When `issue_type` is 'section', only `employee_section` is required
- When `issue_type` is 'employee', all employee fields (issued_to, phone_number, email, designation) are populated
- `location` field removed (no longer tracked)
