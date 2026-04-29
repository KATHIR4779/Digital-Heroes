-- Initial Schema for Digital Heroes

-- Roles enum
CREATE TYPE user_role AS ENUM ('admin', 'subscriber');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'canceled', 'past_due');
CREATE TYPE draw_status AS ENUM ('pending', 'simulated', 'published');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- CHARITIES TABLE
CREATE TABLE charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    total_contributed DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROFILES TABLE (Extends Supabase Auth Users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'subscriber',
    selected_charity_id UUID REFERENCES charities(id) ON DELETE SET NULL,
    charity_contribution_percentage INT DEFAULT 10 CHECK (charity_contribution_percentage >= 10 AND charity_contribution_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBSCRIPTIONS TABLE
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    status subscription_status DEFAULT 'inactive',
    plan_type TEXT,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCORES TABLE (Only 1 per date, max 5 per user handled via trigger)
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 45),
    played_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, played_date)
);

-- TRIGGER TO ENFORCE MAX 5 SCORES
CREATE OR REPLACE FUNCTION check_max_scores()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM scores WHERE user_id = NEW.user_id) >= 5 THEN
        -- Delete the oldest score
        DELETE FROM scores 
        WHERE id = (
            SELECT id FROM scores 
            WHERE user_id = NEW.user_id 
            ORDER BY played_date ASC 
            LIMIT 1
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_scores
BEFORE INSERT ON scores
FOR EACH ROW EXECUTE FUNCTION check_max_scores();

-- DRAWS TABLE
CREATE TABLE draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_month DATE NOT NULL, -- Stored as 1st of the month
    status draw_status DEFAULT 'pending',
    winning_numbers INT[], -- Array of 5 numbers
    total_pool DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENTRIES TABLE
CREATE TABLE entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    user_numbers INT[], -- The 5 latest scores at the time of draw
    matched_count INT DEFAULT 0,
    prize_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WINNER VERIFICATIONS
CREATE TABLE winner_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    proof_image_url TEXT,
    status verification_status DEFAULT 'pending',
    payment_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOCK CHARITIES INSERTION
INSERT INTO charities (name, description, image_url) VALUES 
('Green Earth Alliance', 'Dedicated to restoring forests and protecting endangered habitats worldwide.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80'),
('Ocean Clean Initiative', 'Removing plastic waste from the oceans and advocating for sustainable marine practices.', 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80'),
('Future Minds Foundation', 'Providing STEM education and resources to underprivileged children.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'),
('Global Health Relief', 'Delivering critical medical supplies and research funding to fight global diseases.', 'https://images.unsplash.com/photo-1532938911079-1b06ac7ce122?w=800&q=80'),
('Paws & Hearts Rescue', 'Rescuing and rehabilitating abandoned animals and finding them forever homes.', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80');

-- ROW LEVEL SECURITY (RLS) setup (Basic Example)
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Charities are viewable by everyone" ON charities FOR SELECT USING (true);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON scores FOR UPDATE USING (auth.uid() = user_id);

-- TRIGGER TO CREATE PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
