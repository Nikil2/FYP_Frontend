/**
 * API Usage Examples
 * Complete examples of how to use the API layer
 * 
 * This file demonstrates all available API functions
 * and best practices for error handling
 */

import {
  getServices,
  getActiveServices,
  getServiceById,
  groupServicesByCategory,
  filterServicesByCategory,
  filterServicesByKeyword,
  registerWorker,
  getWorkerDetails,
  addPortfolioImage,
  getPortfolioImages,
  updatePortfolioImage,
  deletePortfolioImage,
  prepareWorkerRegistrationData,
  Service,
  WorkerRegistrationData,
  ApiRequestError,
} from './index';

// ============================================
// SERVICES API EXAMPLES
// ============================================

/**
 * Example 1: Fetch all services and display them
 */
export async function example1_GetAllServices(): Promise<void> {
  try {
    console.log('Fetching all services...');
    const services = await getServices();
    console.log(`Retrieved ${services.length} services:`, services);

    // Display in groups
    const grouped = groupServicesByCategory(services);
    Object.entries(grouped).forEach(([category, items]) => {
      console.log(`\n${category}:`);
      items.forEach((service) => {
        console.log(`  ${service.icon} ${service.name}`);
      });
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      console.error(`Error (${error.statusCode}): ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

/**
 * Example 2: Get active services only
 */
export async function example2_GetActiveServices(): Promise<void> {
  try {
    console.log('Fetching active services...');
    const services = await getActiveServices();
    console.log(`Retrieved ${services.length} active services`);
  } catch (error) {
    console.error('Failed to fetch active services:', error);
  }
}

/**
 * Example 3: Search services by keyword
 */
export async function example3_SearchServices(keyword: string): Promise<void> {
  try {
    console.log(`Searching services for: "${keyword}"`);
    const services = await getServices();
    const results = filterServicesByKeyword(services, keyword);
    console.log(`Found ${results.length} results:`, results);
  } catch (error) {
    console.error('Search failed:', error);
  }
}

/**
 * Example 4: Filter services by category
 */
export async function example4_FilterByCategory(
  category: string
): Promise<void> {
  try {
    console.log(`Filtering services by category: ${category}`);
    const services = await getServices();
    const filtered = filterServicesByCategory(services, category);
    console.log(`Found ${filtered.length} services in ${category}:`, filtered);
  } catch (error) {
    console.error('Filter failed:', error);
  }
}

/**
 * Example 5: Get specific service detail
 */
export async function example5_GetServiceDetail(serviceId: number): Promise<void> {
  try {
    console.log(`Fetching service ${serviceId}...`);
    const service = await getServiceById(serviceId);
    console.log('Service details:', service);
  } catch (error) {
    console.error(`Failed to fetch service ${serviceId}:`, error);
  }
}

// ============================================
// WORKER REGISTRATION EXAMPLES
// ============================================

/**
 * Example 6: Basic worker registration
 */
export async function example6_BasicWorkerRegistration(): Promise<void> {
  try {
    console.log('Registering new worker...');

    const registrationData: WorkerRegistrationData = {
      fullName: 'Ahmed Khan',
      phoneNumber: '+923334445566',
      password: 'SecurePassword123',
      cnicNumber: '3520123456789',
      cnicFrontUrl: 'https://example.com/cnic-front.jpg',
      cnicBackUrl: 'https://example.com/cnic-back.jpg',
      homeAddress: '123 Main Street, Karachi',
      homeLat: 24.8607,
      homeLng: 67.0011,
      experienceYears: 3,
      visitingCharges: 500,
      serviceIds: [1, 2], // Electrician services
    };

    const worker = await registerWorker(registrationData);
    console.log('Worker registered successfully:', {
      id: worker.id,
      name: `${worker.firstName} ${worker.lastName}`,

      status: worker.verificationStatus,
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      console.error(`Registration failed (${error.statusCode}): ${error.message}`);
    } else {
      console.error('Registration error:', error);
    }
  }
}

/**
 * Example 7: Worker registration with portfolio
 */
export async function example7_WorkerRegistrationWithPortfolio(): Promise<void> {
  try {
    console.log('Registering worker with portfolio...');

    const registrationData: WorkerRegistrationData = {
      fullName: 'Hassan Ali',
      phoneNumber: '+923001234567',
      password: 'SecurePassword456',
      cnicNumber: '3510112345678',
      cnicFrontUrl: 'https://example.com/cnic-front.jpg',
      cnicBackUrl: 'https://example.com/cnic-back.jpg',
      homeAddress: 'Defence, Karachi',
      homeLat: 24.8245,
      homeLng: 67.0317,
      experienceYears: 5,
      visitingCharges: 750,
      serviceIds: [1, 2, 3], // Multiple services
      portfolioImages: [
        {
          imageUrl: 'https://example.com/project1.jpg',
          description: 'Commercial building wiring installation',
        },
        {
          imageUrl: 'https://example.com/project2.jpg',
          description: 'Residential electrical maintenance',
        },
      ],
    };

    const worker = await registerWorker(registrationData);
    console.log('Worker registered successfully:', {
      id: worker.id,
      name: `${worker.firstName} ${worker.lastName}`,
      portfolio: worker.portfolio.length,
    });
  } catch (error) {
    console.error('Registration with portfolio failed:', error);
  }
}

/**
 * Example 8: Form data validation and preparation
 */
export async function example8_PrepareFormData(
  formData: Record<string, unknown>
): Promise<void> {
  try {
    console.log('Preparing form data...');

    // Validate and prepare
    const prepared = prepareWorkerRegistrationData(formData);
    console.log('Prepared data:', prepared);

    // Now register
    const worker = await registerWorker(prepared);
    console.log('Registration successful:', worker.id);
  } catch (error) {
    console.error('Form preparation failed:', error);
  }
}

// ============================================
// PORTFOLIO MANAGEMENT EXAMPLES
// ============================================

/**
 * Example 9: Add portfolio image after registration
 */
export async function example9_AddPortfolioImage(workerId: string): Promise<void> {
  try {
    console.log(`Adding portfolio image for worker ${workerId}...`);

    const portfolio = {
      imageUrl: 'https://example.com/new-project.jpg',
      description: 'Beautiful kitchen remodeling project',
    };

    const image = await addPortfolioImage(workerId, portfolio);
    console.log('Portfolio image added:', {
      id: image.id,
      description: image.description,
      createdAt: image.createdAt,
    });
  } catch (error) {
    console.error('Failed to add portfolio image:', error);
  }
}

/**
 * Example 10: Get all portfolio images
 */
export async function example10_GetPortfolio(workerId: string): Promise<void> {
  try {
    console.log(`Fetching portfolio for worker ${workerId}...`);

    const images = await getPortfolioImages(workerId);
    console.log(`Retrieved ${images.length} portfolio images:`);
    images.forEach((img, idx) => {
      console.log(`  ${idx + 1}. ${img.description} - ${img.createdAt}`);
    });
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
  }
}

/**
 * Example 11: Update portfolio description
 */
export async function example11_UpdatePortfolioImage(
  workerId: string,
  portfolioId: string,
  newDescription: string
): Promise<void> {
  try {
    console.log(`Updating portfolio image ${portfolioId}...`);

    const updated = await updatePortfolioImage(workerId, portfolioId, {
      description: newDescription,
    });
    console.log('Portfolio image updated:', {
      id: updated.id,
      description: updated.description,
    });
  } catch (error) {
    console.error('Failed to update portfolio image:', error);
  }
}

/**
 * Example 12: Delete portfolio image
 */
export async function example12_DeletePortfolioImage(
  workerId: string,
  portfolioId: string
): Promise<void> {
  try {
    console.log(`Deleting portfolio image ${portfolioId}...`);

    const result = await deletePortfolioImage(workerId, portfolioId);
    console.log('Portfolio image deleted:', result.message);
  } catch (error) {
    console.error('Failed to delete portfolio image:', error);
  }
}

// ============================================
// ERROR HANDLING EXAMPLES
// ============================================

/**
 * Example 13: Comprehensive error handling
 */
export async function example13_ErrorHandling(): Promise<void> {
  try {
    const registrationData: WorkerRegistrationData = {
      fullName: '',
      phoneNumber: '',
      password: '',
      cnicNumber: '',
      cnicFrontUrl: '',
      cnicBackUrl: '',
      homeAddress: '',
      homeLat: 0,
      homeLng: 0,
      experienceYears: 0,
      visitingCharges: 0,
      serviceIds: [],
    };

    await registerWorker(registrationData);
  } catch (error) {
    if (error instanceof ApiRequestError) {
      // Handle API errors
      switch (error.statusCode) {
        case 400:
          console.error('Bad request:', error.message);
          break;
        case 401:
          console.error('Unauthorized:', error.message);
          break;
        case 404:
          console.error('Not found:', error.message);
          break;
        case 408:
          console.error('Request timeout');
          break;
        case 500:
          console.error('Server error:', error.message);
          break;
        default:
          console.error(`Error ${error.statusCode}:`, error.message);
      }
    } else if (error instanceof Error) {
      // Handle validation errors
      console.error('Validation error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// ============================================
// RUN EXAMPLES
// ============================================

/**
 * Run all examples
 */
export async function runAllExamples(): Promise<void> {
  console.log('=== API Usage Examples ===\n');

  console.log('Example 1: Get all services');
  await example1_GetAllServices();

  console.log('\n\nExample 2: Get active services');
  await example2_GetActiveServices();

  console.log('\n\nExample 3: Search services');
  await example3_SearchServices('Electrician');

  console.log('\n\nExample 4: Filter by category');
  await example4_FilterByCategory('Electrician');

  console.log('\n\nExample 6: Basic worker registration');
  await example6_BasicWorkerRegistration();

  console.log('\n\nExample 7: Worker registration with portfolio');
  await example7_WorkerRegistrationWithPortfolio();

  console.log('\n\nExample 13: Error handling');
  await example13_ErrorHandling();
}

export default {
  example1_GetAllServices,
  example2_GetActiveServices,
  example3_SearchServices,
  example4_FilterByCategory,
  example5_GetServiceDetail,
  example6_BasicWorkerRegistration,
  example7_WorkerRegistrationWithPortfolio,
  example8_PrepareFormData,
  example9_AddPortfolioImage,
  example10_GetPortfolio,
  example11_UpdatePortfolioImage,
  example12_DeletePortfolioImage,
  example13_ErrorHandling,
  runAllExamples,
};
