import bcrypt from 'bcrypt';

const password = 'Hadad25@2o27';
const email = 'alhadad.dev@gmail.com';

console.log('Generating password hash for Payload CMS admin user...\n');

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }

    console.log('✅ Password hash generated successfully!\n');
    console.log('='.repeat(80));
    console.log('COPY THE SQL BELOW AND RUN IT IN SUPABASE SQL EDITOR');
    console.log('='.repeat(80));
    console.log(`
-- Create/Update Admin User for Payload CMS
-- Email: ${email}
-- Password: ${password}

INSERT INTO users (
  email,
  password,
  "createdAt",
  "updatedAt"
) VALUES (
  '${email}',
  '${hash}',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  "updatedAt" = NOW();

-- User created! You can now login at /admin
  `);
    console.log('='.repeat(80));
    console.log('\n✅ Done! Copy the SQL above and run it in Supabase SQL Editor\n');
    console.log('Then login at:');
    console.log('  • Development: http://localhost:3000/admin');
    console.log('  • Production: https://alhadad.vercel.app/admin\n');
});
