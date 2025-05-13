import { ShoppingCart, Coffee, Shirt, Film, Car, Home, Book, Gift, Briefcase, Heart, Zap, MoreHorizontal } from "lucide-react";

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

// Default categories used in the application
export const defaultCategories: Category[] = [
  {
    id: 1,
    name: "Groceries",
    color: "#3B82F6", // blue
    icon: "ShoppingCart",
    description: "Food, beverages, and household supplies"
  },
  {
    id: 2,
    name: "Dining",
    color: "#10B981", // green
    icon: "Restaurant",
    description: "Restaurants, cafes, and food delivery"
  },
  {
    id: 3,
    name: "Clothing",
    color: "#F59E0B", // amber
    icon: "TShirt",
    description: "Apparel, shoes, and accessories"
  },
  {
    id: 4,
    name: "Entertainment",
    color: "#8B5CF6", // purple
    icon: "Film",
    description: "Movies, music, games, and streaming services"
  },
  {
    id: 5,
    name: "Transportation",
    color: "#EC4899", // pink
    icon: "Car",
    description: "Fuel, public transport, ride-sharing, and vehicle maintenance"
  },
  {
    id: 6,
    name: "Housing",
    color: "#6366F1", // indigo
    icon: "Home",
    description: "Rent, mortgage, utilities, and home improvement"
  },
  {
    id: 7,
    name: "Education",
    color: "#14B8A6", // teal
    icon: "Book",
    description: "Tuition, books, and courses"
  },
  {
    id: 8,
    name: "Gifts",
    color: "#F43F5E", // rose
    icon: "Gift",
    description: "Presents, donations, and charitable giving"
  },
  {
    id: 9,
    name: "Business",
    color: "#64748B", // slate
    icon: "Briefcase",
    description: "Work-related expenses and business services"
  },
  {
    id: 10,
    name: "Health",
    color: "#06B6D4", // cyan
    icon: "Heart",
    description: "Medical expenses, pharmacy, and wellness"
  },
  {
    id: 11,
    name: "Utilities",
    color: "#EAB308", // yellow
    icon: "Zap",
    description: "Electricity, water, internet, and phone bills"
  },
  {
    id: 12,
    name: "Other",
    color: "#78716C", // stone
    icon: "MoreHorizontal",
    description: "Miscellaneous expenses"
  }
];

// Helper function to get icon component by name string
export const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "ShoppingCart":
      return ShoppingCart;
    case "Restaurant":
      return Coffee;
    case "TShirt":
      return Shirt;
    case "Film":
      return Film;
    case "Car":
      return Car;
    case "Home":
      return Home;
    case "Book":
      return Book;
    case "Gift":
      return Gift;
    case "Briefcase":
      return Briefcase;
    case "Heart":
      return Heart;
    case "Zap":
      return Zap;
    case "MoreHorizontal":
      return MoreHorizontal;
    default:
      return ShoppingCart;
  }
};

// Helper function to get color based on category name
export const getCategoryColor = (categoryName: string): string => {
  const category = defaultCategories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  return category?.color || "#78716C"; // default to gray if not found
};

// Helper function to get category by ID
export const getCategoryById = (id: number): Category | undefined => {
  return defaultCategories.find((cat) => cat.id === id);
};

// Helper function to get category by name
export const getCategoryByName = (name: string): Category | undefined => {
  return defaultCategories.find(
    (cat) => cat.name.toLowerCase() === name.toLowerCase()
  );
};

// Function to format currency values
export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

// Function to get month name from month number
export const getMonthName = (monthNum: number): string => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[monthNum - 1] || "Unknown";
};
