# Fix Withdrawal Requests Error

## Problem
- Error: `TypeError: 'NoneType' object is not subscriptable` at line 828
- Code was calling `fetchall()` then `fetchone()` on same cursor
- The second query result was consumed by the first fetch

## Solution
- Execute COUNT query FIRST
- Fetch the total
- THEN execute the SELECT query  
- Fetch the requests list

---

## Deploy Commands

```bash
# Upload fixed file
scp backend/mlm_crud.py root@srv1303984.ds.network:/var/www/karuda/backend/mlm_crud.py

# Restart
ssh root@srv1303984.ds.network "sudo systemctl restart karuda"

# Watch logs
ssh root@srv1303984.ds.network "sudo journalctl -u karuda -f -n 30"
```

---

## Test After Deploy

1. Go to: `https://karuda.techneysoft.com/admin/withdrawals`
2. Should load withdrawal requests successfully
3. Try filtering by status (pending/approved/rejected)
