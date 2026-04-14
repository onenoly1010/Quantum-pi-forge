#!/usr/bin/env node

/**
 * Build script for Cloudflare Pages deployment.
 * Produces a static `out/` directory plus Pages-compatible redirects/headers.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outputDir = path.join(rootDir, 'out');

// Files to copy from root to the Cloudflare Pages output directory
const staticFiles = [
  '_headers',
  'index.html',
  'ceremonial_interface.html',
  'resonance_dashboard.html',
  'spectral_command_shell.html',
  'pi-forge-integration.js'
];

// Directories to copy from root to the Cloudflare Pages output directory
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
  const destPath = path.join(dest, path.basename(src));

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
  console.log('Building static assets for Cloudflare Pages...\n');

  // Clean and create output directory structure
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✓ Created out/ directory\n');

  const redirects = [
    '/dashboard /frontend/production_dashboard.html 200',
    '/dashboard/ /frontend/production_dashboard.html 200',
    '/resonance-dashboard /frontend/production_dashboard.html 200',
    '/api/* https://pi-forge-quantum-genesis.railway.app/api/:splat 200',
    '/health https://pi-forge-quantum-genesis.railway.app/health 200'
  ].join('\n') + '\n';
  fs.writeFileSync(path.join(outputDir, '_redirects'), redirects);
  console.log('✓ Created out/_redirects\n');

  // Copy static files
  console.log('Copying static files:');
  for (const file of staticFiles) {
    copyFile(file, outputDir);
  }
  console.log('');

  // Copy static directories
  console.log('Copying static directories:');
  for (const dir of staticDirs) {
    const srcPath = path.join(rootDir, dir);
    const destPath = path.join(outputDir, dir);
    
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
  console.log(`📁 Output directory: ${outputDir}\n`);
}

// Run the build
try {
  build();
  process.exit(0);
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
