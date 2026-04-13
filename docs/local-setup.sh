#!/bin/bash
##
## DriveMaster — Local Development Setup
## Run from the project root: bash docs/local-setup.sh
##

set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; GOLD='\033[0;33m'; NC='\033[0m'
info()  { echo -e "${GOLD}▶ $1${NC}"; }
ok()    { echo -e "${GREEN}✓ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; exit 1; }

echo ""
echo "  ╔══════════════════════════════════╗"
echo "  ║   DriveMaster Local Setup        ║"
echo "  ╚══════════════════════════════════╝"
echo ""

# Check PHP
info "Checking PHP 8.2+"
php -r "if(version_compare(PHP_VERSION,'8.2.0','<')){exit(1);}" || error "PHP 8.2+ required"
ok "PHP $(php -r 'echo PHP_VERSION;') found"

# Check Composer
info "Checking Composer"
which composer > /dev/null || error "Composer not found. Install from https://getcomposer.org"
ok "Composer found"

# Check Node
info "Checking Node.js 18+"
node -e "if(parseInt(process.version.slice(1))<18){process.exit(1)}" || error "Node.js 18+ required"
ok "Node.js $(node --version) found"

# Check MariaDB/MySQL
info "Checking database connection"
mysql -u root -pVimal555!! -e "SELECT 1;" 2>/dev/null || {
    echo -e "${GOLD}⚠ Could not connect with root/Vimal555!! — update .env manually${NC}"
}

# Install PHP dependencies
info "Installing PHP dependencies..."
composer install --no-interaction --prefer-dist 2>&1 | tail -3
ok "PHP dependencies installed"

# Environment setup
if [ ! -f .env ]; then
    info "Creating .env from example..."
    cp .env.example .env
    php artisan key:generate --ansi
    ok ".env created and APP_KEY set"
else
    ok ".env already exists"
fi

# Database
info "Setting up database..."
mysql -u root -pVimal555!! -e "CREATE DATABASE IF NOT EXISTS drive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null && ok "Database 'drive' ready" || echo "  ⚠ Create DB manually or update .env"

# Migrate
info "Running migrations..."
php artisan migrate --force --ansi 2>&1 | tail -5
ok "Migrations complete"

# Seed
info "Seeding database with sample data..."
php artisan db:seed --ansi 2>&1 | tail -5
ok "Database seeded"

# Frontend
info "Installing npm packages..."
npm install 2>&1 | tail -3
ok "npm packages installed"

# Storage link
info "Creating storage symlink..."
php artisan storage:link --ansi 2>/dev/null || true
ok "Storage linked"

# Cache clear
info "Clearing caches..."
php artisan config:clear && php artisan route:clear && php artisan view:clear
ok "Caches cleared"

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║   ✅  Setup Complete!                ║"
echo "  ╠══════════════════════════════════════╣"
echo "  ║                                      ║"
echo "  ║  Start dev:  npm run dev             ║"
echo "  ║  Start API:  php artisan serve       ║"
echo "  ║                                      ║"
echo "  ║  Admin:   admin@drivemaster.in       ║"
echo "  ║  Pass:    Admin@123                  ║"
echo "  ║                                      ║"
echo "  ║  Teacher: rajesh.murugan@drivemaster ║"
echo "  ║  Pass:    Teacher@123                ║"
echo "  ║                                      ║"
echo "  ║  Student Portal: /portal             ║"
echo "  ║  ID: DM-$(date +%Y)-0001                    ║"
echo "  ║                                      ║"
echo "  ╚══════════════════════════════════════╝"
echo ""
