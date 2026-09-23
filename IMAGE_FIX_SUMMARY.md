# Image 404 Error - Root Cause & Solution

## Problem Diagnosis

### Root Cause
The FastAPI backend was **missing the static files mount configuration**, meaning the server couldn't serve image files even though they existed on disk.

### What Was Happening
1. **Images existed** in `backend/images/` directory
2. **Database had correct paths** like `/images/products/20260917_090816_kinnam.png`
3. **FastAPI had no route** to serve static files from `/images` URL
4. **Result:** All image requests returned 404 Not Found

### Secondary Issues
1. User Products page used mock/hardcoded data instead of fetching from API
2. Images were in wrong directory structure (`images/` instead of `images/products/`)

## Solution Applied

### 1. Backend Fix (main.py)
Added static files mounting after CORS middleware:

```python
# Mount static files for images
images_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(images_dir, exist_ok=True)
app.mount("/images", StaticFiles(directory=images_dir), name="images")
```

This makes `/images` URLs accessible through the FastAPI server.

### 2. Frontend Fix (UserProducts.jsx)
Changed from mock data to real API:

**Before:**
```javascript
const products = [
  { id: 1, name: 'Santhana Kinnam', image: '/images/products/santhana-kinnam.jpg', ... },
  // ... hardcoded products
];
```

**After:**
```javascript
useEffect(() => {
  const fetchProducts = async () => {
    const response = await productAPI.getAll(true);
    setProducts(response.products || []);
  };
  fetchProducts();
}, []);
```

### 3. Directory Structure Fix
Created proper subdirectory and moved images:

```bash
mkdir -p backend/images/products/
cp backend/images/*.png backend/images/products/
```

## Files Modified

### Local (Development)
- ✅ `backend/main.py` - Added static files mount
- ✅ `frontend/src/pages/user/UserProducts.jsx` - Fetch real products from API
- ✅ `backend/images/products/` - Created directory and copied images

### VPS (Production) - Needs Update
- ⏳ `main.py` - Needs manual edit or file upload
- ⏳ `images/products/` - Needs directory creation
- ⏳ Frontend build - Needs rebuild and deployment
- ⏳ Backend service - Needs restart

## How to Deploy to VPS

### Quick Method (Recommended)
1. Upload updated `main.py` to VPS
2. Run the `fix_images_vps.sh` script
3. Rebuild and deploy frontend

### Step-by-Step Method
See `UPDATE_VPS.md` for detailed instructions.

## Technical Details

### Why StaticFiles Mount Was Missing
The original code imported `StaticFiles`:
```python
from fastapi.staticfiles import StaticFiles
```

But never used it. This is a common oversight when setting up FastAPI projects.

### Image Upload Flow
1. Admin uploads image via `/api/upload/product-image`
2. Backend saves to `images/products/20260917_HHMMSS_filename.png`
3. Returns path: `/images/products/20260917_HHMMSS_filename.png`
4. Path stored in database
5. Frontend requests: `https://srikaruda.shop/images/products/20260917_HHMMSS_filename.png`
6. **Now works!** FastAPI serves from mounted static directory

### URL Structure
- **API Base:** `https://srikaruda.shop/api/`
- **Images:** `https://srikaruda.shop/images/products/`
- **Frontend:** `https://srikaruda.shop/`

Nginx reverse proxy:
- `/api/*` → Backend (localhost:8030)
- `/images/*` → Backend (localhost:8030) via static mount
- `/*` → Frontend (static files)

## Verification Commands

### On VPS
```bash
# Check if images directory exists
ls -la /var/www/karuda/backend/images/products/

# Test image access
curl -I https://srikaruda.shop/images/products/Kinnam.png

# View backend logs
sudo journalctl -u karuda -n 50

# Check service status
sudo systemctl status karuda
```

### In Browser Console
Before fix:
```
GET https://srikaruda.shop/images/products/20260917_090816_kinnam.png 404 (Not Found)
```

After fix:
```
GET https://srikaruda.shop/images/products/20260917_090816_kinnam.png 200 (OK)
```

## Benefits of This Fix

1. ✅ **Images load properly** in both admin and user panels
2. ✅ **No more 404 errors** in browser console
3. ✅ **Real product data** from database instead of mock data
4. ✅ **Proper file organization** with products subdirectory
5. ✅ **Scalable image handling** - new uploads work automatically

## Prevention for Future

### Checklist for Similar Issues
- [ ] Always mount static files when serving assets
- [ ] Verify routes work in production, not just development
- [ ] Test image uploads end-to-end
- [ ] Use real API data instead of mocks in production code
- [ ] Check browser console for 404 errors after deployment

### FastAPI Static Files Template
```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")
```

## Next Steps

1. **Immediate:** Update VPS using `UPDATE_VPS.md` guide
2. **Verify:** Test image loading on production site
3. **Monitor:** Check logs for any errors after deployment
4. **Document:** Update deployment checklist to include static files verification

---

**Status:** ✅ Local fix complete | ⏳ VPS deployment pending

**Created:** September 17, 2026  
**Issue:** Image 404 errors on production  
**Impact:** High - affects user experience and product display  
**Severity:** Fixed (pending deployment)
