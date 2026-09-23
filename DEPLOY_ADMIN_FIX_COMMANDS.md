# Deploy Admin User Details Fix to VPS

## Quick Deploy (Run the batch file)
```cmd
deploy_admin_user_details_fix.bat
```

---

## Manual Commands (if batch file doesn't work)

### 1. Upload Fixed mlm_crud.py
```cmd
scp backend/mlm_crud.py root@srv1303984.ds.network:/var/www/karuda/backend/mlm_crud.py
```

### 2. Restart Backend Service
```cmd
ssh root@srv1303984.ds.network "sudo systemctl restart karuda"
```

### 3. Check Status
```cmd
ssh root@srv1303984.ds.network "sudo systemctl status karuda"
```

### 4. Watch Logs (to verify it's working)
```cmd
ssh root@srv1303984.ds.network "sudo journalctl -u karuda -f -n 50"
```

---

## What This Fixes

**Error 1**: Column `uw.total_deposited` does not exist
- ✅ FIXED: Removed this column from query (line 1082)

**Error 2**: Table `package_enrollment` does not exist
- ✅ FIXED: Changed to `package_enrollments` (plural) on line 1099

---

## After Deployment

1. Open browser: https://karuda.techneysoft.com/admin/users
2. Click on any user row (e.g., "techneysoft")
3. Should load complete user detail page without errors
4. Test wallet Add/Reduce functionality

---

## If Still Errors

Check logs:
```cmd
ssh root@srv1303984.ds.network "sudo journalctl -u karuda -n 100"
```
