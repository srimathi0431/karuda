# VPS Update Guide - Fix Image 404 Errors

This guide will help you fix the image 404 errors on your production server.

## What Changed?

1. **Backend `main.py`**: Added static files mounting for `/images` directory
2. **Frontend `UserProducts.jsx`**: Updated to fetch real products from API instead of mock data
3. **Image structure**: Created `images/products/` subdirectory for proper organization

## Quick Update Steps

### Step 1: Update Backend on VPS

SSH into your VPS and run:

```bash
# Navigate to backend directory
cd /var/www/karuda/backend

# Backup current main.py
cp main.py main.py.backup

# Edit main.py
sudo nano main.py
```

Find this section (around line 13-22):
```python
# Create FastAPI app
app = FastAPI(title="Karuda API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Replace with:
```python
# Create FastAPI app
app = FastAPI(title="Karuda API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for images
images_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(images_dir, exist_ok=True)
app.mount("/images", StaticFiles(directory=images_dir), name="images")
```

Save the file (Ctrl+X, Y, Enter).

### Step 2: Setup Image Directories

```bash
# Create products subdirectory
mkdir -p /var/www/karuda/backend/images/products

# Copy existing images to products folder
cp /var/www/karuda/backend/images/*.png /var/www/karuda/backend/images/products/ 2>/dev/null || true

# Set proper permissions
sudo chown -R www-data:www-data /var/www/karuda/backend/images
sudo chmod -R 755 /var/www/karuda/backend/images
```

### Step 3: Restart Backend Service

```bash
# Restart the service
sudo systemctl restart karuda

# Check if it's running properly
sudo systemctl status karuda

# View logs to check for errors
sudo journalctl -u karuda -n 50
```

### Step 4: Update Frontend

From your local machine, build and deploy the updated frontend:

```bash
# Navigate to frontend directory
cd "c:\Techneysoft apps\karudaa\frontend"

# Build the frontend
npm run build

# Upload to VPS (replace YOUR_VPS_IP with your actual IP)
scp -r dist/* root@YOUR_VPS_IP:/var/www/karuda/frontend/dist/
```

OR manually build and upload via FTP/SCP.

### Step 5: Verify Everything Works

```bash
# Test if images are accessible
curl -I https://srikaruda.shop/images/products/Kinnam.png

# Should return: HTTP/2 200
```

Open your browser and check:
- Admin Products Page: https://srikaruda.shop/admin/products
- User Products Page: https://srikaruda.shop/user/products

## Alternative: Upload Updated Files via SCP

If you prefer to upload files from Windows:

### Upload Backend main.py:
```bash
scp "c:\Techneysoft apps\karudaa\backend\main.py" root@YOUR_VPS_IP:/var/www/karuda/backend/main.py
```

### Upload Frontend build:
```bash
cd "c:\Techneysoft apps\karudaa\frontend"
npm run build
scp -r dist/* root@YOUR_VPS_IP:/var/www/karuda/frontend/dist/
```

Then restart the backend service on VPS:
```bash
sudo systemctl restart karuda
```

## Troubleshooting

### Images still showing 404?

1. **Check if images exist:**
   ```bash
   ls -la /var/www/karuda/backend/images/products/
   ```

2. **Check permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/karuda/backend/images
   sudo chmod -R 755 /var/www/karuda/backend/images
   ```

3. **Check backend logs:**
   ```bash
   sudo journalctl -u karuda -f
   ```

4. **Test direct access:**
   ```bash
   curl https://srikaruda.shop/images/products/Kinnam.png
   ```

### Service won't start?

1. **Check for Python syntax errors:**
   ```bash
   cd /var/www/karuda/backend
   source venv/bin/activate
   python -m py_compile main.py
   ```

2. **View detailed error logs:**
   ```bash
   sudo journalctl -u karuda -n 100 --no-pager
   ```

3. **Restore backup if needed:**
   ```bash
   cp main.py.backup main.py
   sudo systemctl restart karuda
   ```

## Summary of Changes

### Backend (`main.py`)
- ✅ Added static files mount: `app.mount("/images", StaticFiles(directory=images_dir), name="images")`
- ✅ This makes `/images` URLs accessible via the API server

### Frontend (`UserProducts.jsx`)
- ✅ Changed from mock data to real API calls using `productAPI.getAll()`
- ✅ Updated image URLs to use `https://srikaruda.shop${product.image_path}`
- ✅ Added loading and error states

### File Structure
```
/var/www/karuda/backend/
├── images/
│   ├── products/
│   │   ├── Kinnam.png
│   │   ├── Lic.png
│   │   ├── Saree.png
│   │   ├── Stove.png
│   │   └── grocery.png
│   └── (any timestamped uploads)
└── main.py (updated)
```

## Final Verification Checklist

- [ ] Backend service restarted successfully
- [ ] No errors in backend logs
- [ ] Images accessible via curl/browser
- [ ] Admin products page shows images
- [ ] User products page shows real products from database
- [ ] No 404 errors in browser console

---

**Need Help?** Check the logs with: `sudo journalctl -u karuda -f`
