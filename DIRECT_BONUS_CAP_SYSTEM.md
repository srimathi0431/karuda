# Direct Referral Bonus Cap System

## 🎯 **New Rule: Maximum 2 Direct Bonuses Per User**

Starting now, each user can earn direct referral bonus (10%) for **ONLY their FIRST 2 DIRECT referrals**.

---

## 📋 **How It Works**

### Scenario Examples

#### Example 1: User with 0 referrals
```
User "techney" refers:
1. User A purchases ₹6,000 package → techney earns ₹600 ✅ (1/2)
2. User B purchases ₹6,000 package → techney earns ₹600 ✅ (2/2)
3. User C purchases ₹6,000 package → techney earns ₹0   ❌ (CAPPED)
4. User D purchases ₹6,000 package → techney earns ₹0   ❌ (CAPPED)

Total direct bonus: ₹1,200 (from first 2 only)
```

#### Example 2: User with 1 referral
```
User "john" already has 1 direct bonus.
John refers:
1. User E purchases ₹6,000 → john earns ₹600 ✅ (2/2 - Last slot!)
2. User F purchases ₹6,000 → john earns ₹0   ❌ (CAPPED)

Total: ₹600 (only 1 more slot was available)
```

#### Example 3: User with 2+ referrals (Capped)
```
User "alice" already has 2 direct bonuses.
Alice refers:
1. User G purchases ₹6,000 → alice earns ₹0 ❌ (ALREADY CAPPED)
2. User H purchases ₹6,000 → alice earns ₹0 ❌ (ALREADY CAPPED)

Total: ₹0 (cap reached, no more bonuses)
```

---

## 💡 **Important Notes**

### ✅ What Users STILL Get:
1. **Matching Bonus** - Still active! No cap on matching bonuses
2. **Team Building** - Referrals still count for binary tree
3. **Achievements** - Referrals count toward milestones (10, 25, 50, 100)
4. **Volume Growth** - Package value adds to team volume

### ❌ What Changes:
- **Direct 10% Bonus** - Capped at first 2 referrals only
- After 2 bonuses → No more direct bonus payments
- Cap is PERMANENT (not monthly reset)

---

## 🔧 **Backend Changes Made**

### 1. Updated Function: `process_direct_bonus()`
**File:** `backend/mlm_crud.py`

**Logic:**
```python
# Before processing bonus, check count
bonus_count = count_existing_bonuses(referrer)

if bonus_count >= 2:
    return {
        "success": False,
        "capped": True,
        "message": "Direct bonus cap reached (2/2 used)"
    }

# Otherwise process bonus normally
```

### 2. New Function: `get_direct_bonus_status()`
**File:** `backend/mlm_crud.py`

Returns status for any user:
```python
{
    "bonuses_received": 1,
    "max_bonuses": 2,
    "remaining_slots": 1,
    "is_capped": False,
    "status": "1 slots remaining"
}
```

### 3. New API Endpoint
**Endpoint:** `GET /api/bonus/direct/{username}/status`

**Response:**
```json
{
    "success": true,
    "status": {
        "username": "techney",
        "bonuses_received": 1,
        "max_bonuses": 2,
        "remaining_slots": 1,
        "is_capped": false,
        "status": "1 slots remaining"
    }
}
```

---

## 📊 **UI Changes Needed (Frontend)**

### Income Report Page
Show direct bonus status:
```
Direct Bonus Status: 1/2 slots used
Remaining: 1 more referral eligible for 10% bonus
```

### Referral Page
Add warning when approaching cap:
```
⚠️ Direct Bonus Alert
You have 1 slot remaining. Only your next direct referral will earn 10% bonus.
After that, you'll still earn from matching bonuses and team growth!
```

### Package Approval (Admin)
When admin approves package, system checks:
- Count referrer's existing bonuses
- If < 2 → Credit 10% bonus ✅
- If >= 2 → Skip bonus ❌ (log message)

---

## 🧪 **Testing the Cap**

### Test Case 1: First 2 Referrals
```bash
# User techney (0 bonuses) refers user1
POST /api/packages/approve
{
    "username": "user1",
    "referrer": "techney"
}
# Expected: techney gets ₹600 (1/2)

# User techney refers user2
POST /api/packages/approve
{
    "username": "user2",
    "referrer": "techney"
}
# Expected: techney gets ₹600 (2/2)
```

### Test Case 2: Third Referral (Capped)
```bash
# User techney (2 bonuses) refers user3
POST /api/packages/approve
{
    "username": "user3",
    "referrer": "techney"
}
# Expected: techney gets ₹0 (capped)
# Response should show: "bonus_capped": true
```

### Test Case 3: Check Status
```bash
# Check techney's status
GET /api/bonus/direct/techney/status

# Expected Response:
{
    "success": true,
    "status": {
        "bonuses_received": 2,
        "max_bonuses": 2,
        "remaining_slots": 0,
        "is_capped": true,
        "status": "Capped"
    }
}
```

---

## 📈 **Database Query to Check Current Status**

Check all users' direct bonus counts:
```sql
SELECT 
    referrer_username,
    COUNT(*) as bonuses_received,
    SUM(bonus_amount) as total_earned,
    CASE 
        WHEN COUNT(*) >= 2 THEN 'CAPPED'
        ELSE CONCAT(2 - COUNT(*), ' slots left')
    END as status
FROM direct_bonuses
GROUP BY referrer_username
ORDER BY bonuses_received DESC;
```

Check specific user:
```sql
SELECT 
    COUNT(*) as bonuses_received,
    2 - COUNT(*) as remaining_slots,
    COUNT(*) >= 2 as is_capped
FROM direct_bonuses
WHERE referrer_username = 'techney';
```

---

## 🚀 **Deployment Steps**

1. **Update Backend Files:**
   ```bash
   # Upload updated files
   scp backend/mlm_crud.py root@103.94.165.98:/root/karudaa/backend/
   scp backend/main.py root@103.94.165.98:/root/karudaa/backend/
   ```

2. **Restart Backend:**
   ```bash
   ssh root@103.94.165.98
   cd /root/karudaa/backend
   pm2 restart karudaa-backend
   ```

3. **Verify API:**
   ```bash
   # Test new endpoint
   curl https://srikaruda.shop/api/bonus/direct/techney/status
   ```

4. **Update Frontend** (optional):
   - Add status display on referral page
   - Show warning when 1 slot left
   - Show "capped" message when 2/2 used

---

## 📝 **Summary**

✅ **Implemented:**
- Direct bonus cap at 2 referrals
- Status checking function
- API endpoint for status
- Automatic rejection when capped

✅ **Benefits:**
- Prevents unlimited direct bonus payouts
- Encourages team building (matching bonus still unlimited)
- Fair distribution of bonuses

✅ **User Impact:**
- First 2 referrals: ₹600 + ₹600 = ₹1,200 maximum direct bonus
- 3rd+ referrals: Still valuable (team volume, matching, achievements)
- Matching bonus continues forever!

---

## 💰 **Earnings Breakdown Example**

**User with 5 direct referrals:**

| Referral | Package | Direct Bonus (10%) | Matching Bonus | Total |
|----------|---------|-------------------|----------------|-------|
| 1st      | ₹6,000  | ₹600 ✅           | Varies         | ₹600+ |
| 2nd      | ₹6,000  | ₹600 ✅           | Varies         | ₹600+ |
| 3rd      | ₹6,000  | ₹0 ❌ (Capped)    | Varies         | ₹0+   |
| 4th      | ₹6,000  | ₹0 ❌ (Capped)    | Varies         | ₹0+   |
| 5th      | ₹6,000  | ₹0 ❌ (Capped)    | Varies         | ₹0+   |

**Direct Bonus Total:** ₹1,200 (capped at 2)  
**Matching Bonus Total:** Unlimited! (depends on team balance)  
**Achievement Bonuses:** Milestone rewards still active!

The cap encourages users to focus on **team building** and **balance**, not just direct recruitment! 🎯
