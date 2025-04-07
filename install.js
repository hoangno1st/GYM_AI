const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Display welcome message
console.log('\x1b[36m%s\x1b[0m', '=== Gym Bro Application Setup ===');
console.log('Installing dependencies and setting up your application...');

try {
    // Check if node_modules directory exists
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
        console.log('\x1b[33m%s\x1b[0m', 'Installing NPM dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        console.log('\x1b[32m%s\x1b[0m', 'Dependencies installed successfully!');
    } else {
        console.log('\x1b[32m%s\x1b[0m', 'Dependencies already installed.');
    }

    // Create necessary directories if they don't exist
    const directories = ['images'];
    
    directories.forEach(dir => {
        if (!fs.existsSync(path.join(__dirname, dir))) {
            fs.mkdirSync(path.join(__dirname, dir));
            console.log(`Created directory: ${dir}`);
        }
    });

    // Check if the logo exists, if not, we'll create a placeholder message
    if (!fs.existsSync(path.join(__dirname, 'images', 'logo.png'))) {
        console.log('\x1b[33m%s\x1b[0m', 'NOTE: Please add your logo.png file to the images directory.');
    }

    // Start the application
    console.log('\x1b[36m%s\x1b[0m', '\nSetup complete! You can now start the application:');
    console.log('\x1b[37m%s\x1b[0m', 'npm run dev    - Start development server');
    console.log('\x1b[37m%s\x1b[0m', 'npm run build  - Build for production');
    console.log('\x1b[37m%s\x1b[0m', 'npm start      - Start lite-server');
    
} catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error during setup:');
    console.error(error.message);
    process.exit(1);
} 