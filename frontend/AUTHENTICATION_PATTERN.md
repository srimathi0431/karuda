# Authentication Pattern Guide

## ✅ Correct Way to Get User Data

### In React Components

```javascript
import { useAuth } from '../../context/AuthContext';

const YourComponent = () => {
  const { user } = useAuth(); // Get user object from context
  
  // Access user properties
  const username = user?.username;
  const email = user?.email;
  const name = user?.name;
  
  // Use in API calls
  useEffect(() => {
    if (username) {
      fetchData(username);
    }
  }, [username]);
  
  return (
    <div>
      <p>Welcome, {user?.name || 'Guest'}</p>
    </div>
  );
};
```

## ❌ Wrong Ways (Don't Use)

```javascript
// ❌ WRONG - Returns NULL because username is not stored separately
const username = localStorage.getItem('username');

// ❌ WRONG - Manually parsing localStorage
const user = JSON.parse(localStorage.getItem('user'));
const username = user?.username;
```

## User Object Structure

When logged in, `user` object contains:
```javascript
{
  username: "techney",
  email: "test@gmail.com",
  name: "Techneysoft",
  // ... other user properties
}
```

## AuthContext API

### Available Properties
- `user` - Current user object or null
- `isAuthenticated` - Boolean, true if logged in
- `loading` - Boolean, true during auth operations
- `error` - Error message if any

### Available Methods
- `login(email, password)` - Login user
- `logout()` - Logout user
- `signup(userData)` - Register new user
- `updateUser(updatedData)` - Update user profile

## Example: Protected Page with Auth

```javascript
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Username: @{user.username}</p>
    </div>
  );
};
```

## Example: Conditional Rendering

```javascript
const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Hello, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
};
```

## Working Examples in Codebase

✅ Good examples to follow:
- `frontend/src/pages/user/UserReferrals.jsx`
- `frontend/src/pages/LoginPage.jsx` (uses login method)
- `frontend/src/components/user/UserPanelLayout.jsx`

## Common Pitfalls

### 1. Using username before user loads
```javascript
// ❌ WRONG - username might be undefined
const { user } = useAuth();
fetchData(user.username); // Error if user is null

// ✅ CORRECT - Use optional chaining or check first
const { user } = useAuth();
if (user?.username) {
  fetchData(user.username);
}
```

### 2. Forgetting useEffect dependencies
```javascript
// ❌ WRONG - Missing username dependency
useEffect(() => {
  fetchData(username);
}, []); // Empty deps - won't refetch if username changes

// ✅ CORRECT - Include username in dependencies
useEffect(() => {
  if (username) {
    fetchData(username);
  }
}, [username]);
```

### 3. Not handling loading state
```javascript
// ❌ WRONG - Showing content before auth loads
const { user } = useAuth();
return <div>{user.name}</div>; // Error if user is null

// ✅ CORRECT - Handle loading state
const { user } = useAuth();
if (!user) return <div>Loading...</div>;
return <div>{user.name}</div>;
```

## Remember
🔐 **Always use `useAuth()` hook for authentication**
📦 **User data is stored in context, not localStorage directly**
✅ **Use optional chaining (`user?.username`) to prevent errors**
