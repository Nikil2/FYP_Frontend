# Frontend API Layer Documentation

Complete API integration layer for FYP Service Marketplace frontend.

## 📁 Project Structure

```
src/api/
├── config.ts              # API configuration & endpoints
├── client.ts              # Base HTTP client
├── types.ts               # TypeScript interfaces
├── index.ts               # Main export point
├── examples.ts            # Usage examples
└── services/
    ├── index.ts           # Services export
    ├── services.ts        # Services API functions
    └── workers.ts         # Worker registration & portfolio
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# No external dependencies needed - uses native fetch API
```

### 2. Configure Environment

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_ENV=development
```

### 3. Use in Components

```typescript
import { getServices, registerWorker } from '@/api';

// Fetch services
const services = await getServices();

// Register worker
const worker = await registerWorker({
  firstName: 'Ahmed',
  lastName: 'Khan',
  email: 'ahmed@example.com',
  phoneNumber: '+923334445566',
  password: 'SecurePass123',
  cnicNumber: '3520123456789',
  address: '123 Street',
  serviceIds: [1, 2],
});
```

## 📚 API Reference

### Services API

```typescript
// Get all services
const services = await getServices();

// Get active services only
const activeServices = await getActiveServices();

// Get single service
const service = await getServiceById(1);

// Filter & group
const grouped = groupServicesByCategory(services);
const filtered = filterServicesByKeyword(services, 'electrician');
```

### Workers API

```typescript
// Register worker
const worker = await registerWorker({
  firstName: 'Ahmed',
  lastName: 'Khan',
  email: 'ahmed@example.com',
  phoneNumber: '+923334445566',
  password: 'SecurePass123',
  cnicNumber: '3520123456789',
  address: '123 Street',
  serviceIds: [1, 2],
  hourlyRate: 500,
  portfolioImages: [
    {
      imageUrl: 'https://example.com/image.jpg',
      description: 'Project description'
    }
  ]
});

// Get worker details
const worker = await getWorkerDetails('worker-id');

// Portfolio management
const image = await addPortfolioImage('worker-id', {
  imageUrl: 'https://example.com/image.jpg',
  description: 'New project'
});

const portfolio = await getPortfolioImages('worker-id');

await updatePortfolioImage('worker-id', 'image-id', {
  description: 'Updated description'
});

await deletePortfolioImage('worker-id', 'image-id');
```

## 🛠️ Configuration

### Base URL

Default: `http://localhost:4000`

Change via environment variable:
```env
REACT_APP_API_URL=https://api.example.com
```

Or programmatically:
```typescript
import { apiClient } from '@/api';
apiClient.setBaseURL('https://api.example.com');
```

### Timeout

Default: 30 seconds

Modify in `src/api/config.ts`:
```typescript
export const API_CONFIG = {
  TIMEOUT: 60000, // 60 seconds
};
```

## ⚠️ Error Handling

The API layer throws `ApiRequestError` exceptions:

```typescript
import { ApiRequestError } from '@/api';

try {
  const services = await getServices();
} catch (error) {
  if (error instanceof ApiRequestError) {
    console.error(`Error ${error.statusCode}: ${error.message}`);
    // Handle specific status codes
    if (error.statusCode === 401) {
      // Unauthorized - redirect to login
    }
  }
}
```

## 🔄 CORS & Credentials

The API client automatically includes:
- `credentials: 'include'` for cookie-based auth
- `Content-Type: application/json` header
- Bearer token in Authorization header (when available)

## 📝 Type Safety

All API functions are fully typed with TypeScript:

```typescript
import {
  Service,
  Worker,
  WorkerRegistrationData,
  PortfolioImage,
  ApiRequestError,
} from '@/api';

const services: Service[] = await getServices();
const worker: Worker = await registerWorker(data);
```

## 🧪 Testing

Run examples to test API connection:

```typescript
import { runAllExamples } from '@/api/examples';

// Run all examples
await runAllExamples();

// Or run individual examples
import { example1_GetAllServices } from '@/api/examples';
await example1_GetAllServices();
```

## 🔗 Integration Examples

### React Hook

```typescript
import { useEffect, useState } from 'react';
import { getServices, Service, ApiRequestError } from '@/api';

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => {
        if (err instanceof ApiRequestError) {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return { services, loading, error };
}
```

### Async Component

```typescript
import { getServices } from '@/api';

export default async function ServicesList() {
  const services = await getServices();

  return (
    <div>
      {services.map((service) => (
        <div key={service.id}>
          <h3>{service.icon} {service.name}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🚨 Troubleshooting

### CORS Errors

**Error:** `No 'Access-Control-Allow-Origin' header`

**Solution:**
- Ensure backend CORS is configured
- Check `REACT_APP_API_URL` in `.env`
- Verify backend is running on correct port

### 401 Unauthorized

**Error:** `Request failed with status 401`

**Solution:**
- User not authenticated
- Token expired
- Set authorization token if needed

### 408 Timeout

**Error:** `Request timeout after 30000ms`

**Solution:**
- Backend is slow - increase timeout in config
- Backend is down - check server status
- Network issue - check connection

## 📖 Usage Examples

See `src/api/examples.ts` for complete working examples:

1. Get all services
2. Get active services
3. Search services
4. Filter services
5. Get service detail
6. Worker registration
7. Registration with portfolio
8. Form validation
9. Add portfolio image
10. Get portfolio
11. Update portfolio
12. Delete portfolio
13. Error handling

## 🔐 Security Notes

- API client uses CORS with credentials
- No sensitive data stored in localStorage by default
- Implement token refresh if using JWT
- Always validate user input before sending to API

## 📞 Support

For API issues:
1. Check backend is running: `npm run start:dev`
2. Verify environment variables
3. Check browser console for errors
4. Review backend logs
5. Test with curl or Postman

## 📝 License

Part of FYP Service Marketplace project

---

**Last Updated:** April 14, 2026  
**Status:** ✅ Ready for Development
