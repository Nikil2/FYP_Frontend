/**
 * Upload image to Cloudinary
 * @param file - The File to upload
 * @param folder - Folder path (e.g., 'worker-cnic', 'worker-selfie', 'worker-portfolio')
 * @returns Cloudinary secure URL
 *
 * IMPORTANT: You must create an unsigned upload preset in Cloudinary dashboard:
 * 1. Go to https://cloudinary.com/console
 * 2. Settings (gear icon) -> Upload
 * 3. Scroll to "Upload presets" and click "Add upload preset"
 * 4. Set:
 *    - Preset name: create your own preset (e.g., mehnati_unsigned_preset)
 *    - Signing mode: Unsigned
 *    - Folder: mehnati (optional, can also be set dynamically)
 * 5. Click Save
 */
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

function getCloudinaryUploadUrl(): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in frontend env');
  }

  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

function getCloudinaryUploadPreset(): string {
  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in frontend env');
  }

  return CLOUDINARY_UPLOAD_PRESET;
}

function parseCloudinaryErrorMessage(message?: string): string {
  if (!message) {
    return 'Upload failed';
  }

  if (message.includes('whitelisted for unsigned uploads')) {
    return 'Cloudinary preset is not enabled for unsigned uploads. Create a new Unsigned upload preset and set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to that preset name.';
  }

  if (message.includes('Upload preset not found')) {
    return 'Cloudinary upload preset not found. Check NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET and Cloudinary preset name.';
  }

  return message;
}

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const uploadPreset = getCloudinaryUploadPreset();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `mehnati/${folder}`);

  const response = await fetch(
    getCloudinaryUploadUrl(),
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(parseCloudinaryErrorMessage(error.error?.message));
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

/**
 * Upload with progress callback
 * @param file - The File to upload
 * @param folder - Folder path
 * @param onProgress - Progress callback (0-100)
 * @returns Cloudinary secure URL
 */
export async function uploadToCloudinaryWithProgress(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadPreset = getCloudinaryUploadPreset();

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `mehnati/${folder}`);

    // Track upload progress
    if (onProgress && xhr.upload) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(Math.round(percentComplete));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(parseCloudinaryErrorMessage(error.error?.message)));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', getCloudinaryUploadUrl());
    xhr.send(formData);
  });
}
