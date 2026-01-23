# Khumya - Event Management System 🎉

A modern, minimal mobile application for connecting event organizers with vendors. Built with React Native and Expo.

## 📱 Overview

Khumya is a comprehensive event management platform that allows:

- **Users/Clients**: Browse, search, and connect with event vendors
- **Vendors**: Register their services, showcase portfolios, and manage bookings

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm or npm
- Expo CLI
- iOS Simulator / Android Emulator / Expo Go app

### Installation

```bash
# Clone the repository
git clone https://github.com/syhaminreal/Khumya.git

# Navigate to project directory
cd Khumya

# Install dependencies
pnpm install
# or
npm install

# Start the development server
npx expo start
```

### Running the App

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your device

---

## 📁 Project Structure

```
Khumya/
├── app/                          # Main application (file-based routing)
│   ├── _layout.tsx               # Root layout with providers
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home screen
│   │   ├── explore.tsx           # Vendor exploration/search
│   │   └── profile.tsx           # User/Vendor profile
│   ├── auth/                     # Authentication screens
│   │   ├── _layout.tsx           # Auth stack layout
│   │   ├── user-login.tsx        # User login
│   │   ├── user-signup.tsx       # User registration
│   │   ├── vendor-login.tsx      # Vendor login
│   │   └── vendor-signup.tsx     # Multi-step vendor registration
│   ├── components/               # Reusable components
│   │   ├── ui/                   # UI primitives
│   │   │   ├── Button.tsx        # Button variants
│   │   │   ├── Input.tsx         # Form input with validation
│   │   │   ├── Select.tsx        # Dropdown selector
│   │   │   ├── Card.tsx          # Card container
│   │   │   ├── StepIndicator.tsx # Progress stepper
│   │   │   └── index.ts          # Exports
│   │   ├── about/
│   │   ├── footer/
│   │   ├── navBar/
│   │   └── slider/
│   └── login/                    # Legacy redirects
├── constants/
│   └── theme.ts                  # Design system (colors, typography, spacing)
├── context/
│   └── AuthContext.tsx           # Global authentication state
├── types/
│   ├── index.ts                  # TypeScript interfaces
│   └── mockData.ts               # Static mock data
├── assets/                       # Images, fonts, etc.
└── data/                         # Static data files
```

---

## 🔄 Application Flow

### Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      Root Layout                             │
│                  (AuthProvider wrapper)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐     ┌──────────────────────────────┐  │
│  │   (tabs)         │     │          auth/               │  │
│  │                  │     │                              │  │
│  │  ┌────────────┐  │     │  ┌────────────────────────┐  │  │
│  │  │   Home     │  │     │  │    user-login          │  │  │
│  │  └────────────┘  │     │  └────────────────────────┘  │  │
│  │  ┌────────────┐  │     │  ┌────────────────────────┐  │  │
│  │  │  Explore   │  │ ──► │  │    user-signup         │  │  │
│  │  └────────────┘  │     │  └────────────────────────┘  │  │
│  │  ┌────────────┐  │     │  ┌────────────────────────┐  │  │
│  │  │  Profile   │  │     │  │    vendor-login        │  │  │
│  │  └────────────┘  │     │  └────────────────────────┘  │  │
│  │                  │     │  ┌────────────────────────┐  │  │
│  └──────────────────┘     │  │  vendor-signup (5-step)│  │  │
│                           │  └────────────────────────┘  │  │
│                           └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### User Authentication Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Home      │ ──► │  Login Page  │ ──► │  Enter Email/   │
│  (Guest)    │     │              │     │  Password       │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                                   ▼
                    ┌──────────────────────────────────────┐
                    │         API Call (Mock)              │
                    │    login(email, password, false)     │
                    └──────────────────┬───────────────────┘
                                       │
                    ┌──────────────────┴───────────────────┐
                    │                                      │
                    ▼                                      ▼
           ┌───────────────┐                    ┌───────────────┐
           │   Success     │                    │   Failure     │
           │   Redirect    │                    │   Show Error  │
           │   to Home     │                    │               │
           └───────────────┘                    └───────────────┘
```

### Vendor Registration Flow (5 Steps)

```
Step 1: Account           Step 2: Business         Step 3: Location
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ • Full Name      │     │ • Business Name  │     │ • Country        │
│ • Email          │ ──► │ • Description    │ ──► │ • City           │
│ • Password       │     │ • Space/Capacity │     │ • Culture        │
│ • Confirm Pass   │     │                  │     │ • Theme          │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                                           │
                                                           ▼
Step 5: Complete          Step 4: Category
┌──────────────────┐     ┌──────────────────────────────────────────┐
│                  │     │ • Select Category (Photography, Catering,│
│  ✓ Review        │ ◄── │   Decoration, Venue, Music, etc.)        │
│    Summary       │     │                                          │
│                  │     │ • Answer Category-Specific Questions     │
│  [Complete]      │     │   (Dynamic based on selection)           │
└──────────────────┘     └──────────────────────────────────────────┘
```

---

## 📊 Data Schema (Backend Compatible)

### User Schema

```typescript
interface User {
  id: number;
  email: string; // unique
  name: string;
  password?: string; // hashed, not returned
  info?: object; // additional metadata
  role: "client" | "vendor";
  createdAt?: string;
  updatedAt?: string;
}
```

### Vendor Schema

```typescript
interface Vendor {
  id: number;
  vendorName: string;
  description: string;
  owner: number; // references user.id
  city: string;
  nation: string;
  culture?: string;
  theme?: string;
  space?: string;
  infos?: {
    // category-specific Q&A
    question: Array<{
      question: string;
      answer: string;
    }>;
  };
  createdAt?: string;
  updatedAt?: string;
}
```

### Category Schema

```typescript
interface Category {
  id: number;
  parentId?: number; // for nested categories
  title: string;
  question: Array<{
    // questions for vendors
    question: string;
  }>;
  infos?: object;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🎨 Design System

### Colors

| Name      | Value     | Usage                       |
| --------- | --------- | --------------------------- |
| Primary   | `#6366F1` | Main brand color, CTAs      |
| Secondary | `#EC4899` | Vendor-related actions      |
| Success   | `#10B981` | Confirmations, completed    |
| Warning   | `#F59E0B` | Alerts, ratings             |
| Error     | `#EF4444` | Errors, destructive actions |

### Typography

- **Headings**: Bold, 24-36px
- **Body**: Regular, 14-16px
- **Caption**: Medium, 12px

### Spacing Scale

```
xs: 4px  |  sm: 8px  |  md: 12px  |  base: 16px
lg: 20px |  xl: 24px |  2xl: 32px |  3xl: 40px
```

---

## 🔌 API Integration Guide

The app is designed to be **API-ready**. To integrate with your backend:

### 1. Update AuthContext

```typescript
// context/AuthContext.tsx

const login = async (email: string, password: string, asVendor: boolean) => {
  setState((prev) => ({ ...prev, loading: true }));

  try {
    // Replace with actual API call
    const response = await fetch("YOUR_API_URL/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role: asVendor ? "vendor" : "client",
      }),
    });

    const data = await response.json();

    if (data.success) {
      setState({
        user: data.user,
        vendor: data.vendor,
        isAuthenticated: true,
        isVendor: asVendor,
        loading: false,
      });
      return true;
    }
  } catch (error) {
    console.error("Login failed:", error);
  }

  setState((prev) => ({ ...prev, loading: false }));
  return false;
};
```

### 2. API Endpoints Expected

| Endpoint            | Method | Description                 |
| ------------------- | ------ | --------------------------- |
| `/auth/login`       | POST   | User/Vendor login           |
| `/auth/signup`      | POST   | User registration           |
| `/vendors/register` | POST   | Vendor profile creation     |
| `/categories`       | GET    | List all categories         |
| `/categories/:id`   | GET    | Category with questions     |
| `/vendors`          | GET    | List vendors (with filters) |
| `/vendors/:id`      | GET    | Vendor details              |

---

## 📱 Key Features

### For Users

- ✅ Browse vendor categories
- ✅ Search and filter vendors
- ✅ View vendor profiles
- ✅ User authentication
- 🔜 Booking system (coming soon)
- 🔜 Reviews & ratings (coming soon)

### For Vendors

- ✅ Multi-step registration
- ✅ Category-specific questions
- ✅ Profile management
- 🔜 Booking management (coming soon)
- 🔜 Analytics dashboard (coming soon)

---

## 🛠 Development

### Available Scripts

```bash
# Start development server
pnpm start

# Start with cache cleared
npx expo start --clear

# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Run on web
pnpm web

# Lint code
pnpm lint

# Reset project
pnpm reset-project
```

### Adding New Screens

1. Create file in `app/` directory (file-based routing)
2. Export default React component
3. Add to navigation if needed

### Adding New Components

1. Create in `app/components/ui/`
2. Export from `app/components/ui/index.ts`
3. Follow existing component patterns

---

## 📚 Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based)
- **State Management**: React Context
- **Styling**: StyleSheet (inline styles)
- **Icons**: @expo/vector-icons (FontAwesome)
- **Language**: TypeScript

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the event management community
