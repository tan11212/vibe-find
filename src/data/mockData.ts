
import { PG, Question, RoommateProfile, Amenity } from '@/types';

// Amenities
export const amenities: Amenity[] = [
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'ac', name: 'AC', icon: '❄️' },
  { id: 'meals', name: 'Meals', icon: '🍛' },
  { id: 'laundry', name: 'Laundry', icon: '👕' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
  { id: 'tv', name: 'TV', icon: '📺' },
  { id: 'fridge', name: 'Fridge', icon: '🧊' },
  { id: 'parking', name: 'Parking', icon: '🅿️' },
  { id: 'gym', name: 'Gym', icon: '💪' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'bed', name: 'Bed', icon: '🛏️' },
  { id: 'mattress', name: 'Mattress', icon: '🧴' },
  { id: 'desk', name: 'Study Desk', icon: '📚' },
  { id: 'balcony', name: 'Balcony', icon: '🌇' },
  { id: 'power-backup', name: 'Power Backup', icon: '🔋' },
];

// Mock PG Data
export const mockPGs: PG[] = [
  {
    id: 'pg1',
    name: 'Comfort Stay PG',
    address: '123 College Road, Koramangala',
    location: { lat: 12.9352, lng: 77.6245 },
    gender: 'male',
    rooms: [
      {
        id: 'r1',
        type: 'double',
        beds: [
          { id: 'b1', isOccupied: false },
          { id: 'b2', isOccupied: true, availableFrom: new Date('2025-05-15') },
        ],
        price: 9000,
        amenities: ['bed', 'mattress', 'wifi', 'ac', 'desk'],
      },
      {
        id: 'r2',
        type: 'single',
        beds: [{ id: 'b3', isOccupied: true, availableFrom: new Date('2025-05-01') }],
        price: 12000,
        amenities: ['bed', 'mattress', 'wifi', 'ac', 'desk', 'balcony'],
      },
    ],
    totalBeds: 3,
    availableBeds: 1,
    amenities: ['wifi', 'meals', 'ac', 'laundry', 'cleaning', 'security', 'power-backup'],
    nearbyPlaces: [
      { id: 'np1', name: 'HDFC ATM', type: 'atm', distance: 200, location: { lat: 12.9362, lng: 77.6255 } },
      { id: 'np2', name: 'College Canteen', type: 'canteen', distance: 500, location: { lat: 12.9372, lng: 77.6265 } },
      { id: 'np3', name: 'Fitness First', type: 'gym', distance: 800, location: { lat: 12.9382, lng: 77.6275 } },
      { id: 'np4', name: 'Apollo Clinic', type: 'hospital', distance: 1200, location: { lat: 12.9392, lng: 77.6285 } },
      { id: 'np5', name: 'Bus Stop 42', type: 'bus', distance: 300, location: { lat: 12.9402, lng: 77.6295 } },
    ],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457',
    ],
    description: 'A comfortable PG for students with all basic amenities and close to major colleges.',
    rating: 4.2,
    reviews: 24,
    isFavorite: false,
  },
  {
    id: 'pg2',
    name: 'Homely Living PG',
    address: '456 Tech Park Road, HSR Layout',
    location: { lat: 12.9141, lng: 77.6371 },
    gender: 'female',
    rooms: [
      {
        id: 'r3',
        type: 'triple',
        beds: [
          { id: 'b4', isOccupied: true, availableFrom: new Date('2025-06-10') },
          { id: 'b5', isOccupied: true, availableFrom: new Date('2025-05-20') },
          { id: 'b6', isOccupied: false },
        ],
        price: 7500,
        amenities: ['bed', 'mattress', 'wifi', 'desk'],
      },
      {
        id: 'r4',
        type: 'double',
        beds: [
          { id: 'b7', isOccupied: false },
          { id: 'b8', isOccupied: false },
        ],
        price: 9500,
        amenities: ['bed', 'mattress', 'wifi', 'ac', 'desk', 'balcony'],
      },
    ],
    totalBeds: 5,
    availableBeds: 3,
    amenities: ['wifi', 'meals', 'laundry', 'security', 'tv', 'fridge'],
    nearbyPlaces: [
      { id: 'np6', name: 'SBI ATM', type: 'atm', distance: 400, location: { lat: 12.9151, lng: 77.6381 } },
      { id: 'np7', name: 'Food Court', type: 'canteen', distance: 300, location: { lat: 12.9161, lng: 77.6391 } },
      { id: 'np8', name: 'Gold\'s Gym', type: 'gym', distance: 1200, location: { lat: 12.9171, lng: 77.6401 } },
      { id: 'np9', name: 'Fortis Hospital', type: 'hospital', distance: 1800, location: { lat: 12.9181, lng: 77.6411 } },
      { id: 'np10', name: 'HSR Bus Terminal', type: 'bus', distance: 600, location: { lat: 12.9191, lng: 77.6421 } },
    ],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15',
    ],
    description: 'Homely PG for working women with healthy food and safe environment.',
    rating: 4.5,
    reviews: 37,
    isFavorite: true,
  },
  {
    id: 'pg3',
    name: 'Budget Student PG',
    address: '789 University Road, BTM Layout',
    location: { lat: 12.9102, lng: 77.6103 },
    gender: 'co-ed',
    rooms: [
      {
        id: 'r5',
        type: 'triple',
        beds: [
          { id: 'b9', isOccupied: true, availableFrom: new Date('2025-05-05') },
          { id: 'b10', isOccupied: true, availableFrom: new Date('2025-06-15') },
          { id: 'b11', isOccupied: false },
        ],
        price: 6500,
        amenities: ['bed', 'mattress', 'wifi', 'desk'],
      },
      {
        id: 'r6',
        type: 'double',
        beds: [
          { id: 'b12', isOccupied: true, availableFrom: new Date('2025-05-25') },
          { id: 'b13', isOccupied: false },
        ],
        price: 8000,
        amenities: ['bed', 'mattress', 'wifi', 'desk'],
      },
    ],
    totalBeds: 5,
    availableBeds: 2,
    amenities: ['wifi', 'meals', 'security', 'parking', 'power-backup'],
    nearbyPlaces: [
      { id: 'np11', name: 'ICICI ATM', type: 'atm', distance: 350, location: { lat: 12.9112, lng: 77.6113 } },
      { id: 'np12', name: 'Student Cafe', type: 'canteen', distance: 250, location: { lat: 12.9122, lng: 77.6123 } },
      { id: 'np13', name: 'University Gym', type: 'gym', distance: 500, location: { lat: 12.9132, lng: 77.6133 } },
      { id: 'np14', name: 'City Hospital', type: 'hospital', distance: 1500, location: { lat: 12.9142, lng: 77.6143 } },
      { id: 'np15', name: 'BTM Bus Point', type: 'bus', distance: 400, location: { lat: 12.9152, lng: 77.6153 } },
    ],
    images: [
      'https://images.unsplash.com/photo-1595846519845-68e298c2edd8',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
    ],
    description: 'Affordable PG for students with basic facilities and study-friendly environment.',
    rating: 3.8,
    reviews: 19,
    isFavorite: false,
  },
];

// Roommate Questionnaire Questions
export const roommateQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Do you blast music while studying?',
    icon: '🎧',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'q2',
    text: 'Do you care about cleaning schedules?',
    icon: '🧹',
    options: [
      { value: 'strict', label: 'Strict' },
      { value: 'flexible', label: 'Flexible' },
      { value: 'dont-care', label: 'Don\'t care' },
    ],
  },
  {
    id: 'q3',
    text: 'Night owl or sunrise worshipper?',
    icon: '🌙',
    options: [
      { value: 'night-owl', label: 'Night owl' },
      { value: 'early-riser', label: 'Early riser' },
      { value: 'varies', label: 'It varies' },
    ],
  },
  {
    id: 'q4',
    text: 'Do you smoke?',
    icon: '🚬',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'occasionally', label: 'Occasionally' },
    ],
  },
  {
    id: 'q5',
    text: 'Are you okay with guests visiting often?',
    icon: '👥',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'occasionally', label: 'Occasionally' },
    ],
  },
  {
    id: 'q6',
    text: 'Preferred language?',
    icon: '🗣️',
    options: [
      { value: 'english', label: 'English' },
      { value: 'hindi', label: 'Hindi' },
      { value: 'punjabi', label: 'Punjabi' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'q7',
    text: 'How often do you cook?',
    icon: '🍳',
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'few-times-week', label: 'Few times a week' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'never', label: 'Never' },
    ],
  },
  {
    id: 'q8',
    text: 'What time do you usually sleep?',
    icon: '😴',
    options: [
      { value: 'before-10pm', label: 'Before 10 PM' },
      { value: '10pm-12am', label: 'Between 10 PM - 12 AM' },
      { value: 'after-12am', label: 'After 12 AM' },
      { value: 'varies', label: 'It varies' },
    ],
  },
  {
    id: 'q9',
    text: 'How tidy do you keep your space?',
    icon: '🧺',
    options: [
      { value: 'very-tidy', label: 'Very tidy' },
      { value: 'somewhat-tidy', label: 'Somewhat tidy' },
      { value: 'little-messy', label: 'A little messy' },
      { value: 'very-messy', label: 'Very messy' },
    ],
  },
  {
    id: 'q10',
    text: 'How do you feel about sharing food?',
    icon: '🍱',
    options: [
      { value: 'happy-to-share', label: 'Happy to share' },
      { value: 'prefer-separate', label: 'Prefer to keep separate' },
      { value: 'depends', label: 'Depends on the food' },
    ],
  },
];

// Mock Roommate Profiles 
export const mockRoommates: RoommateProfile[] = [
  {
    id: 'rm1',
    name: 'Alex',
    age: 23,
    gender: 'male',
    occupation: 'Software Engineer',
    lookingFor: 'just-roommate',
    answers: [
      { questionId: 'q1', answer: 'no' },
      { questionId: 'q2', answer: 'flexible' },
      { questionId: 'q3', answer: 'night-owl' },
      { questionId: 'q4', answer: 'no' },
      { questionId: 'q5', answer: 'occasionally' },
      { questionId: 'q6', answer: 'english' },
      { questionId: 'q7', answer: 'rarely' },
      { questionId: 'q8', answer: 'after-12am' },
      { questionId: 'q9', answer: 'somewhat-tidy' },
      { questionId: 'q10', answer: 'happy-to-share' },
    ],
    bio: 'Software engineer working at a startup. Quiet, but friendly. I enjoy gaming and watching movies in my free time.',
    compatibilityScore: 85,
    sharedTraits: ['Non-smoker', 'Night owl', 'Tech enthusiast'],
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'rm2',
    name: 'Priya',
    age: 21,
    gender: 'female',
    occupation: 'Student',
    lookingFor: 'room-and-roommate',
    answers: [
      { questionId: 'q1', answer: 'no' },
      { questionId: 'q2', answer: 'strict' },
      { questionId: 'q3', answer: 'early-riser' },
      { questionId: 'q4', answer: 'no' },
      { questionId: 'q5', answer: 'no' },
      { questionId: 'q6', answer: 'hindi' },
      { questionId: 'q7', answer: 'daily' },
      { questionId: 'q8', answer: '10pm-12am' },
      { questionId: 'q9', answer: 'very-tidy' },
      { questionId: 'q10', answer: 'prefer-separate' },
    ],
    bio: 'Engineering student looking for a quiet place to study. I am organized and prefer a clean living space.',
    compatibilityScore: 72,
    sharedTraits: ['Non-smoker', 'Organized', 'Studious'],
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'rm3',
    name: 'Sam',
    age: 25,
    gender: 'male',
    occupation: 'Graphic Designer',
    lookingFor: 'room-and-roommate',
    answers: [
      { questionId: 'q1', answer: 'yes' },
      { questionId: 'q2', answer: 'flexible' },
      { questionId: 'q3', answer: 'night-owl' },
      { questionId: 'q4', answer: 'occasionally' },
      { questionId: 'q5', answer: 'yes' },
      { questionId: 'q6', answer: 'english' },
      { questionId: 'q7', answer: 'few-times-week' },
      { questionId: 'q8', answer: 'after-12am' },
      { questionId: 'q9', answer: 'little-messy' },
      { questionId: 'q10', answer: 'happy-to-share' },
    ],
    bio: 'Creative soul working as a freelance designer. I enjoy socializing and having friends over occasionally.',
    compatibilityScore: 65,
    sharedTraits: ['Creative', 'Night owl', 'Sociable'],
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    id: 'rm4',
    name: 'Neha',
    age: 24,
    gender: 'female',
    occupation: 'MBA Student',
    lookingFor: 'just-roommate',
    answers: [
      { questionId: 'q1', answer: 'no' },
      { questionId: 'q2', answer: 'strict' },
      { questionId: 'q3', answer: 'early-riser' },
      { questionId: 'q4', answer: 'no' },
      { questionId: 'q5', answer: 'occasionally' },
      { questionId: 'q6', answer: 'hindi' },
      { questionId: 'q7', answer: 'rarely' },
      { questionId: 'q8', answer: 'before-10pm' },
      { questionId: 'q9', answer: 'very-tidy' },
      { questionId: 'q10', answer: 'prefer-separate' },
    ],
    bio: 'MBA student who is focused on academics. I am an early riser and maintain a healthy lifestyle.',
    compatibilityScore: 91,
    sharedTraits: ['Early riser', 'Non-smoker', 'Organized'],
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
];

// AI Generated packing list for different types of PGs
export const generatePackingList = (pg: PG) => {
  const hasMeals = pg.amenities.includes('meals');
  const hasAC = pg.amenities.includes('ac');
  const hasLaundry = pg.amenities.includes('laundry');
  const hasFridge = pg.amenities.includes('fridge');
  
  const essentials = [
    '🔑 ID Proof (Aadhar, PAN, Passport)',
    '💰 Security Deposit Amount',
    '👕 Clothes for the season',
    '🧦 Undergarments and socks',
    '👞 Shoes/Slippers',
    '🛁 Toiletries kit (soap, shampoo, etc.)',
    '🪥 Toothbrush & toothpaste',
    '💊 Basic medicines',
    '💻 Laptop & charger',
    '📱 Phone & charger',
  ];
  
  const conditionalItems = [];
  
  if (!hasMeals) {
    conditionalItems.push(
      '🥄 Basic utensils',
      '🍽️ Plate, cup and bowl',
      '🍳 Small cooking equipment',
      '🧂 Basic spices'
    );
  }
  
  if (!hasAC) {
    conditionalItems.push('💨 Table fan');
  }
  
  if (!hasLaundry) {
    conditionalItems.push('🧼 Laundry soap/detergent', '🧺 Small bucket for washing');
  }
  
  if (!hasFridge) {
    conditionalItems.push('📦 Small airtight containers for food');
  }
  
  const otherItems = [
    '📕 Study materials',
    '🔌 Extension cord',
    '🔍 Small mirror',
    '🧹 Small cleaning supplies',
    '🚰 Water bottle',
    '👚 Clothes hangers',
    '🧷 Clips and pins',
    '📦 Storage containers',
    '✂️ Scissors',
  ];
  
  return [...essentials, ...conditionalItems, ...otherItems];
};
