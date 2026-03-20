#!/usr/bin/env node

/**
 * Build script for Vercel deployment
 * Uses Vercel Build Output API v3 format (.vercel/output/static)
 * This bypasses .gitignore issues with the public/ directory
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const vercelOutputDir = path.join(rootDir, '.vercel', 'output');
const publicDir = path.join(vercelOutputDir, 'static');

// Files to copy from root to public directory
const staticFiles = [
  'index.html',
  'ceremonial_interface.html',
  'resonance_dashboard.html',
  'spectral_command_shell.html',
  'pi-forge-integration.js'
];

// Directories to copy from root to public directory
const staticDirs = [
  'frontend'
];

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy a single file
 */
function copyFile(src, dest) {
  const srcPath = path.join(rootDir, src);
  const destPath = path.join(publicDir, path.basename(src));

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${src}`);
  } else {
    console.warn(`⚠ File not found: ${src}`);
  }
}

/**
 * Main build function
 */
function build() {
  console.log('Building static assets for Vercel deployment...\n');

  // Clean and create output directory structure
  if (fs.existsSync(vercelOutputDir)) {
    fs.rmSync(vercelOutputDir, { recursive: true });
  }
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✓ Created .vercel/output/static directory\n');

  // Create Vercel Build Output API config
  const configPath = path.join(vercelOutputDir, 'config.json');
  const config = {
    version: 3,
    routes: [
      { handle: "filesystem" },
      { src: "/api/(.*)", dest: "https://pi-forge-quantum-genesis-1.onrender.com/api/$1" },
      { src: "/health", dest: "https://pi-forge-quantum-genesis-1.onrender.com/health" },
      { src: "/(.*)", dest: "/index.html" }
    ]
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✓ Created config.json\n');

  // Copy static files
  console.log('Copying static files:');
  for (const file of staticFiles) {
    copyFile(file, publicDir);
  }
  console.log('');

  // Copy static directories
  console.log('Copying static directories:');
  for (const dir of staticDirs) {
    const srcPath = path.join(rootDir, dir);
    const destPath = path.join(publicDir, dir);
    
    if (fs.existsSync(srcPath)) {
      const stats = fs.statSync(srcPath);
      if (stats.isDirectory()) {
        copyDir(srcPath, destPath);
        console.log(`✓ Copied ${dir}/`);
      } else {
        console.warn(`⚠ ${dir} is not a directory, skipping`);
      }
    } else {
      console.warn(`⚠ Directory not found: ${dir}`);
    }
  }

  console.log('\n✅ Build completed successfully!');
  console.log(`📁 Output directory: ${publicDir}\n`);
}

// Run the build
try {
  build();
  process.exit(0);
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
