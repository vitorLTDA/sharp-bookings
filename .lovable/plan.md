# Barber Shop App Extension Plan

## ✅ IMPLEMENTATION COMPLETE

All features from this plan have been implemented.

## Overview

This plan extends the existing Elite Cuts barber shop booking app with authentication, a comprehensive barber dashboard, and subscription plans - all while maintaining the current professional design aesthetic and architecture.

---

## Summary of Changes

| Area | New Features |
|------|--------------|
| Authentication | Login page with email/password + Google OAuth, session management |
| Dashboard | Appointments table with filters, availability calendar, revenue metrics |
| Subscriptions | Public pricing page with 3 tiered plans |
| Infrastructure | Auth context, mock API layer expansion, loading/error states |

---

## 1. Authentication System

### 1.1 New Files

**`src/pages/AuthPage.tsx`**
- Login form with email + password fields
- "Sign in with Google" button (triggers redirect to `/auth/google`)
- Toggle between login and signup modes
- Loading spinner during auth
- Error message display (invalid credentials, network error)
- Redirect to home on successful login

**`src/contexts/AuthContext.tsx`**
- `AuthProvider` wrapping the app
- State: `user`, `isLoading`, `isAuthenticated`
- Methods: `login()`, `loginWithGoogle()`, `logout()`, `signup()`
- Session restore on app load (check stored token)

**`src/lib/mockAuth.ts`**
- Simulated auth functions for frontend-only mode
- Mock user data and session management
- `mockLogin()`, `mockSignup()`, `mockGoogleAuth()`

### 1.2 Component Updates

**`src/components/Header.tsx`**
- Add conditional "Login" / "Logout" button based on auth state
- Show user avatar when logged in
- Add "Dashboard" link for barber/admin users

### 1.3 UX States
- **Loading**: Spinner during auth requests
- **Error**: Red alert box with error message
- **Success**: Redirect to intended destination

---

## 2. Barber Dashboard

### 2.1 New Page Structure

```text
src/pages/dashboard/
  DashboardLayout.tsx    - Sidebar + header wrapper
  DashboardPage.tsx      - Overview/home
  AppointmentsPage.tsx   - Appointments management
  AvailabilityPage.tsx   - Weekly availability editor
  RevenuePage.tsx        - Subscriptions & revenue metrics
```

### 2.2 Dashboard Layout

**`src/pages/dashboard/DashboardLayout.tsx`**
- Responsive sidebar with navigation links
- Header with user info and logout
- Mobile hamburger menu
- Protected route (redirects if not logged in as barber)

### 2.3 Appointments Management

**`src/pages/dashboard/AppointmentsPage.tsx`**

Features:
- **Filters bar**: Status (paid, unpaid, canceled), date range picker
- **Table view** with columns: Customer, Date, Time, Status, Actions
- **Appointment detail modal**: Full info on click
- **Action buttons**: 
  - "Send WhatsApp" per appointment
  - "Notify All" for time slot
  - "Notify Day" for all appointments on date
- **Loading skeleton** while fetching
- **Empty state** when no appointments match filters

**`src/components/dashboard/AppointmentsTable.tsx`**
- Reusable table component using existing Table UI components
- Pagination controls

**`src/components/dashboard/AppointmentDetailModal.tsx`**
- Dialog showing full appointment details
- Status badge, customer info, action buttons

### 2.4 Availability Management

**`src/pages/dashboard/AvailabilityPage.tsx`**

Features:
- **Weekly calendar grid** (Mon-Sun, 9AM-6PM)
- Each cell represents a 1-hour slot
- Click to toggle available/blocked
- **Drag to select** multiple slots
- **Working hours editor**: Set default open/close times
- **Save button** persists to backend (mock API)

**`src/components/dashboard/WeeklyCalendar.tsx`**
- 7-column grid with time rows
- Color coding: green (available), gray (blocked)
- Interactive cells

### 2.5 Subscriptions & Revenue

**`src/pages/dashboard/RevenuePage.tsx`**

Features:
- **Metrics cards**: Active subscriptions, monthly revenue, total bookings
- **Charts section** using existing recharts:
  - Bar chart: Bookings last 7/30 days
  - Line chart: Revenue trend
- **Toggle between 7-day and 30-day views**
- **Subscriptions list**: Current active subscribers

**`src/lib/mockDashboardData.ts`**
- Mock data generators for appointments, revenue, subscriptions
- Sample chart data

---

## 3. Subscription Plans Page

### 3.1 New Page

**`src/pages/PricingPage.tsx`**

Three plan cards side by side:

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $9.99/mo | Basic bookings, WhatsApp confirmations, 1 barber |
| **Pro** | $24.99/mo | + Payment processing, Analytics dashboard, Broadcast messaging |
| **Business** | $49.99/mo | + Multi-barber support, Subscriptions, Priority support |

Each card includes:
- Plan name and price
- Feature list with checkmarks
- "Get Started" or "Contact Us" CTA button
- Popular badge on Pro plan

### 3.2 Design
- Matches existing neutral + gold accent theme
- Responsive: stacked on mobile, 3-column on desktop
- Cards use existing Card components

---

## 4. Routing Updates

**`src/App.tsx`** additions:

```text
/auth              - AuthPage (login/signup)
/pricing           - PricingPage (subscription plans)
/dashboard         - DashboardPage (overview)
/dashboard/appointments  - AppointmentsPage
/dashboard/availability  - AvailabilityPage
/dashboard/revenue       - RevenuePage
```

---

## 5. Mock Data Layer Expansion

**`src/lib/mockData.ts`** additions:
- `mockAppointments`: Sample appointment data with various statuses
- `mockSubscriptions`: Sample subscriber data
- `mockRevenueData`: Chart data for 7/30 day views

**`src/lib/mockApi.ts`** (new):
- Simulated API calls with delays
- `fetchAppointments(filters)`, `updateAvailability()`, `sendWhatsAppNotification()`
- Returns promises that resolve after timeout

---

## 6. Reusable Components

### New UI Components

**`src/components/dashboard/StatsCard.tsx`**
- Metric card with icon, label, and value
- Used in revenue dashboard

**`src/components/dashboard/StatusBadge.tsx`**
- Color-coded badge for paid/unpaid/canceled

**`src/components/dashboard/DateRangeFilter.tsx`**
- Date picker for filtering appointments

**`src/components/EmptyState.tsx`**
- Generic empty state with icon and message

**`src/components/LoadingSpinner.tsx`**
- Consistent loading indicator

---

## 7. State Management

### Loading States Pattern
```typescript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<T | null>(null);

// Skeleton during loading
// Error alert on failure
// Content when loaded
```

### Error Handling Pattern
- Try/catch around all API calls
- Toast notifications for actions
- Inline error messages for forms

---

## Technical Details

### File Structure After Changes

```text
src/
  contexts/
    AuthContext.tsx (new)
    BookingContext.tsx (existing)
  
  pages/
    AuthPage.tsx (new)
    PricingPage.tsx (new)
    dashboard/
      DashboardLayout.tsx (new)
      DashboardPage.tsx (new)
      AppointmentsPage.tsx (new)
      AvailabilityPage.tsx (new)
      RevenuePage.tsx (new)
    Index.tsx (existing)
    BookPage.tsx (existing)
    ...
  
  components/
    dashboard/
      AppointmentsTable.tsx (new)
      AppointmentDetailModal.tsx (new)
      WeeklyCalendar.tsx (new)
      StatsCard.tsx (new)
      StatusBadge.tsx (new)
      DateRangeFilter.tsx (new)
    EmptyState.tsx (new)
    LoadingSpinner.tsx (new)
    Header.tsx (updated)
    ...
  
  lib/
    mockData.ts (updated)
    mockApi.ts (new)
    mockAuth.ts (new)
    mockDashboardData.ts (new)
```

### Design Consistency

All new components will use:
- Existing color tokens: `accent` (gold), `success`, `warning`, `muted`
- Existing UI components: Card, Button, Input, Table, Dialog
- Same spacing and typography patterns
- Mobile-first responsive breakpoints

### Backend Assumptions

The implementation assumes these endpoints exist (mocked for now):

```text
POST /auth/login
POST /auth/signup
GET  /auth/google (redirect flow)
GET  /appointments?status=&dateFrom=&dateTo=
POST /appointments/:id/notify
POST /availability
GET  /subscriptions
GET  /revenue?period=7|30
```

---

## Implementation Order

1. **Authentication** - Foundation for protected routes
2. **Dashboard Layout** - Shell for all dashboard pages
3. **Appointments Page** - Core dashboard functionality
4. **Availability Page** - Barber schedule management
5. **Revenue Page** - Metrics and charts
6. **Pricing Page** - Public subscription plans
7. **Header Updates** - Auth state integration

