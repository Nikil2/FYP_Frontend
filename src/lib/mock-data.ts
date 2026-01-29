// Centralized mock data for workers - used by search, landing page, and worker detail pages
// This is the single source of truth for all worker information

import type { WorkerDetail } from "@/types/worker";

export const MOCK_WORKERS: WorkerDetail[] = [
  // Worker 1: Ahmed Hassan - Electrician
  {
    id: "ahmed-hassan",
    name: "Ahmed Hassan",
    category: "Electrician",
    rating: 4.9,
    reviewCount: 287,
    distance: 2.3,
    visitingFee: 500,
    isOnline: true,
    isVerified: true,
    bio: "Professional electrician with 8+ years of experience in residential and commercial electrical work. Specialized in AC installation, house wiring, switchboard repair, and all types of electrical maintenance. CNIC verified and trusted by thousands of customers across Karachi.",
    experienceYears: 8,
    specializations: [
      "House Wiring",
      "AC Installation",
      "Switchboard Repair",
      "Maintenance",
      "LED Installation",
    ],
    services: [
      { id: "s1", name: "House Wiring", price: 1500 },
      { id: "s2", name: "AC Installation", price: 2000 },
      { id: "s3", name: "Switchboard Repair", price: 800 },
      { id: "s4", name: "Appliance Repair", price: 600 },
      { id: "s5", name: "LED Installation", price: 1200 },
      { id: "s6", name: "General Maintenance", price: 500 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Ali Khan",
        rating: 5,
        date: "2 days ago",
        comment:
          "Excellent work! Ahmed was very professional and completed the AC installation quickly. Highly recommended!",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Fatima Ahmed",
        rating: 5,
        date: "1 week ago",
        comment:
          "Great service! Ahmed fixed our electrical wiring issue in no time. Very skilled and courteous.",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Hassan Malik",
        rating: 4,
        date: "2 weeks ago",
        comment:
          "Good work on the switchboard repair. A bit expensive but the quality was worth it.",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Saira Hassan",
        rating: 5,
        date: "3 weeks ago",
        comment:
          "Ahmed is very experienced and trustworthy. Would definitely hire again for any electrical work.",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },

  // Worker 2: Muhammad Ali - Plumber
  {
    id: "muhammad-ali",
    name: "Muhammad Ali",
    category: "Plumber",
    rating: 4.8,
    reviewCount: 195,
    distance: 3.5,
    visitingFee: 450,
    isOnline: true,
    isVerified: true,
    bio: "Expert plumber with 10+ years of experience in pipe installations, repairs, and maintenance. Specialized in modern plumbing systems and emergency leak fixing. Available 24/7 for urgent repairs. Fully licensed and insured.",
    experienceYears: 10,
    specializations: [
      "Pipe Installation",
      "Leak Repair",
      "Drain Cleaning",
      "Water Heater Service",
      "Emergency Repairs",
    ],
    services: [
      { id: "s1", name: "Leak Detection & Repair", price: 800 },
      { id: "s2", name: "Pipe Installation", price: 1200 },
      { id: "s3", name: "Drain Cleaning", price: 600 },
      { id: "s4", name: "Water Heater Service", price: 900 },
      { id: "s5", name: "Bathroom Fixture Install", price: 700 },
      { id: "s6", name: "Emergency Service", price: 1500 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Zainab Hassan",
        rating: 5,
        date: "5 days ago",
        comment:
          "Fixed our leaking tap issue in minutes. Very efficient and professional. Worth every rupee!",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Khalid Ibrahim",
        rating: 5,
        date: "1 week ago",
        comment:
          "Installed new pipes in my kitchen. Work quality is excellent and he cleaned up after himself.",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Hira Khan",
        rating: 4,
        date: "2 weeks ago",
        comment:
          "Good plumber but took a bit longer than expected. Still very satisfied with the result.",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Hamza Ahmed",
        rating: 5,
        date: "3 weeks ago",
        comment:
          "Emergency service was fast and affordable. Highly recommend Muhammad Ali for any plumbing work.",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },

  // Worker 3: Usman Khan - Carpenter
  {
    id: "usman-khan",
    name: "Usman Khan",
    category: "Carpenter",
    rating: 5.0,
    reviewCount: 312,
    distance: 1.8,
    visitingFee: 700,
    isOnline: false,
    isVerified: true,
    bio: "Master carpenter with 12+ years of experience in custom furniture, interior fitting, and woodwork. Creates beautiful, durable pieces tailored to your needs. Known for precision craftsmanship and attention to detail.",
    experienceYears: 12,
    specializations: [
      "Custom Furniture",
      "Door & Window Fitting",
      "Cabinet Making",
      "Wood Finishing",
      "Kitchen Cabinets",
    ],
    services: [
      { id: "s1", name: "Custom Furniture Design", price: 3000 },
      { id: "s2", name: "Door & Window Fitting", price: 1500 },
      { id: "s3", name: "Cabinet Installation", price: 2000 },
      { id: "s4", name: "Shelving & Storage", price: 1200 },
      { id: "s5", name: "Wood Finishing", price: 800 },
      { id: "s6", name: "Repairs & Restoration", price: 600 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Samia Khan",
        rating: 5,
        date: "1 day ago",
        comment:
          "Usman made beautiful custom wardrobes for our bedroom. Perfect fit and finish. Absolutely love it!",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Adnan Malik",
        rating: 5,
        date: "1 week ago",
        comment:
          "Fitted new doors and windows. Very professional and his attention to detail is remarkable.",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Rukhsana Ahmed",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Built custom kitchen cabinets for our new house. Best carpenter I've worked with. Highly recommended!",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Farooq Hassan",
        rating: 5,
        date: "1 month ago",
        comment:
          "Restored my old wooden furniture beautifully. Usman is a true craftsman. 5 stars!",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },

  // Worker 4: Hassan Raza - Painter
  {
    id: "hassan-raza",
    name: "Hassan Raza",
    category: "Painter",
    rating: 4.7,
    reviewCount: 156,
    distance: 4.2,
    visitingFee: 550,
    isOnline: true,
    isVerified: true,
    bio: "Experienced painter specializing in interior and exterior painting. Uses premium quality paints and eco-friendly products. Provides consultation on color selection and finished stunning results every time.",
    experienceYears: 7,
    specializations: [
      "Interior Painting",
      "Exterior Painting",
      "Wall Texture Design",
      "Color Consultation",
      "Primer & Finishing",
    ],
    services: [
      { id: "s1", name: "Interior Painting", price: 1500 },
      { id: "s2", name: "Exterior Painting", price: 2000 },
      { id: "s3", name: "Wall Texture", price: 1200 },
      { id: "s4", name: "Color Consultation", price: 300 },
      { id: "s5", name: "Primer Application", price: 800 },
      { id: "s6", name: "Touch Up & Repairs", price: 400 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Nida Khan",
        rating: 5,
        date: "3 days ago",
        comment:
          "Hassan painted our living room beautifully. Very neat work and he helped us choose the perfect color.",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Tariq Ahmed",
        rating: 4,
        date: "1 week ago",
        comment:
          "Good painter. The exterior work looks great. Only took a bit longer than estimated.",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Iqra Hassan",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Professional painter with excellent color sense. My home looks amazing now!",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Kamran Sheikh",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Good quality painting work. Reasonable prices. Would hire again.",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },

  // Worker 5: Bilal Ahmed - AC Technician
  {
    id: "bilal-ahmed",
    name: "Bilal Ahmed",
    category: "AC Technician",
    rating: 4.9,
    reviewCount: 223,
    distance: 2.9,
    visitingFee: 650,
    isOnline: true,
    isVerified: true,
    bio: "Certified AC technician with 9+ years of experience in air conditioning installation, maintenance, and repair. Expert in all major brands. Provides warranty on all work done. Quick and reliable service.",
    experienceYears: 9,
    specializations: [
      "AC Installation",
      "Regular Maintenance",
      "Compressor Repair",
      "Gas Refilling",
      "Coil Cleaning",
    ],
    services: [
      { id: "s1", name: "AC Installation", price: 2500 },
      { id: "s2", name: "Maintenance Service", price: 500 },
      { id: "s3", name: "Gas Refilling", price: 900 },
      { id: "s4", name: "Coil Cleaning", price: 600 },
      { id: "s5", name: "Compressor Repair", price: 1500 },
      { id: "s6", name: "Emergency Service", price: 1200 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Sara Khan",
        rating: 5,
        date: "1 day ago",
        comment:
          "Installed a new AC unit in my office. Perfect installation and very affordable. Bilal is the best!",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Fahad Hassan",
        rating: 5,
        date: "1 week ago",
        comment:
          "Regular maintenance by Bilal keeps my AC running smoothly. Very professional and punctual.",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Aisha Malik",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "My AC compressor was making noise. Bilal fixed it quickly and gave me a 6-month warranty!",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Omar Ahmed",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Good service overall. Quick response to emergency calls. Reasonable pricing.",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },

  // Worker 6: Imran Malik - Electrician (Modern)
  {
    id: "imran-malik",
    name: "Imran Malik",
    category: "Electrician",
    rating: 4.6,
    reviewCount: 178,
    distance: 5.1,
    visitingFee: 480,
    isOnline: false,
    isVerified: true,
    bio: "Skilled electrician with 6+ years of experience in electrical installations and repairs. Specializes in home automation, solar installation, and energy-efficient solutions. Safety-conscious and detail-oriented.",
    experienceYears: 6,
    specializations: [
      "Home Automation",
      "Solar Installation",
      "Wiring Systems",
      "Panel Upgrades",
      "Energy Efficiency",
    ],
    services: [
      { id: "s1", name: "Solar Panel Installation", price: 5000 },
      { id: "s2", name: "Home Automation Setup", price: 3000 },
      { id: "s3", name: "Rewiring Services", price: 2000 },
      { id: "s4", name: "Electrical Panel Upgrade", price: 1800 },
      { id: "s5", name: "Fan & Light Installation", price: 400 },
      { id: "s6", name: "Troubleshooting & Repair", price: 500 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Mehreen Hassan",
        rating: 5,
        date: "5 days ago",
        comment:
          "Installed solar panels in my house. Imran is very knowledgeable about renewable energy. Great value!",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Wasim Khan",
        rating: 4,
        date: "1 week ago",
        comment:
          "Home automation setup is working perfectly. Would recommend for tech-savvy electrical solutions.",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Sana Ahmed",
        rating: 4,
        date: "2 weeks ago",
        comment:
          "Rewired my house. Very professional and explained everything clearly.",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Azhar Hassan",
        rating: 5,
        date: "3 weeks ago",
        comment:
          "Best electrician for modern solutions. Imran helped me set up smart lighting. Highly satisfied!",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },

  // Worker 7: Tariq Hussain - Mason
  {
    id: "tariq-hussain",
    name: "Tariq Hussain",
    category: "Mason",
    rating: 4.8,
    reviewCount: 264,
    distance: 3.7,
    visitingFee: 800,
    isOnline: true,
    isVerified: true,
    bio: "Experienced mason with 11+ years of expertise in brick laying, plastering, and construction work. Known for strong foundations and impeccable finishing. Handles both small repairs and large construction projects.",
    experienceYears: 11,
    specializations: [
      "Brick Laying",
      "Wall Plastering",
      "Concrete Work",
      "Foundation Laying",
      "Finishing Work",
    ],
    services: [
      { id: "s1", name: "Brick Laying", price: 1500 },
      { id: "s2", name: "Wall Plastering", price: 1200 },
      { id: "s3", name: "Concrete Flooring", price: 2000 },
      { id: "s4", name: "Foundation Work", price: 2500 },
      { id: "s5", name: "Tile Fixing", price: 1000 },
      { id: "s6", name: "Wall Repair", price: 600 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Faisal Khan",
        rating: 5,
        date: "2 days ago",
        comment:
          "Built strong walls for my extension. Tariq's craftsmanship is outstanding. Best mason in town!",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Reena Ahmed",
        rating: 5,
        date: "1 week ago",
        comment:
          "Plastered our entire house beautifully. Smooth walls and perfect finish. Very happy!",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Arif Hassan",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Laid foundation for my new home construction. Professional work and on-time delivery.",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Laila Khan",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Good work on wall repairs. Tariq is reliable and delivers quality work. Recommended!",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },

  // Worker 8: Kamran Shah - Plumber
  {
    id: "kamran-shah",
    name: "Kamran Shah",
    category: "Plumber",
    rating: 4.9,
    reviewCount: 201,
    distance: 1.5,
    visitingFee: 520,
    isOnline: true,
    isVerified: true,
    bio: "Reliable plumber with 8+ years of experience in all types of plumbing work. Specializes in quick response emergency calls and preventive maintenance. Uses high-quality materials and provides guaranteed service.",
    experienceYears: 8,
    specializations: [
      "Emergency Plumbing",
      "Preventive Maintenance",
      "Sewer Line Repair",
      "Faucet Installation",
      "Septic Tank Service",
    ],
    services: [
      { id: "s1", name: "Emergency Service", price: 1200 },
      { id: "s2", name: "Sewer Line Repair", price: 2000 },
      { id: "s3", name: "Preventive Maintenance", price: 600 },
      { id: "s4", name: "Faucet & Fixture Install", price: 800 },
      { id: "s5", name: "Septic Tank Service", price: 1500 },
      { id: "s6", name: "Clogged Drain Cleaning", price: 500 },
    ],
    reviews: [
      {
        id: "r1",
        customerName: "Hana Ali",
        rating: 5,
        date: "2 days ago",
        comment:
          "Called for emergency plumbing at night. Kamran came within 30 minutes. Very responsive!",
        customerAvatar: null,
      },
      {
        id: "r2",
        customerName: "Faqir Hassan",
        rating: 5,
        date: "1 week ago",
        comment:
          "Installed new faucets throughout my kitchen. Clean work and fair pricing. Highly satisfied!",
        customerAvatar: null,
      },
      {
        id: "r3",
        customerName: "Shabana Khan",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Repaired sewer line issue quickly. Kamran is professional and trustworthy. Highly recommended.",
        customerAvatar: null,
      },
      {
        id: "r4",
        customerName: "Junaid Ahmed",
        rating: 4,
        date: "3 weeks ago",
        comment:
          "Good maintenance service. Kamran is reliable and efficient. Would call again.",
        customerAvatar: null,
      },
    ],
    profileImage: null,
    location: { lat: 24.8607, lng: 67.0011 },
  },
];

// Helper functions for search and data retrieval
export function getWorkerById(workerId: string): WorkerDetail | null {
  return MOCK_WORKERS.find((worker) => worker.id === workerId) || null;
}

export function searchWorkers(query: string): WorkerDetail[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();

  return MOCK_WORKERS.filter((worker) => {
    // Search by name (partial match)
    const nameMatch = worker.name.toLowerCase().includes(lowerQuery);

    // Search by category (partial match)
    const categoryMatch = worker.category.toLowerCase().includes(lowerQuery);

    // Search by any specialization
    const specializationMatch = worker.specializations.some((spec) =>
      spec.toLowerCase().includes(lowerQuery),
    );

    return nameMatch || categoryMatch || specializationMatch;
  }).slice(0, 5); // Return max 5 results
}

export function getTopRatedWorkers(limit: number = 8): WorkerDetail[] {
  return MOCK_WORKERS.slice(0, limit);
}
