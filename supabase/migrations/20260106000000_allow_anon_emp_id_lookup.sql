-- Allow anonymous users to look up email by emp_id for login purposes
CREATE POLICY "Allow anonymous email lookup by emp_id"
ON public.profiles FOR SELECT
TO anon
USING (true);

-- Also ensure authenticated users can look up other profiles by emp_id (e.g. for admin features if not already covered)
-- This is already partially covered by "Admins can view all profiles" but let's be explicit if needed.
-- However, for the login issue, 'anon' is the key.
