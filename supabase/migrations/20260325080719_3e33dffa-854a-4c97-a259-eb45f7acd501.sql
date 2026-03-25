ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS mandal text,
ADD COLUMN IF NOT EXISTS village text;