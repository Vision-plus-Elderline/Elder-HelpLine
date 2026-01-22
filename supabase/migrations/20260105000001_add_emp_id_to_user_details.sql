-- Add emp_id column to user_details table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_details' AND column_name = 'emp_id') THEN
    ALTER TABLE public.user_details ADD COLUMN emp_id TEXT;
  END IF;
END $$;
