# Karuda User Panel - Complete Implementation Guide

## 🎯 Overview

This document provides complete implementation for extending your existing Karuda e-commerce website with a comprehensive **User Panel** featuring 11 sections including referrals, team management, bonuses, rewards, and more.

---

## ✅ What Has Been Created

### 1. Core Components (COMPLETED)
- ✅ `UserPanelContext.jsx` - State management for all user panel data
- ✅ `UserPanelLayout.jsx` - Sidebar navigation and responsive layout
- ✅ `UserPagination.jsx` - Reusable pagination component (10 rows per page)

### 2. Data Structure (COMPLETED)
Mock data structures for:
- Referrals (23 records)
- Team Members (31 records)
- Matching Bonus (27 records)
- Rewards (19 records)
- Transactions (42 records)
- P2P Records (18 records)
- Wallet Balance

---

## 📋 Implementation Steps

### Step 1: Update App.jsx

Add UserPanelProvider and new routes:

```jsx
import { UserPanelProvider } from './context/UserPanelContext';
import UserPanelLayout from './components/user/UserPanelLayout';

// Import user panel pages (create these)
import UserDashboard from './pages/user/UserDashboard';
import UserReferrals from './pages/user/UserReferrals';
import UserTeam from './pages/user/UserTeam';
import UserMatchingBonus from './pages/user/UserMatchingBonus';
import UserRewards from './pages/user/UserRewards';
import UserProducts from './pages/user/UserProducts';
import UserOrders from './pages/user/UserOrders';
import UserTransactions from './pages/user/UserTransactions';
import UserP2P from './pages/user/UserP2P';
import UserProfile from './pages/user/UserProfile';

// In App component, wrap with UserPanelProvider:
<AuthProvider>
  <ShopProvider>
    <AdminProvider>
      <UserPanelProvider>
        {/* existing router code */}
      </UserPanelProvider>
    </AdminProvider>
  </ShopProvider>
</AuthProvider>

// Add new routes:
<Route path="/user/dashboard" element={<UserDashboard />} />
<Route path="/user/referrals" element={<UserReferrals />} />
<Route path="/user/team" element={<UserTeam />} />
<Route path="/user/matching-bonus" element={<UserMatchingBonus />} />
<Route path="/user/rewards" element={<UserRewards />} />
<Route path="/user/products" element={<UserProducts />} />
<Route path="/user/orders" element={<UserOrders />} />
<Route path="/user/transactions" element={<UserTransactions />} />
<Route path="/user/p2p" element={<UserP2P />} />
<Route path="/user/profile" element={<UserProfile />} />
```

###Step 2: Protect User Routes

Create `ProtectedUserRoute.jsx`:

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedUserRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
```

Wrap each user route:
```jsx
<Route 
  path="/user/dashboard" 
  element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} 
/>
```

### Step 3: Update AccountPage.jsx

Add link to new User Dashboard in the existing account page:

```jsx
<Link 
  to="/user/dashboard"
  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-medium text-sm transition-colors hover:shadow-lg"
>
  <LayoutDashboard className="w-5 h-5" />
  Go to User Dashboard
</Link>
```

---

## 🔨 Creating User Panel Pages

All pages should follow this structure and be created in `src/pages/user/` directory:

### Common Pattern for All Pages:

```jsx
import { useState, useMemo } from 'react';
import { useUserPanel } from '../../context/UserPanelContext';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import UserPagination from '../../components/user/UserPagination';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function PageName() {
  const { data } = useUserPanel();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    // Add search logic
    return data.filter(/* search logic */);
  }, [data, searchQuery]);
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <UserPanelLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
            Page Title
          </h1>
          <p className="text-gray-600 mt-1">Description</p>
        </div>
        
        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table structure */}
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <UserPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </UserPanelLayout>
  );
}
```

---

## 📊 Detailed Page Requirements

### 1. User Dashboard (`UserDashboard.jsx`)
**Stats Cards:**
- Total Referrals
- Active Referrals  
- Total Team
- Active Team Members
- Total Matching Bonus
- Total Rewards
- Total Orders
- Wallet Balance
- Pending Bonus
- Pending Transactions

**Use existing card design from homepage/admin dashboard**

### 2. My Referral (`UserReferrals.jsx`)
**Table Columns:**
- User ID
- Name
- Email
- Mobile
- Joining Date
- Status (Active/Inactive badge)
- Level
- Actions (View button)

**Features:**
- Search by name, email, user ID
- 10 rows per page pagination
- Status color badges

### 3. My Team (`UserTeam.jsx`)
**Table Columns:**
- Member ID
- Name
- Email
- Mobile
- Level
- Joining Date
- Total Sales
- Status
- Actions

**Features:**
- Search functionality
- 10 rows per page
- Level badges
- Sales display

### 4. Matching Bonus (`UserMatchingBonus.jsx`)
**Table Columns:**
- Transaction ID
- Date
- Left Points
- Right Points
- Matching Pairs
- Bonus Amount
- Status (Credited/Pending/Processing)
- Actions

**Features:**
- Search by transaction ID
- Status filters
- 10 rows per page
- Amount formatting (₹)

### 5. Reward & Records (`UserRewards.jsx`)
**Table Columns:**
- Reward ID
- Reward Name
- Achievement
- Date
- Amount
- Status
- Details
- Actions

**Features:**
- Search by reward name
- Status filters
- 10 rows per page

### 6. Products (`UserProducts.jsx`)
**Product Cards:**
Reuse existing product components from ShopPage
- Product image
- Product name
- Price
- View button

**Features:**
- Grid layout (responsive)
- Filter by category
- Use existing products from products.js

### 7. Order (`UserOrders.jsx`)
**Table Columns:**
- Order ID
- Product
- Quantity
- Amount
- Order Date
- Payment Status
- Order Status
- Actions (Track, View)

**Features:**
- Search by order ID
- Status filters
- 10 rows per page
- Show only current user's orders

### 8. Transaction History (`UserTransactions.jsx`)
**Table Columns:**
- Transaction ID
- Date
- Type (Credit/Debit/Refund/Bonus)
- Amount
- Status
- Description
- Actions

**Features:**
- Search by transaction ID
- Type filter
- Status filter
- 10 rows per page
- Credit/Debit color coding

### 9. P2P (`UserP2P.jsx`)
**Table Columns:**
- P2P ID
- Date
- Type (Sent/Received/Requested)
- Counterparty
- Amount
- Status
- Notes
- Actions

**Features:**
- Search functionality
- Type filter
- Status filter
- 10 rows per page

### 10. Profile (`UserProfile.jsx`)
**Sections:**

**Profile Information:**
- Profile photo display
- Photo upload button
- Name (editable)
- Email (display only from auth)
- Mobile (editable)

**Change Password:**
- Current password field
- New password field
- Confirm password field
- Update button

**Use existing AccountPage profile section as reference**

---

## 🎨 Design Guidelines

### Colors (Use Existing)
```css
Primary: from-primary-600 to-accent-600
Success: bg-green-100 text-green-800
Warning: bg-yellow-100 text-yellow-800
Error: bg-red-100 text-red-800
Info: bg-blue-100 text-blue-800
```

### Status Badges
```jsx
<span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
  status === 'Active' ? 'bg-green-100 text-green-800' :
  status === 'Inactive' ? 'bg-red-100 text-red-800' :
  'bg-gray-100 text-gray-800'
}`}>
  {status}
</span>
```

### Table Structure
```jsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Column Name
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {currentData.map((item) => (
        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {item.value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## 📱 Responsive Requirements

### Mobile (<768px)
- Sidebar becomes overlay drawer
- Tables scroll horizontally **inside container**
- Normal vertical page scroll
- Touch-friendly buttons (min 44x44px)
- Cards stack vertically
- Single column layout

### Tablet (768px-1023px)
- Collapsible sidebar
- 2-column grids
- Tables remain functional

### Desktop (>=1024px)
- Persistent sidebar
- Multi-column grids
- Full table view

### Critical CSS
```css
/* Ensure page scrolls normally */
body {
  overflow-y: auto;
}

/* Table horizontal scroll only */
.table-container {
  overflow-x: auto;
  overflow-y: visible;
}
```

---

## 🔒 Security

**Always use authenticated user data:**

```jsx
const { user, isAuthenticated } = useAuth();
const { currentUserId, referrals } = useUserPanel();

// Filter data for current user only
const userOrders = orders.filter(o => o.userId === currentUserId);
```

**Never expose:**
- Other users' data
- Hardcoded user IDs
- Sensitive information in frontend

---

## 🔄 Data Flow

```
User Login (AuthContext)
       ↓
User ID Generated
       ↓
UserPanelContext Loads User-Specific Data
       ↓
Pages Display Current User's Data
       ↓
Actions Update LocalStorage
```

**For Production:**
Replace localStorage with API calls:
```jsx
// Instead of:
const [referrals, setReferrals] = useState(localStorage.getItem(...));

// Use:
const [referrals, setReferrals] = useState([]);
useEffect(() => {
  fetch(`/api/users/${currentUserId}/referrals`)
    .then(res => res.json())
    .then(data => setReferrals(data));
}, [currentUserId]);
```

---

## ✅ Testing Checklist

- [ ] Build succeeds
- [ ] Login works
- [ ] User dashboard displays stats
- [ ] All 11 pages accessible via sidebar
- [ ] Each table shows exactly 10 rows per page
- [ ] Pagination works correctly
- [ ] Search functionality works
- [ ] Mobile sidebar opens/closes
- [ ] Tables scroll horizontally on mobile
- [ ] Page scrolls vertically normally
- [ ] Responsive on all devices
- [ ] Protected routes redirect to login
- [ ] Logout works

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Access user panel
# 1. Login at: http://localhost:5173/login
# 2. Navigate to: http://localhost:5173/user/dashboard
```

---

## 📞 Implementation Support

### File Structure
```
src/
├── context/
│   ├── AuthContext.jsx (existing)
│   ├── ShopContext.jsx (existing)
│   ├── AdminContext.jsx (existing)
│   └── UserPanelContext.jsx (NEW)
├── components/
│   ├── user/
│   │   ├── UserPanelLayout.jsx (NEW)
│   │   └── UserPagination.jsx (NEW)
│   └── ProtectedUserRoute.jsx (NEW)
└── pages/
    └── user/
        ├── UserDashboard.jsx (CREATE)
        ├── UserReferrals.jsx (CREATE)
        ├── UserTeam.jsx (CREATE)
        ├── UserMatchingBonus.jsx (CREATE)
        ├── UserRewards.jsx (CREATE)
        ├── UserProducts.jsx (CREATE)
        ├── UserOrders.jsx (CREATE)
        ├── UserTransactions.jsx (CREATE)
        ├── UserP2P.jsx (CREATE)
        └── UserProfile.jsx (CREATE)
```

---

## 🎯 Next Steps

1. Create `ProtectedUserRoute.jsx`
2. Update `App.jsx` with UserPanelProvider and routes
3. Create all 10 user panel page files
4. Test each page individually
5. Test pagination on all tables
6. Test mobile responsiveness
7. Connect to real backend API

---

## 📝 Notes

- All mock data is user-specific (based on user email)
- Data persists in localStorage per user
- Ready for backend integration
- Follows existing design system
- Mobile-first responsive
- 10 rows per page on all tables
- Reuses existing components where possible

---

**Implementation Status: Core Structure Complete**  
**Remaining: Create 10 user panel page files following the patterns above**

This comprehensive user panel seamlessly extends your existing Karuda e-commerce website with MLM/referral features while maintaining design consistency!
