ALTER TABLE public.prompt_templates
ADD COLUMN industry TEXT NOT NULL DEFAULT 'other';

COMMENT ON COLUMN public.prompt_templates.industry IS 'Industry-specific category for the prompt, e.g., f_b, beauty, fashion, mother_baby, other.';

-- Update existing templates to a default industry
UPDATE public.prompt_templates
SET industry = 'other'
WHERE industry IS NULL OR industry = '';