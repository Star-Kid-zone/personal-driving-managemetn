# DriveMaster — Driving School Management System

> **Production-ready SaaS for Tamil Nadu driving schools.** Built with Laravel 12, React, Inertia.js, TailwindCSS, and AWS.

---

## 🚗 Features

| Module | Description |
|---|---|, 
| **Admin Dashboard** | Analytics, revenue charts, teacher performance, upcoming tests |
| **Student Management** | Enrollment wizard, session tracking, documents |
| **Teacher Portal** | My students, trip scheduling, LLR/DL management |
| **Trip Scheduling** | Assign multiple students per trip, mark attendance, deduct sessions |
| **Payment Tracking** | Full/partial payments, transaction history, balance tracking |
| **LLR & DL Pipeline** | Tamil Nadu 30-day rule, eligibility alerts, test dates |
| **Student Portal** | No-login access via Student ID — sessions, payments, LLR status |
| **Invoice Generation** | Auto PDF via DomPDF, stored on S3 |
| **Notifications** | In-app flash messages + extensible SMS/email |
| **CI/CD** | GitHub Actions → EC2 automated deployment |

---

## 🛠 Tech Stack

- **Backend**: Laravel 12, PHP 8.2, MariaDB
- **Frontend**: React 18, Inertia.js 2, TailwindCSS 3
- **Storage**: AWS S3
- **Server**: AWS EC2, Nginx, PHP-FPM
- **Queue**: Laravel Queue (database driver)
- **CI/CD**: GitHub Actions

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+, Composer, Node 20+, MariaDB

```bash
# 1. Clone
git clone https://github.com/yourorg/drivemaster.git
cd drivemaster

# 2. Environment
cp .env.example .env
# Edit .env — set DB_*, AWS_*, APP_KEY

# 3. PHP dependencies
composer install

# 4. Generate app key
php artisan key:generate

# 5. Migrate & seed
php artisan migrate --seed

# 6. Frontend
npm install
npm run dev      # development
npm run build    # production

# 7. Start server
php artisan serve
```

**Default credentials:**
- Admin: `admin@drivemaster.in` / `Admin@123`
- Teacher: `rajesh.murugan@drivemaster.in` / `Teacher@123`
- Student portal: Enter any Student ID like `DM-2024-0001`

---

## 🏗 Architecture

```
Controllers (thin)
    └── Services (business logic)
            └── Repositories (DB queries)
                    └── Models (Eloquent)
```

**Repository Pattern** — all DB queries go through repository interfaces, bound in `AppServiceProvider`.

---

## 📁 Key Directories

```
app/
├── Http/Controllers/
│   ├── Admin/          # Admin-only controllers
│   ├── Teacher/        # Teacher-only controllers
│   └── Student/        # Student portal (no auth)
├── Services/           # Business logic
├── Repositories/       # DB query layer
│   └── Interfaces/     # Contracts
└── Models/             # Eloquent models

resources/js/
├── Pages/
│   ├── Admin/          # Admin React pages
│   ├── Teacher/        # Teacher React pages
│   └── Student/        # Student portal pages
├── Layouts/            # AppLayout, etc.
└── Components/         # Reusable UI components
```

---

## 🇮🇳 Tamil Nadu License Flow

```
LLR Applied
    → LLR Test
        → LLR Issued
            → [30-Day Wait] ← enforced by system
                → DL Applied
                    → DL Test
                        → DL Issued ✅
```

The system automatically:
1. Sets `dl_eligible_date = llr_issued_date + 30 days`
2. Runs daily `drivemaster:check-dl-eligibility` to flip `dl_eligible = true`
3. Shows countdown timer in Teacher & Admin dashboards
4. Alerts teachers when students become DL-eligible

---

## ☁ AWS Setup

### S3 Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::ACCOUNT:user/drivemaster" },
    "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
    "Resource": "arn:aws:s3:::drivemaster-storage/*"
  }]
}
```

### EC2 Deployment
```bash
# Run once on fresh Ubuntu 22.04 EC2
sudo bash docs/ec2-setup.sh

# Setup Nginx
sudo cp docs/nginx.conf /etc/nginx/sites-available/drivemaster
sudo ln -s /etc/nginx/sites-available/drivemaster /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL
sudo certbot --nginx -d yourdomain.com
```

### GitHub Secrets needed
| Secret | Value |
|---|---|
| `EC2_HOST` | Your EC2 public IP |
| `EC2_USER` | `ubuntu` |
| `EC2_PRIVATE_KEY` | Contents of your `.pem` file |

---

## 🧪 Testing

```bash
php artisan test
php artisan test --parallel     # faster
php artisan test --filter=Student
```

---

## 🎨 Design System

- **Colors**: Deep Teal `#000666` · Gold `#D4AF37` · Grey `#4F4F4F`
- **Style**: Neomorphism + Bento Grid
- **Font**: Plus Jakarta Sans
- **Animations**: AOS (Animate on Scroll)
- **Charts**: Recharts

---

## 📜 License

MIT — Built for DriveMaster Tamil Nadu. All rights reserved.
