

# Barber Shop Booking App - MVP Plan

## Overview
A professional, mobile-first barber shop web app for a multi-barber shop. Starting with the core booking system, we'll build a solid foundation that can later expand to include payments, subscriptions, and WhatsApp automation.

---

## Phase 1: MVP - Core Booking System

### 1. Landing Page
- Clean, professional design with neutral tones and trustworthy appearance
- Hero section with shop name, tagline, and prominent **"Book Appointment"** CTA
- Brief section showcasing the team of barbers
- Contact information and location
- Mobile-responsive navigation

### 2. Barber Selection Page
- Grid or list of available barbers with:
  - Photo/avatar
  - Name
  - Brief description or specialty
- Click to select a barber and proceed to date/time selection

### 3. Appointment Booking Flow
**Step 1: Select Date**
- Calendar view showing the current month
- Navigate between months
- Dates with availability highlighted
- Disabled dates in the past

**Step 2: Select Time Slot**
- Display 1-hour time slots for the selected date
- Visual indicators for slot status:
  - ✅ Available (green)
  - ⏳ Reserved/Pending (yellow) - unpaid hold
  - ❌ Booked (gray) - confirmed
- Click to select an available slot

**Step 3: Confirm Booking**
- Summary showing: Barber, Date, Time
- Customer information form (name, phone, email)
- "Confirm Booking" button

### 4. Backend (Lovable Cloud)
- **Database tables:**
  - `barbers` - barber profiles (name, photo, bio)
  - `appointments` - bookings with status (available, reserved, booked)
  - `availability` - barber weekly schedules and blocked times
- **Authentication:** Email + OTP via Supabase Auth
- **Real-time updates:** Slot availability syncs across users

### 5. Basic Barber Dashboard (Admin)
- View all appointments by date
- See booking details (customer name, time, status)
- Simple availability management (block/unblock time slots)
- Protected admin route (barbers only)

---

## Design Approach
- **Style:** Professional & clean with neutral colors (whites, grays, subtle accents)
- **Mobile-first:** Optimized for phone bookings
- **Typography:** Clean, readable fonts
- **Components:** Cards, calendars, and clear CTAs

---

## Future Phases (Not in MVP)
These can be added after the core system is working:
- Stripe payments and pay-per-appointment
- Subscription plans (monthly, 3-month, annual)
- WhatsApp notifications via Twilio
- Bulk messaging and reminders
- Revenue analytics
- Automatic release of unpaid reservations

---

## Tech Stack Summary
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Lovable Cloud (Supabase-powered)
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Email/Password + OTP (Supabase Auth)

