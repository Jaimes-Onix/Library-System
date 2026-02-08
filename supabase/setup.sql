-- ============================================================
-- LIBRARY SYSTEM - Complete Supabase Database Setup
-- ============================================================
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================


-- ============================================================
-- 1. PROFILES TABLE (User accounts from sign up)
-- ============================================================
-- Linked to Supabase Auth (auth.users) via id

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT NOT NULL DEFAULT 'User',
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  student_id  TEXT,
  grade_section TEXT,
  course      TEXT,
  photo_url   TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fines', 'suspended')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster role-based queries (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);


-- ============================================================
-- 2. BOOKS TABLE (Uploaded PDFs converted to flipbooks)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.books (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  file_url    TEXT NOT NULL,          -- Path in 'books' storage bucket
  cover_url   TEXT DEFAULT '',        -- Public URL from 'covers' bucket
  total_pages INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster user-specific book queries
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);


-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES Policies ----

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (on sign up)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles (for admin dashboard)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ---- BOOKS Policies ----

-- Users can view their own books
CREATE POLICY "Users can view own books"
  ON public.books FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own books
CREATE POLICY "Users can insert own books"
  ON public.books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own books
CREATE POLICY "Users can update own books"
  ON public.books FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own books
CREATE POLICY "Users can delete own books"
  ON public.books FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all books (for admin dashboard)
CREATE POLICY "Admins can view all books"
  ON public.books FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================================
-- 4. STORAGE BUCKETS
-- ============================================================
-- Run these one at a time if they fail (bucket may already exist)

-- 'books' bucket - stores uploaded PDF files (PRIVATE)
INSERT INTO storage.buckets (id, name, public)
VALUES ('books', 'books', false)
ON CONFLICT (id) DO NOTHING;

-- 'covers' bucket - stores auto-generated book cover images (PUBLIC)
INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- 'avatars' bucket - stores user profile photos (PUBLIC)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 5. STORAGE POLICIES
-- ============================================================

-- ---- BOOKS bucket (private - signed URLs only) ----

-- Users can upload PDFs to their own folder
CREATE POLICY "Users can upload books"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'books'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own PDFs (for signed URL generation)
CREATE POLICY "Users can read own books"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'books'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own PDFs
CREATE POLICY "Users can delete own books"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'books'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ---- COVERS bucket (public read) ----

-- Users can upload covers to their own folder
CREATE POLICY "Users can upload covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Anyone can view covers (public bucket)
CREATE POLICY "Public can view covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- ---- AVATARS bucket (public read) ----

-- Users can upload their own avatar
CREATE POLICY "Users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

-- Users can update (overwrite) their own avatar
CREATE POLICY "Users can update avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

-- Anyone can view avatars (public bucket)
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');


-- ============================================================
-- DONE! Your database is ready.
-- ============================================================
--
-- Summary of what was created:
--
-- TABLES:
--   profiles  - User accounts (id, email, name, role, student_id,
--               grade_section, course, photo_url, status, created_at)
--   books     - Uploaded PDFs (id, user_id, title, file_url,
--               cover_url, total_pages, created_at)
--
-- STORAGE BUCKETS:
--   books     - Private bucket for PDF files
--   covers    - Public bucket for auto-generated book covers
--   avatars   - Public bucket for user profile photos
--
-- RLS POLICIES:
--   - Users can only access their own data
--   - Admins can view all profiles and books
--   - Public can view covers and avatars
-- ============================================================
