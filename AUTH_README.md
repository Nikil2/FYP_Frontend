# Authentication System

Complete authentication system for Mehnati platform with separate signup flows for customers and workers.

## 📁 Folder Structure

```
src/
├── app/
│   └── auth/
│       ├── login/
│       │   └── page.tsx          # Login page
│       └── signup/
│           ├── customer/
│           │   └── page.tsx      # Customer signup page
│           └── worker/
│               └── page.tsx      # Worker signup page
├── components/
│   └── auth/
│       ├── LoginForm.tsx         # Login form component
│       ├── CustomerSignupForm.tsx # Customer signup form
│       ├── WorkerSignupForm.tsx  # Worker signup form (multi-step)
│       └── index.ts              # Exports
├── interfaces/
│   └── auth-interfaces.ts        # Auth types & interfaces
└── lib/
    └── auth.ts                   # Auth utilities & API calls
```

## 🚀 Features

### Login
- Phone number & password authentication
- Role-based redirection (Customer/Worker/Admin)
- Token management (localStorage)
- Password visibility toggle

### Customer Signup
- Basic information (name, phone, password)
- Optional profile picture upload
- Phone number validation
- Password strength validation

### Worker Signup (Multi-Step)
**Step 1: Basic Information**
- Full name, phone number, password
- Profile picture upload

**Step 2: Professional Details**
- CNIC number & images (front/back)
- Bio/description
- Years of experience
- Visiting charges

**Step 3: Location & Services**
- Home address
- Service selection (multi-select)
- Location coordinates (placeholder for map integration)

## 🔑 API Endpoints

The system expects these backend endpoints:

```
POST /api/auth/login
POST /api/auth/signup/customer
POST /api/auth/signup/worker
```

## 📝 Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎨 Routes

- `/auth/login` - Login page
- `/auth/signup/customer` - Customer signup
- `/auth/signup/worker` - Worker signup (3-step form)

## 🔒 Validation

### Phone Number
- Pakistani format: `03XX-XXXXXXX`
- Regex: `/^(\+92|0)?3[0-9]{9}$/`

### CNIC
- Format: `XXXXX-XXXXXXX-X`
- Regex: `/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/`

### Password
- Minimum 6 characters
- Simple validation for easy testing

## 💾 Token Management

Tokens are stored in localStorage:
- `setAuthToken(token)` - Save token
- `getAuthToken()` - Retrieve token
- `removeAuthToken()` - Clear token
- `isAuthenticated()` - Check auth status

## 🎯 Usage Example

```tsx
import { login, signupCustomer, signupWorker } from "@/lib/auth";

// Login
const response = await login({
  phoneNumber: "03001234567",
  password: "Password123"
});

// Customer Signup
const response = await signupCustomer({
  fullName: "John Doe",
  phoneNumber: "03001234567",
  password: "Password123",
  confirmPassword: "Password123",
  profilePicture: file // optional
});

// Worker Signup
const response = await signupWorker({
  fullName: "Ahmed Khan",
  phoneNumber: "03001234567",
  password: "Password123",
  confirmPassword: "Password123",
  cnicNumber: "12345-1234567-1",
  cnicFrontImage: file,
  cnicBackImage: file,
  bio: "Experienced electrician...",
  experienceYears: 5,
  visitingCharges: 500,
  homeAddress: "123 Street, Lahore",
  homeLat: 31.5204,
  homeLng: 74.3587,
  selectedServices: [1, 2, 3]
});
```

## 🎨 Styling

Uses Tailwind CSS with:
- Custom colors from `globals.css`
- Consistent spacing and typography
- Responsive design
- Smooth animations

## 📦 Dependencies

- `lucide-react` - Icons
- `next` - Framework
- Existing UI components: `Button`, `Card`

## 🔄 Next Steps

1. **Backend Integration**: Connect to actual API endpoints
2. **Map Integration**: Add location picker for worker signup
3. **OTP Verification**: Phone number verification
4. **Social Login**: Google/Facebook authentication
5. **Password Reset**: Forgot password flow
6. **Email Support**: Optional email field

## 🐛 Testing

To test the forms:
1. Visit `/auth/login`
2. Visit `/auth/signup/customer`
3. Visit `/auth/signup/worker`

Note: Forms will show validation errors without backend integration.
