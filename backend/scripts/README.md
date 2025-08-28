# LinkCab Scripts

This directory contains utility scripts for the LinkCab application.

## Available Scripts

### Dummy Login Page

The `dummy-login.html` is a standalone HTML page that allows you to test the login and signup functionality with a running backend server.

#### Usage

1. Make sure the backend server is running:
   ```bash
   # Navigate to the backend directory
   cd backend
   
   # Start the server
   npm start
   ```

2. Open the `dummy-login.html` file in a web browser:
   - You can double-click the file to open it directly
   - Or use a local server to serve the file

3. The login tab comes pre-filled with demo credentials. Click the "Sign In" button to log in.

4. Alternatively, you can use the signup tab to create a new user account. The signup form includes fields for name, phone, email, password, age, and gender.

5. Upon successful login or signup, the user information will be displayed on the page, and the authentication token will be stored in the browser's localStorage.

### Standalone Dummy Login Page

The `dummy-login-standalone.html` is a completely standalone HTML page that simulates the login experience without requiring a backend server. This is useful when you want to explore the UI or when the backend server is not available.

#### Usage

1. Simply open the `dummy-login-standalone.html` file in a web browser:
   - You can double-click the file to open it directly

2. The login tab comes pre-filled with demo credentials. Click the "Sign In" button to simulate a login.

3. After logging in, you can explore a simulated version of the app with mock data.

4. You can also log out and log back in to test the full authentication flow.

#### Demo Credentials

Both login pages come with pre-filled demo credentials:

- **Phone:** +1234567890
- **Password:** password123

#### Features

- **Login:** Test existing user authentication
- **Signup:** Create new user accounts (only in the non-standalone version)
- **Auto-verification:** New accounts created through the signup form are automatically marked as verified to bypass OTP verification
- **Token Storage:** Authentication tokens are stored in localStorage for future API requests
- **User Info Display:** After successful authentication, user details are displayed on the page
- **Explore Mode:** The standalone version includes an "Explore App" tab that shows simulated app features

## Notes

- These scripts are intended for development and testing purposes only.
- The `dummy-login.html` communicates with the backend API at `http://localhost:5000/api`. Make sure your backend server is running on this port.
- The `dummy-login-standalone.html` works completely offline with no backend requirements.
- The signup form automatically sets `isPhoneVerified` and `isEmailVerified` to `true` to bypass verification steps.
- If you encounter CORS issues with the non-standalone version, make sure your backend server has CORS properly configured to allow requests from file:// URLs or use a local server to serve the HTML file.