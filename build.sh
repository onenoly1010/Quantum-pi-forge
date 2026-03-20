#!/bin/bash
echo " Using npm for installation..."
npm install --legacy-peer-deps
echo " Building Next.js app..."
npm run build
