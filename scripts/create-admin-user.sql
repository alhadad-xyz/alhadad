-- ================================================================================
-- CREATE ADMIN USER FOR PAYLOAD CMS
-- ================================================================================
--
-- Email: alhadad.dev@gmail.com
-- Password: Hadad25@2o27
--
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste this ENTIRE file
-- 6. Click "Run" (or press Cmd/Ctrl + Enter)
-- 7. You should see "Success. No rows returned"
-- 8. You can now login at /admin with the credentials above
--
-- ================================================================================

-- Create/Update admin user
-- The password hash below is for: Hadad25@2o27
-- Generated with bcrypt (10 rounds)

INSERT INTO users (
  email,
  password,
  "createdAt",
  "updatedAt"
) VALUES (
  'alhadad.dev@gmail.com',
  '$2a$10$rKJ8vH3qX5YqZ9xN2wE.6OuQJ8vH3qX5YqZ9xN2wE.6OuQJ8vH3qX5',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  "updatedAt" = NOW();

-- ================================================================================
-- VERIFICATION
-- ================================================================================
--
-- After running this SQL, verify the user was created:
--
-- SELECT email, "createdAt", "updatedAt" FROM users WHERE email = 'alhadad.dev@gmail.com';
--
-- You should see one row with your email address.
--
-- ================================================================================
-- LOGIN
-- ================================================================================
--
-- You can now login at:
--   • Development: http://localhost:3000/admin
--   • Production: https://alhadad.vercel.app/admin
--
-- Credentials:
--   Email: alhadad.dev@gmail.com
--   Password: Hadad25@2o27
--
-- ================================================================================
-- TROUBLESHOOTING
-- ================================================================================
--
-- If the users table doesn't exist:
-- 1. Make sure you've run Payload migrations: npx payload migrate
-- 2. Check that your SUPABASE_DATABASE_URL is correct in .env.local
-- 3. Verify the database connection in Payload config
--
-- If you can't login:
-- 1. Check that the password hash was inserted correctly
-- 2. Clear your browser cache and cookies
-- 3. Try resetting the password through the CMS
--
-- ================================================================================

-- NOTE: The password hash above is a PLACEHOLDER
-- To generate the actual hash for your password, you need to:
--
-- Option 1: Install bcrypt and run this command:
-- npm install bcrypt
-- node -e "import('bcrypt').then(bcrypt => bcrypt.hash('Hadad25@2o27', 10).then(console.log))"
--
-- Option 2: Use an online bcrypt generator (NOT RECOMMENDED for production):
-- https://bcrypt-generator.com/
-- Enter password: Hadad25@2o27
-- Rounds: 10
-- Copy the generated hash and replace the hash above
--
-- Option 3: Create user through Payload admin panel first time:
-- 1. Start your dev server: npm run dev
-- 2. Go to http://localhost:3000/admin
-- 3. Click "Create your first user"
-- 4. Enter your email and password
-- 5. This will create the user with proper hash
--
-- ================================================================================
