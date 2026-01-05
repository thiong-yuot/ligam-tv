-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  preview_video_url TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT,
  level TEXT DEFAULT 'beginner',
  language TEXT DEFAULT 'English',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  total_duration_minutes INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  total_enrollments INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course sections table
CREATE TABLE public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create course lessons table
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  content_type TEXT DEFAULT 'video',
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount_paid NUMERIC DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  completed_lessons UUID[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Create creator availability table
CREATE TABLE public.creator_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table for tutoring sessions
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  learner_id UUID NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_url TEXT,
  status TEXT DEFAULT 'pending',
  price NUMERIC DEFAULT 0,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Creators can view own courses" ON public.courses
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can create courses" ON public.courses
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own courses" ON public.courses
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own courses" ON public.courses
  FOR DELETE USING (auth.uid() = creator_id);

-- Course sections policies
CREATE POLICY "Sections viewable for published courses" ON public.course_sections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (is_published = true OR creator_id = auth.uid()))
  );

CREATE POLICY "Creators can manage sections" ON public.course_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND creator_id = auth.uid())
  );

-- Course lessons policies  
CREATE POLICY "Lessons viewable for enrolled users or preview" ON public.course_lessons
  FOR SELECT USING (
    is_preview = true OR
    EXISTS (
      SELECT 1 FROM public.course_sections cs
      JOIN public.courses c ON c.id = cs.course_id
      WHERE cs.id = section_id AND c.creator_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.course_sections cs
      JOIN public.enrollments e ON e.course_id = cs.course_id
      WHERE cs.id = section_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Creators can manage lessons" ON public.course_lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_sections cs
      JOIN public.courses c ON c.id = cs.course_id
      WHERE cs.id = section_id AND c.creator_id = auth.uid()
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Creators can view course enrollments" ON public.enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND creator_id = auth.uid())
  );

CREATE POLICY "Users can enroll" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment progress" ON public.enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Course reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Enrolled users can review" ON public.course_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.enrollments WHERE course_id = course_reviews.course_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own reviews" ON public.course_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Creator availability policies
CREATE POLICY "Availability is viewable by everyone" ON public.creator_availability
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage own availability" ON public.creator_availability
  FOR ALL USING (auth.uid() = creator_id);

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = learner_id OR auth.uid() = creator_id);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = learner_id);

CREATE POLICY "Participants can update bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = learner_id OR auth.uid() = creator_id);

-- Trigger for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at
  BEFORE UPDATE ON public.course_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();