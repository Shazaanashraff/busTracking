# Mock Test Users

Create these accounts in your **Supabase Dashboard** (Authentication > Users > Add User):

## Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Passenger** | passenger@test.com | Test@123 | User app login |
| **Crew/Driver** | crew@test.com | Test@123 | Driver app (crew mode) |
| **Owner** | owner@test.com | Test@123 | Driver app (owner mode) |
| **Admin** | admin@test.com | Test@123 | Full access |

## Setup Steps

1. **Create users in Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Authentication > Users > Add User
   - Create each user above with email/password

2. **Run the seed script:**
   ```sql
   -- In Supabase SQL Editor, run:
   -- driver-app/scripts/seed_mock_users.sql
   ```

3. **Login to apps:**
   - **User App**: Use `passenger@test.com`
   - **Driver App**: Use `crew@test.com` or `owner@test.com`

## Phone Numbers (for OTP testing)
- Passenger: +94771234567
- Crew: +94772345678  
- Owner: +94773456789
- Admin: +94774567890
