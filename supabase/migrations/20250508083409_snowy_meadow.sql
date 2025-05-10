/*
  # Create financial goals table

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users table
      - `name` (text) - Goal name
      - `category` (text) - Goal category
      - `target_amount` (decimal) - Target amount to reach
      - `current_amount` (decimal) - Current progress
      - `start_date` (date) - Goal start date
      - `end_date` (date) - Optional target completion date
      - `notes` (text) - Optional goal notes
      - `color` (text) - UI color for the goal
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on goals table
    - Add policies for authenticated users to:
      - Read their own goals
      - Create new goals
      - Update their own goals
      - Delete their own goals
*/

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN (
    'savings', 'debt_repayment', 'emergency_fund', 'travel',
    'education', 'retirement', 'home', 'vehicle', 'gadget', 'other'
  )),
  target_amount decimal(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount decimal(12,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  notes text,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Ensure current_amount doesn't exceed target_amount
  CONSTRAINT current_amount_check CHECK (current_amount <= target_amount)
);

-- Enable RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE
  ON goals
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();