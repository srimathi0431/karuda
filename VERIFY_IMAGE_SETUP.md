# Verify Image Setup - Quick Checklist

## ❌ Current Issue
Images returning 404 because **VPS backend doesn't have static files mount**

## ✅ What's Correct Locally
1. ✅ `main.py` has static files mount added
2. ✅ Frontend uses correct URL: `https://srikaruda.shop${product.image_path}`
3. ✅ Database has correct paths: `/images/products/Kinnam.png`
4. ✅ Image files exist in `backend/images/products/`

## 🔧 What You MUST Do on VPS

### Step 1: Check Current VPS main.py
```bash
ssh root@YOUR_VPS_IP
cd /var/www/karuda/backend
grep -A 3 "app.mount" main.py
```

**If no output** → Static files NOT mounted (that's the problem!)

### Step 2: Add Static Files Mount to VPS main.py

Edit the file:
```bash
nano /var/www/karuda/backend/main.py
```

Find this section (around line 13-23):
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

Add these 3 lines AFTER the CORS middleware:
```python
# Mount static files for images
images_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(images_dir, exist_ok=True)
app.mount("/images", StaticFiles(directory=images_dir), name="images")
```

Save: `Ctrl+X`, `Y`, `Enter`

### Step 3: Create Products Directory
```bash
mkdir -p /var/www/karuda/backend/images/products
cp /var/www/karuda/backend/images/*.png /var/www/karuda/backend/images/products/
chown -R www-data:www-data /var/www/karuda/backend/images
chmod -R 755 /var/www/karuda/backend/images
```

### Step 4: Restart Backend Service
```bash
systemctl restart karuda
systemctl status karuda
```

**Check for errors:**
```bash
journalctl -u karuda -n 50
```

### Step 5: Test Image Access
```bash
# Test from VPS
curl -I http://localhost:8030/images/products/Kinnam.png

# Should return: HTTP/1.1 200 OK

# Test from public
curl -I https://srikaruda.shop/images/products/Kinnam.png

# Should return: HTTP/2 200
```

## 🔍 Debugging

### Check if images exist:
```bash
ls -la /var/www/karuda/backend/images/products/
```

Expected output:
```
-rw-r--r-- 1 www-data www-data  xxxxx Kinnam.png
-rw-r--r-- 1 www-data www-data  xxxxx Lic.png
-rw-r--r-- 1 www-data www-data  xxxxx Saree.png
-rw-r--r-- 1 www-data www-data  xxxxx Stove.png
-rw-r--r-- 1 www-data www-data  xxxxx grocery.png
```

### Check backend logs for errors:
```bash
journalctl -u karuda -f
```

### Check Nginx config:
```bash
nginx -t
systemctl status nginx
```

### Database image paths:
```bash
psql -U postgres -d karudaweb -c "SELECT name, image_path FROM products;"
```

Expected output:
```
       name        |          image_path
-------------------+-------------------------------
 Santhana Kinnam   | /images/products/Kinnam.png
 LIC Policy        | /images/products/Lic.png
 Traditional Saree | /images/products/Saree.png
 Induction Stove   | /images/products/Stove.png
 Groceries Package | /images/products/grocery.png
```

## 🎯 Expected Final Result

After completing all steps:

1. **Backend serves images:** `http://localhost:8030/images/products/Kinnam.png` → 200 OK
2. **Nginx proxies correctly:** `https://srikaruda.shop/images/products/Kinnam.png` → 200 OK
3. **Frontend displays images:** No 404 errors in browser console
4. **Admin panel shows images:** Product management page displays all images
5. **User panel shows images:** Products page displays all images

## 📝 Summary

**The Problem:**
- FastAPI backend on VPS doesn't have `app.mount("/images", ...)` configured
- Images exist on disk but aren't served by the web server

**The Solution:**
1. Add static files mount to VPS `main.py`
2. Ensure images are in `images/products/` directory
3. Restart backend service
4. Test image access

**Time Required:** 5 minutes

---

**After completing these steps, the 404 errors will be resolved! 🎉**
