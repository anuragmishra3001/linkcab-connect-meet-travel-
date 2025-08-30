#!/bin/bash

echo "Disabling Development Mode for Production..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp "env.example" ".env"
fi

# Update .env file to disable development mode
echo "Updating .env file..."
sed -i 's/VITE_DEV_MODE=true/VITE_DEV_MODE=false/g' .env
sed -i 's/VITE_DEV_MODE=.*/VITE_DEV_MODE=false/g' .env

echo ""
echo "Development mode has been disabled!"
echo ""
echo "Changes made:"
echo "- VITE_DEV_MODE=false"
echo ""
echo "The following features are now disabled:"
echo "- Mock user authentication"
echo "- Bypassed OTP verification"
echo "- Development mode banners"
echo "- Test credentials display"
echo "- Automatic login with mock user"
echo ""
echo "Restart your development server for changes to take effect:"
echo "npm run dev"
echo ""
