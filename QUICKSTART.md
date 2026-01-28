# 🚀 Quick Start Guide - Authentication System

## ✅ Completed Authentication System

I've created a complete authentication system for your Mehnati platform with:
- ✅ Login page (shared for all users)
- ✅ Customer signup
- ✅ Worker signup (3-step form)
- ✅ All validations
- ✅ File uploads
- ✅ Token management

## 📂 What Was Created

### Pages (Routes)
1. **`/auth/login`** - Login page for all users
2. **`/auth/signup/customer`** - Customer registration
3. **`/auth/signup/worker`** - Worker registration (multi-step)

### Components
- `LoginForm` - Login form with phone & password
- `CustomerSignupForm` - Simple customer signup
- `WorkerSignupForm` - 3-step worker registration

### Utilities & Types
- `auth-interfaces.ts` - All TypeScript types
- `auth.ts` - API calls, validation, token management

## 🎯 How to Use Right Now

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test the Forms

**Login Page:**
```
http://localhost:3000/auth/login
```
- Enter phone number: 03001234567
- Enter password: (any password)
- Click "Sign up as Customer" or "Sign up as Worker"

**Customer Signup:**
```
http://localhost:3000/auth/signup/customer
```
- Fill in: Name, Phone, Password
- Optional: Upload profile picture
- Submit

**Worker Signup:**
```
http://localhost:3000/auth/signup/worker
```
- **Step 1:** Basic info (name, phone, password)
- **Step 2:** Professional details (CNIC, bio, experience, charges)
- **Step 3:** Location & services selection
- Submit

## 🔌 Backend Integration Required

The forms are ready but need these API endpoints:

```typescript
// Expected endpoints:
POST /api/auth/login
POST /api/auth/signup/customer
POST /api/auth/signup/worker

// Update this in .env.local:
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📋 Field Mapping to Your Schema

### User Model (Both Customer & Worker)
```typescript
{
  phoneNumber: string;    // ✅ From form
  fullName: string;       // ✅ From form
  password: string;       // ✅ From form (hash on backend!)
  profilePicUrl: string;  // ✅ From uploaded file
  role: "CUSTOMER" | "WORKER"; // ✅ Automatic
}
```

### WorkerProfile Model (Additional for Workers)
```typescript
{
  cnicNumber: string;        // ✅ From form step 2
  cnicFrontUrl: string;      // ✅ From uploaded file
  cnicBackUrl: string;       // ✅ From uploaded file
  bio: string;               // ✅ From form step 2
  experienceYears: number;   // ✅ From form step 2
  visitingCharges: number;   // ✅ From form step 2
  homeAddress: string;       // ✅ From form step 3
  homeLat: number;           // 🔶 Placeholder (0) - needs map
  homeLng: number;           // 🔶 Placeholder (0) - needs map
  services: number[];        // ✅ From form step 3
}
```

## 🎨 Validation Rules Implemented

### Phone Number
- Format: `03XX-XXXXXXX`
- Must be valid Pakistani number

### CNIC
- Format: `XXXXX-XXXXXXX-X`
- Exact 13 digits with dashes

### Password
- Minimum 6 characters
- Simple validation for easy testing

### Images
- Accepted formats: JPG, PNG, etc.
- Preview before upload
- Required: CNIC front & back (workers)

## 🔧 Environment Setup

Created `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Change this URL to match your backend!**

## 📝 Example Backend Response

Your API should return:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "03001234567",
      "fullName": "John Doe",
      "role": "CUSTOMER"
    },
    "token": "jwt_token_here"
  }
}
```

## 🎯 Current Status

✅ **FRONTEND: 100% COMPLETE**
- All forms designed & working
- Validation complete
- File uploads ready
- Token management ready
- Error handling ready

⏳ **BACKEND: NEEDS IMPLEMENTATION**
- Create API endpoints
- Handle file uploads
- Hash passwords
- Generate JWT tokens
- Save to database

## 🚀 Next Actions

### For You (Frontend)
- ✅ Test the forms
- ✅ Customize styling if needed
- ✅ Add/remove services in WorkerSignupForm
- ⏳ Add map picker for location (optional)

### For Backend Developer
1. Create the 3 API endpoints
2. Set up file upload (multer/cloudinary)
3. Hash passwords with bcrypt
4. Generate JWT tokens
5. Save user + worker profile to database
6. Handle the services array for workers

## 📞 Quick Test Guide

### Test Login Form
1. Go to `/auth/login`
2. See phone input, password input
3. Try toggling password visibility
4. Click signup links

### Test Customer Signup
1. Go to `/auth/signup/customer`
2. Fill all fields
3. Try invalid phone (see error)
4. Try weak password (see error)
5. Upload profile pic (see preview)

### Test Worker Signup
1. Go to `/auth/signup/worker`
2. **Step 1:** Fill basic info, go Next
3. **Step 2:** Upload CNIC images, fill details, go Next
4. **Step 3:** Select services, fill address, Submit
5. Try going Back to edit

## 💡 Pro Tips

1. **Forms work offline** - They validate locally
2. **Images preview instantly** - No upload until submit
3. **Multi-step saves state** - Can go back/forward
4. **Responsive design** - Works on mobile
5. **Type-safe** - All TypeScript types defined

## 📚 Documentation Files

- `AUTH_README.md` - Full technical documentation
- `AUTH_COMPLETE.md` - Complete feature list
- `QUICKSTART.md` - This file!

---

## 🎉 YOU'RE READY TO GO!

All authentication forms are complete and ready for backend integration. Just connect your API and you're live! 🚀
