/*
  # Initial schema setup for FinTrack

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to Supabase Auth user ID
      - `name` (text) - User's display name
      - `age` (integer) - User's age
      - `role` (text) - User's financial role (student, employed, etc.)
      - `starting_balance` (decimal) - Initial account balance
      - `currency` (text) - Preferred currency code
      - `monthly_income_estimate` (decimal) - Estimated monthly income
      - `monthly_expense_estimate` (decimal) - Estimated monthly expenses
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on users table
    - Add policies for authenticated users to:
      - Read their own data
      - Update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  age integer,
  role text NOT NULL CHECK (role IN ('student', 'employed', 'freelancer', 'business_owner', 'retired', 'other')),
  starting_balance decimal(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  monthly_income_estimate decimal(12,2),
  monthly_expense_estimate decimal(12,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE
  ON users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();