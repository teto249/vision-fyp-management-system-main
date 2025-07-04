# 🔄 Migration Guide: AWS MySQL → PlanetScale (Free)

## 📅 When to Migrate
- **Month 10-11**: Start planning migration
- **Before Month 12**: Complete migration to avoid charges
- **Or anytime**: If you want to switch to free solution

## 🎯 Migration Steps (Simple Process)

### Step 1: Set Up PlanetScale (5 minutes)
1. **Sign up**: https://planetscale.com (use GitHub)
2. **Create database**: `vision-fyp-db`
3. **Get connection string**: Copy from dashboard

### Step 2: Export Data from AWS MySQL
```bash
# Install AWS CLI (if not already)
# Export your data
mysqldump -h your-aws-endpoint.rds.amazonaws.com \
  -u admin -p \
  vision_fyp_management_system > backup.sql
```

### Step 3: Import to PlanetScale
```bash
# Connect to PlanetScale and import
mysql -h your-planetscale-host.psdb.cloud \
  -u your-username -p \
  your-database < backup.sql
```

### Step 4: Update Environment Variables
Replace in your `.env`:
```env
# OLD (AWS MySQL)
# DB_HOST=your-aws-endpoint.rds.amazonaws.com
# DB_USER=admin
# DB_PASSWORD=your-aws-password

# NEW (PlanetScale)
DATABASE_URL=mysql://username:password@aws.connect.psdb.cloud/vision-fyp-db?ssl={"rejectUnauthorized":true}
DB_SSL=true
```

### Step 5: Test & Deploy
1. **Test locally**: Ensure app works with PlanetScale
2. **Update production**: Deploy with new environment variables
3. **Verify**: Check all functionality works

### Step 6: Clean Up AWS
1. **Delete RDS instance**: Stop billing
2. **Delete security groups**: Clean up resources
3. **Verify**: Check AWS billing shows $0

## 💾 Alternative: Backup & Delete

If you don't need the database anymore:

### Quick Backup:
```bash
# Export all data
mysqldump -h your-aws-endpoint.rds.amazonaws.com \
  -u admin -p \
  --all-databases > complete-backup.sql

# Save to cloud storage
# Upload to Google Drive, Dropbox, etc.
```

### Delete AWS Resources:
1. **RDS Instance**: Delete (choose final snapshot if needed)
2. **Security Groups**: Delete custom ones
3. **Verify**: No charges in next bill

## 🛡️ Migration Safety Tips

### Before Migration:
- ✅ **Test PlanetScale connection** thoroughly
- ✅ **Export complete backup** from AWS
- ✅ **Verify data integrity** after import
- ✅ **Test all app functionality** with new database

### During Migration:
- ✅ **Do it during low-traffic time**
- ✅ **Keep AWS instance running** until verified
- ✅ **Have rollback plan** ready

### After Migration:
- ✅ **Monitor app for 24-48 hours**
- ✅ **Check logs for any issues**
- ✅ **Only then delete AWS instance**

## 📊 Migration Comparison

| Aspect | AWS MySQL | PlanetScale |
|--------|-----------|-------------|
| **Cost** | Free → $15-100/mo | Free forever |
| **Performance** | Good | Better (global CDN) |
| **Scaling** | Manual | Automatic |
| **Maintenance** | You manage | Fully managed |
| **Backups** | Configure yourself | Automatic |

## 🆘 Migration Support

### If Issues Occur:
1. **Keep AWS running** until resolved
2. **Rollback** to AWS if needed
3. **Check PlanetScale docs**: https://docs.planetscale.com
4. **Contact support**: Both platforms have good support

### Alternative Free Options:
- **Supabase**: Free PostgreSQL (requires code changes)
- **Railway**: $5/month MySQL (not free but cheap)
- **Local hosting**: VPS with MySQL (if you have server)

## 🎯 Bottom Line

**Your strategy is perfect:**
1. ✅ **Build on AWS free tier** (12 months free)
2. ✅ **Develop and test** your app
3. ✅ **Migrate to PlanetScale** before charges start
4. ✅ **Enjoy free hosting** forever

**You get the best of both worlds: reliable AWS for development, and free PlanetScale for production! 🎉**
