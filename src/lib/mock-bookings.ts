import type {
  Booking,
  ChatConversation,
  SavedLocation,
  CustomerProfile,
  DashboardStats,
} from "@/types/booking";

// Mock Customer Profile
export const MOCK_CUSTOMER: CustomerProfile = {
  id: "customer-1",
  name: "Ali Ahmed",
  email: "ali.ahmed@email.com",
  phone: "+92-300-1234567",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali",
  createdAt: "2023-06-15T10:30:00Z",
  totalBookings: 24,
  totalSpent: 45000,
  averageRating: 4.7,
};

// Mock Saved Locations
export const MOCK_SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: "location-1",
    name: "Home",
    address: "123 Clifton, Karachi, Pakistan",
    lat: 24.7822,
    lng: 67.0437,
    isDefault: true,
  },
  {
    id: "location-2",
    name: "Office",
    address: "456 Defence, Karachi, Pakistan",
    lat: 24.7941,
    lng: 67.0271,
    isDefault: false,
  },
  {
    id: "location-3",
    name: "Summer House",
    address: "789 DHA, Karachi, Pakistan",
    lat: 24.8024,
    lng: 67.0521,
    isDefault: false,
  },
];

// Mock Bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    workerId: "worker-1",
    worker: {
      id: "worker-1",
      name: "Muhammad Hassan",
      category: "Electrician",
      rating: 4.9,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
      isOnline: true,
    },
    serviceId: "service-1",
    serviceName: "Electrical Wiring Installation",
    status: "in-progress",
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "14:00",
    location: MOCK_SAVED_LOCATIONS[0],
    jobDescription: "Install new ceiling fan with dimmer switch",
    estimatedCost: 3500,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-2",
    workerId: "worker-2",
    worker: {
      id: "worker-2",
      name: "Fatima Khan",
      category: "Plumber",
      rating: 4.8,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      isOnline: false,
    },
    serviceId: "service-2",
    serviceName: "Pipe Leak Repair",
    status: "pending",
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "10:00",
    location: MOCK_SAVED_LOCATIONS[1],
    jobDescription: "Fix leaking pipe in kitchen sink",
    estimatedCost: 2000,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-3",
    workerId: "worker-3",
    worker: {
      id: "worker-3",
      name: "Ahmed Malik",
      category: "Carpenter",
      rating: 4.7,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      isOnline: true,
    },
    serviceId: "service-3",
    serviceName: "Custom Cabinet Making",
    status: "confirmed",
    scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "09:00",
    location: MOCK_SAVED_LOCATIONS[2],
    jobDescription: "Build custom wooden shelving unit",
    estimatedCost: 12000,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-4",
    workerId: "worker-4",
    worker: {
      id: "worker-4",
      name: "Sarah Peters",
      category: "Painter",
      rating: 4.6,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      isOnline: true,
    },
    serviceId: "service-4",
    serviceName: "Interior Wall Painting",
    status: "completed",
    scheduledDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "08:00",
    location: MOCK_SAVED_LOCATIONS[0],
    jobDescription: "Paint living room with premium finish",
    estimatedCost: 5000,
    finalCost: 5200,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5,
    review: "Excellent work! Very professional and clean. Highly recommended!",
  },
  {
    id: "booking-5",
    workerId: "worker-5",
    worker: {
      id: "worker-5",
      name: "Rizwan Ahmed",
      category: "AC Technician",
      rating: 4.8,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rizwan",
      isOnline: false,
    },
    serviceId: "service-5",
    serviceName: "AC Unit Repair & Maintenance",
    status: "completed",
    scheduledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "11:00",
    location: MOCK_SAVED_LOCATIONS[1],
    jobDescription: "AC compressor repair and cleaning",
    estimatedCost: 4000,
    finalCost: 4500,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
    review: "Good service. Fixed the issue quickly.",
  },
  {
    id: "booking-6",
    workerId: "worker-1",
    worker: {
      id: "worker-1",
      name: "Muhammad Hassan",
      category: "Electrician",
      rating: 4.9,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
      isOnline: true,
    },
    serviceId: "service-1",
    serviceName: "Light Bulb Installation",
    status: "completed",
    scheduledDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "15:00",
    location: MOCK_SAVED_LOCATIONS[2],
    jobDescription: "Install LED lights in bedroom",
    estimatedCost: 1500,
    finalCost: 1500,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5,
    review: "Perfect work! Very quick and professional.",
  },
  {
    id: "booking-7",
    workerId: "worker-2",
    worker: {
      id: "worker-2",
      name: "Fatima Khan",
      category: "Plumber",
      rating: 4.8,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      isOnline: false,
    },
    serviceId: "service-2",
    serviceName: "Tap Repair",
    status: "completed",
    scheduledDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "10:00",
    location: MOCK_SAVED_LOCATIONS[0],
    jobDescription: "Fix leaking bathroom tap",
    estimatedCost: 800,
    finalCost: 800,
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 4,
    review: "Good service, resolved the issue.",
  },
  {
    id: "booking-8",
    workerId: "worker-3",
    worker: {
      id: "worker-3",
      name: "Ahmed Malik",
      category: "Carpenter",
      rating: 4.7,
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      isOnline: true,
    },
    serviceId: "service-3",
    serviceName: "Door Installation",
    status: "completed",
    scheduledDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "09:00",
    location: MOCK_SAVED_LOCATIONS[1],
    jobDescription: "Install wooden main door",
    estimatedCost: 8000,
    finalCost: 8500,
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    rating: 5,
    review: "Excellent craftsmanship. Door is sturdy and well-finished.",
  },
];

// Mock Chat Conversations
export const MOCK_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conversation-1",
    workerId: "worker-1",
    workerName: "Muhammad Hassan",
    workerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
    lastMessage: "I'll be there in 15 minutes!",
    lastMessageTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    unreadCount: 1,
    messages: [
      {
        id: "msg-1",
        senderId: "customer-1",
        senderName: "Ali Ahmed",
        senderType: "customer",
        message: "Hi Hassan, when will you arrive?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: true,
      },
      {
        id: "msg-2",
        senderId: "worker-1",
        senderName: "Muhammad Hassan",
        senderType: "worker",
        message: "I'm on my way. About 20 minutes away.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        isRead: true,
      },
      {
        id: "msg-3",
        senderId: "worker-1",
        senderName: "Muhammad Hassan",
        senderType: "worker",
        message: "I'll be there in 15 minutes!",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        isRead: false,
      },
    ],
  },
  {
    id: "conversation-2",
    workerId: "worker-4",
    workerName: "Sarah Peters",
    workerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastMessage: "Great! I'll send you the final invoice soon.",
    lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "msg-4",
        senderId: "customer-1",
        senderName: "Ali Ahmed",
        senderType: "customer",
        message: "The painting looks amazing! Thank you so much.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
      {
        id: "msg-5",
        senderId: "worker-4",
        senderName: "Sarah Peters",
        senderType: "worker",
        message: "Thank you! I'm glad you're happy with the work.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
      {
        id: "msg-6",
        senderId: "worker-4",
        senderName: "Sarah Peters",
        senderType: "worker",
        message: "Great! I'll send you the final invoice soon.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
    ],
  },
  {
    id: "conversation-3",
    workerId: "worker-3",
    workerName: "Ahmed Malik",
    workerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    lastMessage: "Sounds good! See you soon.",
    lastMessageTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "msg-7",
        senderId: "customer-1",
        senderName: "Ali Ahmed",
        senderType: "customer",
        message: "Hi Ahmed, looking forward to the cabinet work!",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
      {
        id: "msg-8",
        senderId: "worker-3",
        senderName: "Ahmed Malik",
        senderType: "worker",
        message: "Sounds good! See you soon.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
    ],
  },
];

// Helper Functions

export function getCustomerProfile(): CustomerProfile {
  return MOCK_CUSTOMER;
}

export function getActiveBookings(): Booking[] {
  return MOCK_BOOKINGS.filter((booking) =>
    ["pending", "confirmed", "in-progress"].includes(booking.status)
  );
}

export function getBookingHistory(): Booking[] {
  return MOCK_BOOKINGS.filter((booking) =>
    ["completed", "cancelled"].includes(booking.status)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBookingById(bookingId: string): Booking | undefined {
  return MOCK_BOOKINGS.find((booking) => booking.id === bookingId);
}

export function getChatConversations(): ChatConversation[] {
  return MOCK_CHAT_CONVERSATIONS.sort((a, b) =>
    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );
}

export function getChatConversationById(
  conversationId: string
): ChatConversation | undefined {
  return MOCK_CHAT_CONVERSATIONS.find((conv) => conv.id === conversationId);
}

export function getSavedLocations(): SavedLocation[] {
  return MOCK_SAVED_LOCATIONS;
}

export function getDefaultLocation(): SavedLocation | undefined {
  return MOCK_SAVED_LOCATIONS.find((loc) => loc.isDefault);
}

export function getDashboardStats(): DashboardStats {
  const activeBookings = getActiveBookings();
  const bookingHistory = getBookingHistory();
  const totalSpent = MOCK_CUSTOMER.totalSpent;
  const averageRating = MOCK_CUSTOMER.averageRating;

  return {
    activeBookings: activeBookings.length,
    completedBookings: bookingHistory.length,
    totalSpent,
    averageRating,
  };
}
