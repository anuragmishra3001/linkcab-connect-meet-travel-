/**
 * Deployment Helper Script for LinkCab
 * 
 * This script helps prepare the project for deployment by:
 * 1. Checking if all required environment variables are set
 * 2. Validating the project structure
 * 3. Building the frontend
 * 
 * Usage: node deploy.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ES Module polyfills for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Print header
console.log(`${colors.bright}${colors.blue}=== LinkCab Deployment Helper ===${colors.reset}\n`);

// Check if .env files exist
const checkEnvFiles = () => {
  console.log(`${colors.cyan}Checking environment files...${colors.reset}`);
  
  const frontendEnvPath = path.join(__dirname, '.env');
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  
  let allGood = true;
  
  if (!fs.existsSync(frontendEnvPath)) {
    console.log(`${colors.yellow}⚠️ Frontend .env file not found. Some features might not work correctly.${colors.reset}`);
    allGood = false;
  } else {
    console.log(`${colors.green}✓ Frontend .env file found.${colors.reset}`);
  }
  
  if (!fs.existsSync(backendEnvPath)) {
    console.log(`${colors.red}❌ Backend .env file not found. Please create one before deploying.${colors.reset}`);
    console.log(`${colors.dim}   You can copy the example file: cp backend/env.example backend/.env${colors.reset}`);
    allGood = false;
  } else {
    console.log(`${colors.green}✓ Backend .env file found.${colors.reset}`);
  }
  
  return allGood;
};

// Check if package.json files exist and have required scripts
const checkPackageFiles = () => {
  console.log(`\n${colors.cyan}Checking package.json files...${colors.reset}`);
  
  const frontendPackagePath = path.join(__dirname, 'package.json');
  const backendPackagePath = path.join(__dirname, 'backend', 'package.json');
  
  let allGood = true;
  
  if (!fs.existsSync(frontendPackagePath)) {
    console.log(`${colors.red}❌ Frontend package.json not found.${colors.reset}`);
    allGood = false;
  } else {
    try {
      const frontendPackageContent = fs.readFileSync(frontendPackagePath, 'utf8');
      const frontendPackage = JSON.parse(frontendPackageContent);
      if (!frontendPackage.scripts || !frontendPackage.scripts.build) {
        console.log(`${colors.red}❌ Frontend package.json missing 'build' script.${colors.reset}`);
        allGood = false;
      } else {
        console.log(`${colors.green}✓ Frontend package.json is valid.${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}❌ Error parsing frontend package.json: ${error.message}${colors.reset}`);
      allGood = false;
    }
  }
  
  if (!fs.existsSync(backendPackagePath)) {
    console.log(`${colors.red}❌ Backend package.json not found.${colors.reset}`);
    allGood = false;
  } else {
    try {
      const backendPackageContent = fs.readFileSync(backendPackagePath, 'utf8');
      const backendPackage = JSON.parse(backendPackageContent);
      if (!backendPackage.scripts || !backendPackage.scripts.start) {
        console.log(`${colors.yellow}⚠️ Backend package.json missing 'start' script.${colors.reset}`);
        allGood = false;
      } else {
        console.log(`${colors.green}✓ Backend package.json is valid.${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}❌ Error parsing backend package.json: ${error.message}${colors.reset}`);
      allGood = false;
    }
  }
  
  return allGood;
};

// Check if vercel.json exists
const checkVercelConfig = () => {
  console.log(`\n${colors.cyan}Checking Vercel configuration...${colors.reset}`);
  
  const vercelConfigPath = path.join(__dirname, 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    console.log(`${colors.red}❌ vercel.json not found.${colors.reset}`);
    return false;
  } else {
    console.log(`${colors.green}✓ vercel.json found.${colors.reset}`);
    return true;
  }
};

// Build the frontend
const buildFrontend = () => {
  console.log(`\n${colors.cyan}Building frontend...${colors.reset}`);
  
  try {
    console.log(`${colors.dim}Running npm run build...${colors.reset}`);
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Frontend built successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Frontend build failed.${colors.reset}`);
    return false;
  }
};

// Check if git is initialized and has a remote
const checkGit = () => {
  console.log(`\n${colors.cyan}Checking Git configuration...${colors.reset}`);
  
  try {
    // Check if .git directory exists
    if (!fs.existsSync(path.join(__dirname, '.git'))) {
      console.log(`${colors.yellow}⚠️ Git is not initialized. Run 'git init' to initialize.${colors.reset}`);
      return false;
    }
    
    // Check if git has a remote
    const remotes = execSync('git remote').toString().trim();
    if (!remotes) {
      console.log(`${colors.yellow}⚠️ Git has no remotes. Add a remote with 'git remote add origin <url>'.${colors.reset}`);
      return false;
    }
    
    console.log(`${colors.green}✓ Git is properly configured.${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}❌ Error checking Git configuration: ${error.message}${colors.reset}`);
    return false;
  }
};

// Main function
const main = async () => {
  let readyForDeployment = true;
  
  // Run checks
  if (!checkEnvFiles()) readyForDeployment = false;
  if (!checkPackageFiles()) readyForDeployment = false;
  if (!checkVercelConfig()) readyForDeployment = false;
  if (!checkGit()) readyForDeployment = false;
  
  // Print summary
  console.log(`\n${colors.bright}${colors.blue}=== Deployment Readiness Summary ===${colors.reset}`);
  
  if (readyForDeployment) {
    console.log(`${colors.green}✓ Your project is ready for deployment!${colors.reset}`);
    console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
    console.log(`${colors.dim}1. Commit your changes: git add . && git commit -m "Ready for deployment"${colors.reset}`);
    console.log(`${colors.dim}2. Push to GitHub: git push -u origin main${colors.reset}`);
    console.log(`${colors.dim}3. Connect your repository to Vercel${colors.reset}`);
    console.log(`${colors.dim}4. Configure environment variables in Vercel${colors.reset}`);
    console.log(`${colors.dim}5. Deploy!${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Your project needs some adjustments before deployment.${colors.reset}`);
    console.log(`${colors.dim}Please address the issues above and run this script again.${colors.reset}`);
  }
  
  console.log(`\n${colors.bright}${colors.blue}===================================${colors.reset}`);
};

// Run the main function
try {
  await main();
} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
}