# Cloudinary Integration Plan - Worker Signup

## Problem Statement

The current worker signup flow has image upload issues:

1. **Base64 bloat**: Images converted to Base64 DataURLs increase payload size by ~33%
2. **Missing images**: Work photos (6 max) and selfie are NOT being sent to backend at all
3. **Timeout risk**: Large JSON payloads with embedded Base64 can timeout on slow connections
4. **Backend complexity**: Server must handle file storage, folder management, and URL generation

---

## Recommended Solution: Direct-to-Cloudinary Upload

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ CURRENT (Broken)                                                │
│                                                                 │
│ User selects image → Store as File → Submit form → Convert to  │
│ Base64 → Send in JSON → Backend saves to folder → Returns URL  │
│                                                                 │
│ Issues: Work photos/selfie not sent, Base64 bloat, timeouts    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ RECOMMENDED (Cloudinary)                                        │
│                                                                 │
│ User selects image → Upload to Cloudinary immediately → Store  │
│ URL in form state → Submit form with URLs only → Backend saves │
│ URLs to database                                               │
│                                                                 │
│ Benefits: No Base64, progressive upload, CDN delivery, no file │
│ handling on backend                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Why Cloudinary Over Backend Storage

| Factor | Backend Storage | Cloudinary |
|--------|-----------------|------------|
| Setup complexity | High (folders, permissions, CDN config) | Low (SDK + API key) |
| Image optimization | Manual implementation required | Automatic (WebP, compression, quality) |
| CDN delivery | Separate setup needed | Built-in global CDN |
| Bandwidth | Your server bandwidth | Free tier: 25GB/month |
| Transformations | Custom code (resize, crop) | URL-based (`/w_300/h_200/c_fill/`) |
| Storage scaling | Manual disk/DB management | Unlimited, automatic |
| Pakistan loading speed | Depends on server location | Global CDN with edge locations |
| Security | Implement your own auth | Signed uploads, moderation options |

---

## Implementation Steps

### Step 1: Cloudinary Setup

1. Create account at https://cloudinary.com (free tier)
2. Get credentials from Dashboard:
   - `Cloud Name`
   - `Upload Preset` (create unsigned preset for frontend uploads)
3. Add to `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

4. Update `.env.example`:

```env
# Cloudinary Image Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

### Step 2: Create Upload Utility

**New file:** `src/lib/cloudinary.ts`

```typescript
/**
 * Upload image to Cloudinary
 * @param file - The File to upload
 * @param folder - Folder path (e.g., 'worker-cnic', 'worker-selfie', 'worker-portfolio')
 * @returns Cloudinary secure URL
 */
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', `mehnati/${folder}`);
  formData.append('unique_filename', 'true');
  formData.append('overwrite', 'false');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of Files to upload
 * @param folder - Folder path
 * @returns Array of Cloudinary URLs
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  folder: string
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
  return Promise.all(uploadPromises);
}
```

### Step 3: Update Worker Signup Wizard

**Modify:** `src/components/auth/worker-signup/WorkerSignupWizard.tsx`

**Key changes:**

1. Add upload state:
```typescript
const [isUploading, setIsUploading] = useState(false);
const [uploadedWorkPhotoUrls, setUploadedWorkPhotoUrls] = useState<string[]>([]);
const [uploadedSelfieUrl, setUploadedSelfieUrl] = useState<string | null>(null);
const [uploadedCnicFrontUrl, setUploadedCnicFrontUrl] = useState<string | null>(null);
const [uploadedCnicBackUrl, setUploadedCnicBackUrl] = useState<string | null>(null);
```

2. Upload images when user completes each step (not on final submit):

```typescript
// After user selects work photos (Step 6)
const handleWorkPhotosChange = async (photos: File[]) => {
  setFormData((prev) => ({ ...prev, workPhotos: photos }));

  // Upload immediately
  if (photos.length >= 2) {
    setIsUploading(true);
    try {
      const urls = await uploadMultipleToCloudinary(photos, 'worker-portfolio');
      setUploadedWorkPhotoUrls(urls);
    } catch (error) {
      console.error('Work photo upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }
};

// After selfie capture (Step 7)
const handleSelfieChange = async (file: File | null) => {
  setFormData((prev) => ({ ...prev, selfieImage: file }));

  if (file) {
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'worker-selfie');
      setUploadedSelfieUrl(url);
    } catch (error) {
      console.error('Selfie upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }
};

// After CNIC upload (Step 8)
const handleCnicFrontChange = async (file: File | null) => {
  setFormData((prev) => ({ ...prev, cnicFrontImage: file }));

  if (file) {
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'worker-cnic');
      setUploadedCnicFrontUrl(url);
    } catch (error) {
      console.error('CNIC front upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }
};
```

3. Update final submission to send URLs only:

```typescript
const handleSubmit = async () => {
  if (!validateCurrentStep()) return;

  setIsLoading(true);
  try {
    // Ensure all images are uploaded before submitting
    let workPhotoUrls = uploadedWorkPhotoUrls;
    let selfieUrl = uploadedSelfieUrl;
    let cnicFrontUrl = uploadedCnicFrontUrl;
    let cnicBackUrl = uploadedCnicBackUrl;

    // Upload any remaining images that haven't been uploaded yet
    if (formData.workPhotos.length > 0 && workPhotoUrls.length === 0) {
      workPhotoUrls = await uploadMultipleToCloudinary(formData.workPhotos, 'worker-portfolio');
    }
    if (formData.selfieImage && !selfieUrl) {
      selfieUrl = await uploadToCloudinary(formData.selfieImage, 'worker-selfie');
    }
    if (formData.cnicFrontImage && !cnicFrontUrl) {
      cnicFrontUrl = await uploadToCloudinary(formData.cnicFrontImage, 'worker-cnic');
    }
    if (formData.cnicBackImage && !cnicBackUrl) {
      cnicBackUrl = await uploadToCloudinary(formData.cnicBackImage, 'worker-cnic');
    }

    const registrationData = {
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      cnicNumber: formData.cnicNumber.replace(/\D/g, ""),
      cnicFrontUrl,      // Cloudinary URL
      cnicBackUrl,       // Cloudinary URL
      selfieUrl,         // Cloudinary URL
      workPhotosUrls: workPhotoUrls,  // Array of Cloudinary URLs
      homeAddress: formData.homeAddress,
      homeLat: formData.homeLat,
      homeLng: formData.homeLng,
      experienceYears: formData.experienceYears,
      visitingCharges: formData.visitingCharges,
      serviceIds: formData.selectedServiceIds,
    };

    const result = await registerWorker(registrationData);
    router.push("/worker/dashboard");
  } catch (error) {
    // Handle error...
  } finally {
    setIsLoading(false);
  }
};
```

### Step 4: Update Backend API

**Backend changes required** (in your backend repository):

Update `/workers/register` endpoint to accept URLs instead of files:

```typescript
// Expected request body
{
  fullName: string;
  phoneNumber: string;
  password: string;
  cnicNumber: string;
  cnicFrontUrl: string;      // Cloudinary URL
  cnicBackUrl: string;       // Cloudinary URL
  selfieUrl: string;         // Cloudinary URL
  workPhotosUrls: string[];  // Array of Cloudinary URLs
  homeAddress: string;
  homeLat: number;
  homeLng: number;
  experienceYears: number;
  visitingCharges: number;
  serviceIds: number[];
}
```

Backend stores URLs directly in database - no file handling needed.

---

## Migration Path (Optional)

If you have existing worker data with local file paths:

1. Create a script to upload existing images to Cloudinary
2. Update database records with new Cloudinary URLs
3. Keep old files temporarily as backup
4. Update image serving logic to use URLs

---

## Testing Checklist

- [ ] CNIC front image uploads successfully
- [ ] CNIC back image uploads successfully
- [ ] Selfie image uploads successfully (both camera capture and file upload)
- [ ] Work photos (2-6 images) upload successfully
- [ ] Upload progress indicator shows during upload
- [ ] Error handling works (network failure, invalid file)
- [ ] Final form submission sends all URLs correctly
- [ ] Backend receives and stores URLs
- [ ] Worker profile displays all images correctly
- [ ] Images load quickly (CDN delivery)
- [ ] Test on slow 3G connection (progressive upload should handle gracefully)

---

## Cost Estimate (Free Tier)

Cloudinary Free Tier (as of 2024):
- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month
- **Uploads:** Unlimited

**Estimated usage for worker signup:**
- Average image size: 500KB (after optimization)
- Per worker: 8 images × 500KB = 4MB
- Storage capacity: ~6,250 workers before hitting free tier limit

---

## Alternative: Backend FormData Upload

If Cloudinary is not an option, fix the current backend approach:

1. Use existing `apiClient.upload()` method (already in codebase)
2. Send all images via FormData multipart request
3. Backend saves to folder, returns URLs
4. More complex: requires backend file handling, storage management, CDN setup

**Why Cloudinary is preferred:**
- Faster implementation (hours vs days)
- No backend changes for file handling
- Built-in optimization and CDN
- Scales automatically
- Lower server bandwidth costs

---

## Files Summary

| Action | File Path |
|--------|-----------|
| Create | `src/lib/cloudinary.ts` |
| Modify | `src/components/auth/worker-signup/WorkerSignupWizard.tsx` |
| Modify | `.env.local` (add Cloudinary credentials) |
| Modify | `.env.example` (document env vars) |
| Backend | Update `/workers/register` endpoint |

---

## Next Steps

1. Create Cloudinary account and get credentials
2. Add environment variables to `.env.local`
3. Create `src/lib/cloudinary.ts` utility
4. Update `WorkerSignupWizard.tsx` with progressive upload logic
5. Update backend endpoint to accept URLs
6. Test complete flow end-to-end
