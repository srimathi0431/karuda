# Fix Package Table Name on VPS

## Problem
Code was using wrong table names:
- ❌ `package_enrollments` (doesn't exist)  
- ✅ `packages` (correct table name from migration)

Also wrong column name:
- ❌ `pe.amount`
- ✅ `pe.package_amount`

---

## VPS Commands to Fix

```bash
# 1. Backup first
cp /var/www/karuda/backend/mlm_crud.py /var/www/karuda/backend/mlm_crud.py.backup2

# 2. Fix all 3 instances: package_enrollments → packages
sed -i 's/FROM package_enrollments/FROM packages/g' /var/www/karuda/backend/mlm_crud.py
sed -i 's/JOIN package_enrollments pe/JOIN packages pe/g' /var/www/karuda/backend/mlm_crud.py

# 3. Fix column name: pe.amount → pe.package_amount
sed -i 's/SUM(pe\.amount)/SUM(pe.package_amount)/g' /var/www/karuda/backend/mlm_crud.py

# 4. Verify fixes
echo "=== Checking for package_enrollment (should be empty) ==="
grep -n "package_enrollment" /var/www/karuda/backend/mlm_crud.py
echo ""
echo "=== Checking for packages table (should find 3 lines) ==="
grep -n "FROM packages\|JOIN packages" /var/www/karuda/backend/mlm_crud.py
echo ""
echo "=== Checking for package_amount (should find 2 lines) ==="
grep -n "package_amount" /var/www/karuda/backend/mlm_crud.py

# 5. Restart service
sudo systemctl restart karuda

# 6. Watch logs
sudo journalctl -u karuda -f
```

---

## One-Liner

```bash
cp /var/www/karuda/backend/mlm_crud.py /var/www/karuda/backend/mlm_crud.py.backup2 && sed -i 's/FROM package_enrollments/FROM packages/g' /var/www/karuda/backend/mlm_crud.py && sed -i 's/JOIN package_enrollments pe/JOIN packages pe/g' /var/www/karuda/backend/mlm_crud.py && sed -i 's/SUM(pe\.amount)/SUM(pe.package_amount)/g' /var/www/karuda/backend/mlm_crud.py && sudo systemctl restart karuda && sudo journalctl -u karuda -f -n 30
```

---

## After Fix

Test by accessing:
`https://karuda.techneysoft.com/admin/users`

Click on any user → Should load user details page successfully! 🎉
