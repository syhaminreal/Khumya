// Mock data for static UI - based on backend schema

import { Category, User, Vendor } from "./index";
// Sample categories with questions for vendors
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    title: "Photography",
    parentId: undefined,
    question: [
      { question: "What type of photography do you specialize in?" },
      { question: "How many years of experience do you have?" },
      { question: "What equipment do you use?" },
      { question: "Do you provide edited photos?" },
      { question: "What is your turnaround time for delivering photos?" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Catering",
    parentId: undefined,
    question: [
      { question: "What cuisines do you specialize in?" },
      { question: "Can you accommodate dietary restrictions?" },
      { question: "What is your minimum guest count?" },
      { question: "Do you provide serving staff?" },
      { question: "Do you handle setup and cleanup?" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Decoration",
    parentId: undefined,
    question: [
      { question: "What decoration styles do you offer?" },
      { question: "Do you provide flowers and floral arrangements?" },
      { question: "Can you work with custom themes?" },
      { question: "Do you handle setup and teardown?" },
      { question: "What is your lead time requirement?" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Venue",
    parentId: undefined,
    question: [
      { question: "What is the maximum capacity of your venue?" },
      { question: "Is parking available?" },
      { question: "Do you allow outside catering?" },
      { question: "What amenities are included?" },
      { question: "Are there any noise or time restrictions?" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Music & Entertainment",
    parentId: undefined,
    question: [
      { question: "What type of entertainment do you provide?" },
      { question: "Do you bring your own equipment?" },
      { question: "How long is a typical performance?" },
      { question: "Do you take song requests?" },
      { question: "What is your setup time requirement?" },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Event Planning",
    parentId: undefined,
    question: [
      { question: "What types of events do you specialize in?" },
      { question: "Do you offer day-of coordination?" },
      { question: "How many events have you planned?" },
      { question: "Do you have a network of preferred vendors?" },
      { question: "What is your planning process?" },
    ],
    createdAt: new Date().toISOString(),
  },
];

// Sample user data
export const MOCK_USER: User = {
  id: 1,
  email: "john@example.com",
  name: "John Doe",
  role: "client",
  createdAt: new Date().toISOString(),
};

// Sample vendor data
export const MOCK_VENDOR: Vendor = {
  id: 1,
  vendorName: "Premium Photography Studio",
  description: "Professional photography services for all your special moments",
  owner: 1,
  city: "Kathmandu",
  nation: "Nepal",
  culture: "Nepali",
  theme: "Modern & Traditional",
  space: "Studio & On-location",
  infos: {
    question: [
      {
        question: "What type of photography do you specialize in?",
        answer: "Wedding, Portrait, Event",
      },
      {
        question: "How many years of experience do you have?",
        answer: "8+ years",
      },
    ],
  },
  createdAt: new Date().toISOString(),
};

// Nations list for dropdown
export const NATIONS = [
  "Nepal",
  "India",
  "Bangladesh",
  "Pakistan",
  "Sri Lanka",
  "Bhutan",
  "Other",
];

// Cities in Nepal
export const CITIES = [
  "Kathmandu",
  "Pokhara",
  "Lalitpur",
  "Bhaktapur",
  "Biratnagar",
  "Birgunj",
  "Dharan",
  "Butwal",
  "Hetauda",
  "Other",
];

// Culture options
export const CULTURES = [
  "Nepali",
  "Newari",
  "Tharu",
  "Maithili",
  "Tamang",
  "Gurung",
  "Sherpa",
  "Mixed/Fusion",
  "Other",
];

// Theme options
export const THEMES = [
  "Traditional",
  "Modern",
  "Rustic",
  "Vintage",
  "Bohemian",
  "Minimalist",
  "Luxury",
  "Cultural",
  "Fusion",
];
