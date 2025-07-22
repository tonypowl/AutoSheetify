-- Create transcriptions table for user library
CREATE TABLE public.transcriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  instrument TEXT NOT NULL CHECK (instrument IN ('piano', 'guitar')),
  detected_notes TEXT[] NOT NULL DEFAULT '{}',
  tempo INTEGER NOT NULL DEFAULT 120,
  time_signature TEXT NOT NULL DEFAULT '4/4',
  duration TEXT NOT NULL DEFAULT '0:00',
  pdf_link TEXT,
  midi_link TEXT,
  video_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own transcriptions" 
ON public.transcriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transcriptions" 
ON public.transcriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transcriptions" 
ON public.transcriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transcriptions" 
ON public.transcriptions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_transcriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transcriptions_updated_at
BEFORE UPDATE ON public.transcriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_transcriptions_updated_at();