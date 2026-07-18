'use client';

import { useRef, useState } from 'react';
import { MapPin, Camera, Loader2, Check, Images } from 'lucide-react';
import { validateCNIC } from '@/lib/auth';
import type { OnboardingAwaiting, OnboardingProfile } from '@/types/ai';

/**
 * Inline capture widgets rendered inside the Nova onboarding chat. Which one
 * shows is driven by the backend's `awaiting` hint (deterministic, so the model
 * can't skip a required capture). Each widget writes into the profile and nudges
 * Nova to move on via `onCapture`.
 */
export function OnboardingCaptureWidget({
  awaiting,
  uploadImage,
  onCapture,
  disabled,
}: {
  awaiting: OnboardingAwaiting;
  uploadImage: (file: Blob) => Promise<string>;
  onCapture: (
    partial: Partial<OnboardingProfile>,
    note: string,
  ) => Promise<void>;
  disabled?: boolean;
}) {
  if (awaiting === 'location')
    return <LocationWidget onCapture={onCapture} disabled={disabled} />;
  if (awaiting === 'cnic')
    return (
      <CnicWidget
        uploadImage={uploadImage}
        onCapture={onCapture}
        disabled={disabled}
      />
    );
  if (awaiting === 'selfie')
    return (
      <SelfieWidget
        uploadImage={uploadImage}
        onCapture={onCapture}
        disabled={disabled}
      />
    );
  if (awaiting === 'workPhotos')
    return (
      <WorkPhotosWidget
        uploadImage={uploadImage}
        onCapture={onCapture}
        disabled={disabled}
      />
    );
  return null;
}

// ─── Shared bits ──────────────────────────────────────────────────────────────

function WidgetShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
      {children}
    </div>
  );
}

const btn =
  'flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50';

// ─── Location ─────────────────────────────────────────────────────────────────

function LocationWidget({
  onCapture,
  disabled,
}: {
  onCapture: (p: Partial<OnboardingProfile>, note: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const share = () => {
    if (!navigator.geolocation) {
      setError('Location support nahi hai. Aap likh kar bhi bata sakte hain.');
      return;
    }
    setBusy(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let homeAddress = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        let city = '';
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          homeAddress = data.display_name || homeAddress;
          const a = data.address ?? {};
          city = a.city || a.town || a.village || a.state || '';
        } catch {
          // keep the coordinate fallback
        }
        await onCapture(
          { homeLat: latitude, homeLng: longitude, homeAddress, city },
          '📍 Location share kar di',
        );
        setBusy(false);
      },
      () => {
        setBusy(false);
        setError('Location nahi mil saki. Ijazat dein ya dobara koshish karein.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <WidgetShell>
      <button className={btn} onClick={share} disabled={busy || disabled}>
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        {busy ? 'Location le rahe hain…' : 'Apni location share karein'}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </WidgetShell>
  );
}

// ─── One camera/file photo button ─────────────────────────────────────────────

function PhotoButton({
  label,
  done,
  disabled,
  onFile,
}: {
  label: string;
  done: boolean;
  disabled?: boolean;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        className={`${btn} ${done ? '!bg-emerald-700' : ''}`}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        {done ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
    </>
  );
}

// ─── CNIC (number + front + back) ─────────────────────────────────────────────

function CnicWidget({
  uploadImage,
  onCapture,
  disabled,
}: {
  uploadImage: (f: Blob) => Promise<string>;
  onCapture: (p: Partial<OnboardingProfile>, note: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [cnic, setCnic] = useState('');
  const [frontUrl, setFrontUrl] = useState<string>('');
  const [backUrl, setBackUrl] = useState<string>('');
  const [uploading, setUploading] = useState<'front' | 'back' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cnicValid = validateCNIC(cnic);
  const ready = cnicValid && !!frontUrl && !!backUrl;

  const handle = async (side: 'front' | 'back', file: File) => {
    setUploading(side);
    setError(null);
    try {
      const url = await uploadImage(file);
      if (side === 'front') setFrontUrl(url);
      else setBackUrl(url);
    } catch {
      setError('Tasveer upload nahi hui. Dobara koshish karein.');
    } finally {
      setUploading(null);
    }
  };

  return (
    <WidgetShell>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        CNIC number (XXXXX-XXXXXXX-X)
      </label>
      <input
        value={cnic}
        onChange={(e) => setCnic(e.target.value)}
        placeholder="42101-1234567-1"
        inputMode="numeric"
        className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
      />
      {cnic && !cnicValid && (
        <p className="mb-2 text-xs text-red-600">CNIC format sahi nahi hai.</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        <PhotoButton
          label={uploading === 'front' ? '…' : frontUrl ? 'Front ✓' : 'CNIC Front'}
          done={!!frontUrl}
          disabled={disabled || uploading !== null}
          onFile={(f) => handle('front', f)}
        />
        <PhotoButton
          label={uploading === 'back' ? '…' : backUrl ? 'Back ✓' : 'CNIC Back'}
          done={!!backUrl}
          disabled={disabled || uploading !== null}
          onFile={(f) => handle('back', f)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <button
        className={`${btn} mt-2`}
        disabled={!ready || disabled}
        onClick={() =>
          onCapture(
            { cnicNumber: cnic, cnicFrontUrl: frontUrl, cnicBackUrl: backUrl },
            'CNIC ki maloomat de di',
          )
        }
      >
        <Check className="h-4 w-4" />
        CNIC confirm karein
      </button>
    </WidgetShell>
  );
}

// ─── Selfie ───────────────────────────────────────────────────────────────────

function SelfieWidget({
  uploadImage,
  onCapture,
  disabled,
}: {
  uploadImage: (f: Blob) => Promise<string>;
  onCapture: (p: Partial<OnboardingProfile>, note: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      await onCapture({ selfieUrl: url }, 'Selfie le li 📸');
    } catch {
      setError('Selfie upload nahi hui. Dobara koshish karein.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <WidgetShell>
      <button
        className={btn}
        onClick={() => inputRef.current?.click()}
        disabled={busy || disabled}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        {busy ? 'Upload ho rahi hai…' : 'Selfie lein'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handle(file);
          e.target.value = '';
        }}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </WidgetShell>
  );
}

// ─── Work photos (1+) ─────────────────────────────────────────────────────────

function WorkPhotosWidget({
  uploadImage,
  onCapture,
  disabled,
}: {
  uploadImage: (f: Blob) => Promise<string>;
  onCapture: (p: Partial<OnboardingProfile>, note: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [urls, setUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList) => {
    setBusy(true);
    setError(null);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((f) => uploadImage(f)),
      );
      setUrls((prev) => [...prev, ...uploaded.filter(Boolean)]);
    } catch {
      setError('Kuch tasveerein upload nahi huin. Dobara koshish karein.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <WidgetShell>
      <button
        className={btn}
        onClick={() => inputRef.current?.click()}
        disabled={busy || disabled}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Images className="h-4 w-4" />
        )}
        {busy
          ? 'Upload ho rahi hain…'
          : urls.length
            ? `Aur tasveer lagayein (${urls.length})`
            : 'Kaam ki tasveerein lagayein'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {urls.length > 0 && (
        <button
          className={`${btn} mt-2`}
          disabled={disabled}
          onClick={() =>
            onCapture({ workPhotosUrls: urls }, 'Kaam ki tasveerein laga din')
          }
        >
          <Check className="h-4 w-4" />
          {`${urls.length} tasveer${urls.length > 1 ? 'ein' : ''} confirm karein`}
        </button>
      )}
    </WidgetShell>
  );
}
