#!/bin/bash
set -e  # Exit on any error

echo "🔨 Starting build process..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  WARNING: DATABASE_URL is not set. Migrations and seed will be skipped."
  echo "📦 Installing dependencies..."
  npm install
  echo "🔧 Generating Prisma client..."
  npx prisma generate
  echo "✅ Build complete (without database setup)"
  exit 0
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️  Running database migrations..."
npx prisma migrate deploy

echo "🌱 Seeding database..."
npm run seed

echo "✅ Build complete!"

