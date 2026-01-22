-- Create user_details table
CREATE TABLE public.user_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  gender TEXT,
  state TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_details_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS) for user_details
ALTER TABLE public.user_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_details
CREATE POLICY "Users can view their own user details"
ON public.user_details FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user details"
ON public.user_details FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own user details"
ON public.user_details FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user details"
ON public.user_details FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for user_details updates
CREATE TRIGGER update_user_details_updated_at
  BEFORE UPDATE ON public.user_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
