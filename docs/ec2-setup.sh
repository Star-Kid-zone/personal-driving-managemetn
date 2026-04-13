#!/bin/bash
##
## DriveMaster EC2 Server Setup Script
## Ubuntu 22.04 LTS
## Run as: sudo bash ec2-setup.sh
##

set -e
echo "════════════════════════════════════════"
echo "  DriveMaster EC2 Setup"
echo "════════════════════════════════════════"

# ── System update ────────────────────────────
apt-get update -y && apt-get upgrade -y

# ── Essential packages ───────────────────────
apt-get install -y \
    curl wget git unzip vim htop \
    ufw fail2ban \
    software-properties-common ca-certificates

# ── PHP 8.2 ─────────────────────────────────
add-apt-repository ppa:ondrej/php -y
apt-get update -y
apt-get install -y \
    php8.2-fpm php8.2-cli php8.2-mysql php8.2-mbstring \
    php8.2-xml php8.2-curl php8.2-zip php8.2-gd \
    php8.2-intl php8.2-bcmath php8.2-redis

# PHP config
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 10M/' /etc/php/8.2/fpm/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 10M/'             /etc/php/8.2/fpm/php.ini
sed -i 's/memory_limit = 128M/memory_limit = 256M/'            /etc/php/8.2/fpm/php.ini
sed -i 's/max_execution_time = 30/max_execution_time = 120/'   /etc/php/8.2/fpm/php.ini

# ── Nginx ────────────────────────────────────
apt-get install -y nginx
systemctl enable nginx

# ── MariaDB ──────────────────────────────────
apt-get install -y mariadb-server
systemctl enable mariadb
mysql_secure_installation <<EOF

y
Vimal555!!
Vimal555!!
y
y
y
y
EOF

# Create database
mysql -u root -pVimal555!! -e "
  CREATE DATABASE IF NOT EXISTS drive CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE USER IF NOT EXISTS 'drivemaster'@'localhost' IDENTIFIED BY 'Vimal555!!';
  GRANT ALL PRIVILEGES ON drive.* TO 'drivemaster'@'localhost';
  FLUSH PRIVILEGES;
"
echo "✅ Database created"

# ── Node.js 20 ───────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# ── Composer ─────────────────────────────────
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# ── Deploy directory ─────────────────────────
mkdir -p /var/www/drivemaster
chown -R www-data:www-data /var/www
usermod -aG www-data ubuntu

# ── Firewall ─────────────────────────────────
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# ── Certbot (SSL) ────────────────────────────
apt-get install -y certbot python3-certbot-nginx

# ── Queue worker (supervisor) ────────────────
apt-get install -y supervisor
cat > /etc/supervisor/conf.d/drivemaster-worker.conf << 'CONF'
[program:drivemaster-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/drivemaster/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/drivemaster-worker.log
stopwaitsecs=3600
CONF

# ── Scheduler cron ───────────────────────────
(crontab -l 2>/dev/null; echo "* * * * * www-data php /var/www/drivemaster/artisan schedule:run >> /dev/null 2>&1") | crontab -

supervisorctl reread && supervisorctl update

echo ""
echo "════════════════════════════════════════"
echo "  ✅ EC2 Setup Complete!"
echo ""
echo "  Next steps:"
echo "  1. cd /var/www/drivemaster"
echo "  2. git clone YOUR_REPO ."
echo "  3. composer install --no-dev --optimize-autoloader"
echo "  4. npm ci && npm run build"
echo "  5. cp .env.example .env && php artisan key:generate"
echo "  6. php artisan migrate --seed"
echo "  7. ln -s /path/to/nginx.conf /etc/nginx/sites-enabled/"
echo "  8. certbot --nginx -d yourdomain.com"
echo "════════════════════════════════════════"
