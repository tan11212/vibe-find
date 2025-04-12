
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
    text: 'What time do you usually wake up?',
    icon: '🌅',
    options: [
      { value: 'before-7am', label: 'Before 7 AM (Early riser)' },
      { value: '7am-9am', label: '7–9 AM' },
      { value: '9am-11am', label: '9–11 AM' },
      { value: 'after-11am', label: 'After 11 AM (Night owl)' },
    ],
  },
  {
    id: 'q2',
    text: 'What time do you typically go to sleep?',
    icon: '🌙',
    options: [
      { value: 'before-10pm', label: 'Before 10 PM' },
      { value: '10pm-midnight', label: '10 PM – Midnight' },
      { value: 'after-midnight', label: 'After Midnight' },
    ],
  },
  {
    id: 'q3',
    text: 'How do you prefer to study/work?',
    icon: '🎧',
    options: [
      { value: 'quiet', label: 'Quiet, focused environment' },
      { value: 'light-background', label: 'Light background music is fine' },
      { value: 'dont-mind-noise', label: "I don't mind noise, I multitask easily" },
    ],
  },
  {
    id: 'q4',
    text: 'Are you okay with guests visiting the room?',
    icon: '👥',
    options: [
      { value: 'no-guests', label: 'Prefer no guests' },
      { value: 'occasionally', label: 'Occasionally is okay' },
      { value: 'frequent', label: 'Open to frequent visits' },
    ],
  },
  {
    id: 'q5',
    text: 'Do you smoke?',
    icon: '🚬',
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
      { value: 'outside-only', label: 'I smoke outside only' },
    ],
  },
  {
    id: 'q6',
    text: 'How do you feel about cleaning?',
    icon: '🧹',
    options: [
      { value: 'clean-regularly', label: 'I clean regularly and expect the same' },
      { value: 'some-mess', label: "I don't mind some mess" },
      { value: 'not-into-cleaning', label: 'Not really into cleaning' },
    ],
  },
  {
    id: 'q7',
    text: 'How do you prefer to manage chores?',
    icon: '📅',
    options: [
      { value: 'schedule', label: 'Create and follow a schedule' },
      { value: 'alternate', label: 'Alternate informally' },
      { value: 'free-flow', label: 'Free flow — do it when you can' },
    ],
  },
  {
    id: 'q8',
    text: 'Your food habits?',
    icon: '🍳',
    options: [
      { value: 'non-vegetarian', label: 'Non-vegetarian' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'eat-out', label: 'Eat out mostly' },
    ],
  },
  {
    id: 'q9',
    text: 'Are you okay with cooking in the room?',
    icon: '🔥',
    options: [
      { value: 'yes', label: 'Yes, love to cook' },
      { value: 'occasionally', label: 'Occasionally' },
      { value: 'no', label: 'No, prefer not to' },
    ],
  },
  {
    id: 'q10',
    text: 'Do you need silence while sleeping?',
    icon: '😴',
    options: [
      { value: 'complete-silence', label: 'Yes, complete silence' },
      { value: 'low-noise', label: "I'm okay with low noise" },
      { value: 'sleep-through-anything', label: 'I can sleep through anything' },
    ],
  },
  {
    id: 'q11',
    text: 'How do you prefer room temperature?',
    icon: '❄️',
    options: [
      { value: 'cold', label: 'Cold' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'warm', label: 'Warm' },
    ],
  },
  {
    id: 'q12',
    text: 'Do you take long calls or video chats?',
    icon: '📱',
    options: [
      { value: 'rarely', label: 'Rarely' },
      { value: 'few-short-calls', label: 'A few short calls' },
      { value: 'long-frequent', label: 'Long frequent calls' },
    ],
  },
  {
    id: 'q13',
    text: 'Do you play music out loud?',
    icon: '🔊',
    options: [
      { value: 'earphones', label: 'I use earphones' },
      { value: 'sometimes-speaker', label: 'Sometimes on speaker' },
      { value: 'loud-music', label: 'I love loud music' },
    ],
  },
  {
    id: 'q14',
    text: "You're more of a...",
    icon: '🤝',
    options: [
      { value: 'social-butterfly', label: 'Social butterfly' },
      { value: 'introverted', label: 'Chill & introverted' },
      { value: 'balanced', label: 'Balanced' },
    ],
  },
  {
    id: 'q15',
    text: 'Do you consume alcohol?',
    icon: '🍷',
    options: [
      { value: 'no', label: 'No' },
      { value: 'occasionally', label: 'Occasionally' },
      { value: 'frequently', label: 'Frequently' },
    ],
  },
  {
    id: 'q16',
    text: 'How do you handle disagreements?',
    icon: '🗣️',
    options: [
      { value: 'talk-directly', label: 'Prefer to talk it out directly' },
      { value: 'text', label: 'Prefer texting it out' },
      { value: 'avoid', label: 'Avoid conflict' },
    ],
  },
  {
    id: 'q17',
    text: 'Are you comfortable sharing things (utensils, snacks, etc.)?',
    icon: '🤝',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'selectively', label: 'Selectively' },
      { value: 'not-at-all', label: 'Not at all' },
    ],
  },
  {
    id: 'q18',
    text: 'How tolerant are you of noise?',
    icon: '🔊',
    options: [
      { value: 'sensitive', label: 'Very sensitive' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'not-bothered', label: 'Not bothered' },
    ],
  },
  {
    id: 'q19',
    text: 'Room aesthetic preference?',
    icon: '🎨',
    options: [
      { value: 'minimal', label: 'Minimal & tidy' },
      { value: 'decorated', label: 'Decorated & colorful' },
      { value: 'functional', label: 'Functional only' },
    ],
  },
  {
    id: 'q20',
    text: 'Comfortable with pets in the room?',
    icon: '🐶',
    options: [
      { value: 'yes', label: 'Yes, love them' },
      { value: 'if-clean', label: 'Okay if clean' },
      { value: 'not-comfortable', label: 'Not comfortable' },
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
      { questionId: 'q1', answer: '7am-9am', isPublic: true },
      { questionId: 'q2', answer: '10pm-midnight', isPublic: true },
      { questionId: 'q3', answer: 'light-background', isPublic: true },
      { questionId: 'q4', answer: 'occasionally', isPublic: true },
      { questionId: 'q5', answer: 'no', isPublic: true },
      { questionId: 'q6', answer: 'clean-regularly', isPublic: false },
      { questionId: 'q8', answer: 'non-vegetarian', isPublic: true },
      { questionId: 'q10', answer: 'low-noise', isPublic: true },
      { questionId: 'q15', answer: 'occasionally', isPublic: false },
      { questionId: 'q17', answer: 'selectively', isPublic: true }
    ],
    dealBreakers: ['smoking', 'loud-music', 'not-into-cleaning'],
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
      { questionId: 'q1', answer: 'before-7am', isPublic: true },
      { questionId: 'q2', answer: 'before-10pm', isPublic: true },
      { questionId: 'q3', answer: 'quiet', isPublic: true },
      { questionId: 'q4', answer: 'no-guests', isPublic: true },
      { questionId: 'q5', answer: 'no', isPublic: true },
      { questionId: 'q6', answer: 'clean-regularly', isPublic: true },
      { questionId: 'q8', answer: 'vegetarian', isPublic: true },
      { questionId: 'q10', answer: 'complete-silence', isPublic: true },
      { questionId: 'q15', answer: 'no', isPublic: true },
      { questionId: 'q17', answer: 'selectively', isPublic: false }
    ],
    dealBreakers: ['smoking', 'alcohol', 'non-vegetarian-cooking'],
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
      { questionId: 'q1', answer: 'after-11am', isPublic: true },
      { questionId: 'q2', answer: 'after-midnight', isPublic: true },
      { questionId: 'q3', answer: 'dont-mind-noise', isPublic: true },
      { questionId: 'q4', answer: 'frequent', isPublic: true },
      { questionId: 'q5', answer: 'outside-only', isPublic: true },
      { questionId: 'q6', answer: 'some-mess', isPublic: false },
      { questionId: 'q8', answer: 'eat-out', isPublic: true },
      { questionId: 'q10', answer: 'sleep-through-anything', isPublic: true },
      { questionId: 'q15', answer: 'occasionally', isPublic: true },
      { questionId: 'q17', answer: 'yes', isPublic: true }
    ],
    dealBreakers: ['early-risers', 'clean-freaks'],
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
      { questionId: 'q1', answer: 'before-7am', isPublic: true },
      { questionId: 'q2', answer: 'before-10pm', isPublic: true },
      { questionId: 'q3', answer: 'quiet', isPublic: false },
      { questionId: 'q4', answer: 'occasionally', isPublic: true },
      { questionId: 'q5', answer: 'no', isPublic: true },
      { questionId: 'q6', answer: 'clean-regularly', isPublic: true },
      { questionId: 'q8', answer: 'vegetarian', isPublic: true },
      { questionId: 'q10', answer: 'complete-silence', isPublic: true },
      { questionId: 'q15', answer: 'no', isPublic: false },
      { questionId: 'q17', answer: 'selectively', isPublic: true }
    ],
    dealBreakers: ['smoking', 'drinking', 'loud-music', 'night-owls'],
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
