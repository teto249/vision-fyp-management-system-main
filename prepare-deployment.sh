#!/bin/bash

# Script to prepare the application for deployment
# Run this script before deploying to update all API URLs

echo "🚀 Preparing Vision FYP Management System for deployment..."

# Navigate to the project root
cd "$(dirname "$0")"

echo "📝 Updating API base URLs..."

# List of files to update
API_FILES=(
    "Frontend/src/api/StudentApi/account.ts"
    "Frontend/src/api/StudentApi/FetchSupervisors.ts" 
    "Frontend/src/api/StudentApi/Projects.ts"
    "Frontend/src/api/SupervisorApi/account.ts"
    "Frontend/src/api/SupervisorApi/AIReports.ts"
    "Frontend/src/api/SupervisorApi/FetchProjects.ts"
    "Frontend/src/api/uniAdmin/account.ts"
    "Frontend/src/api/uniAdmin/FetchUsers.ts"
    "Frontend/src/api/uniAdmin/RegisterUniUsers.ts"
    "Frontend/src/api/uniAdmin/Dashboard.ts"
    "Frontend/src/api/admin/account.ts"
    "Frontend/src/api/admin/dashboard.ts"
    "Frontend/src/api/admin/fetchUniversities.ts"
    "Frontend/src/api/admin/registerUniversity.ts"
)

# Update each file
for file in "${API_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ Updating $file"
        # Replace localhost URL with environment variable
        sed -i 's|http://localhost:3000|${process.env.NEXT_PUBLIC_API_URL \|\| "http://localhost:3000"}|g' "$file"
        # Add BASE_URL constant if not present
        if ! grep -q "const BASE_URL" "$file"; then
            sed -i '1i const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";' "$file"
        fi
    else
        echo "  ⚠️  File not found: $file"
    fi
done

echo "🔧 Creating production build configuration..."

# Ensure package.json has correct scripts
cd Frontend
if [ -f "package.json" ]; then
    echo "  ✅ package.json found"
else
    echo "  ❌ package.json not found in Frontend directory"
    exit 1
fi

echo "🧪 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "  ✅ Build successful!"
else
    echo "  ❌ Build failed. Please fix errors before deployment."
    exit 1
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push your changes to GitHub"
echo "2. Deploy backend to Railway/Heroku"
echo "3. Deploy frontend to Vercel"
echo "4. Update NEXT_PUBLIC_API_URL environment variable in Vercel"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"
