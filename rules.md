# DriveMaster — Architecture & Coding Rules

## 🏛 Architecture Rules

### Layer Responsibilities

| Layer | Responsibility | Rule |
|---|---|---|
| **Controller** | Receive request, call service, return response | THIN — no business logic, no DB queries |
| **Service** | Business logic, orchestration, transactions | No direct Model access — use Repositories |
| **Repository** | All database queries | Implements interface. No business logic |
| **Model** | Eloquent definitions, relationships, scopes, accessors | No business logic. No service calls |

### Dependency Direction
```
Request → Controller → Service → Repository → Model → Database
```
**Never skip a layer. Never go backwards.**

---

## 📐 Controller Rules

```php
// ✅ CORRECT — thin controller
public function store(EnrollStudentRequest $request): RedirectResponse
{
    $student = $this->studentService->enroll($request->validated());
    return redirect()->route('admin.students.show', $student->id)->with('success', '...');
}

// ❌ WRONG — business logic in controller
public function store(Request $request): RedirectResponse
{
    $student = Student::create([...]);
    Payment::create([...]);
    LlrRecord::create([...]);
    // ...
}
```

---

## 🔧 Service Rules

- Services are injected via constructor DI
- All multi-step operations must use `DB::transaction()`
- Services should return domain objects (Models), not raw arrays
- Services can call multiple repositories

---

## 🗃 Repository Rules

- All repos implement an interface from `Repositories/Interfaces/`
- Interfaces are bound in `AppServiceProvider`
- Repositories accept arrays of filters, return paginated results or Collections
- Never put `auth()->id()` in repositories — pass it from the service/controller

---

## 🎨 Frontend Rules

### React Pages
- All pages use `<AppLayout>` wrapper
- All data comes from Inertia props (no internal API calls)
- Use `useForm` from `@inertiajs/react` for all forms
- Use `router.get()` for filter/search (not form submits)

### Component Rules
- Small, focused components (< 150 lines)
- Tailwind classes + custom CSS classes from `app.css`
- No hardcoded colors — use CSS variables or Tailwind config
- `data-aos` on all animatable sections

### File Naming
```
Pages/Admin/Students/Index.jsx   ← Index page
Pages/Admin/Students/Show.jsx    ← Detail page
Pages/Admin/Students/Create.jsx  ← Create form
Pages/Admin/Students/Edit.jsx    ← Edit form
Components/UI/StatCard.jsx       ← Reusable component
Layouts/AppLayout.jsx            ← Layout wrapper
```

---

## 🇮🇳 Tamil Nadu LLR Rules (Business Logic)

1. Student must complete LLR before DL application
2. After LLR is issued, **minimum 30 days** must pass before DL test
3. DL eligibility date = `llr_issued_date + 30 days`
4. Daily scheduler `drivemaster:check-dl-eligibility` checks and flips `dl_eligible`
5. LLR expiry: 6 months from issue date
6. Required documents: Aadhaar, Address Proof, Age Proof, Photos

---

## 🔐 Auth & Access Rules

| Route prefix | Middleware | Access |
|---|---|---|
| `/admin/*` | `auth`, `role:admin` | Admin only |
| `/teacher/*` | `auth`, `role:teacher` | Teacher only |
| `/portal/*` | `student.portal` (session-based) | Students (no login) |

- Students never get a login — they use their `student_id` or `access_token`
- Teachers can only see/modify their own students
- Admins can see everything

---

## 📝 Naming Conventions

```
Models:              PascalCase singular       → Student, LlrRecord
Controllers:         PascalCase + Controller   → StudentController
Services:            PascalCase + Service      → StudentService
Repositories:        PascalCase + Repository   → StudentRepository
Interfaces:          PascalCase + ...Interface → StudentRepositoryInterface
Migrations:          snake_case descriptive    → 2024_01_01_create_students_table
React Pages:         PascalCase               → Students/Index.jsx
React Components:    PascalCase               → StatCard.jsx
```

---

## 🧪 Testing Rules

- Feature tests for all controller actions
- Unit tests for services with complex logic
- Use `RefreshDatabase` trait
- Seed with `DatabaseSeeder` for feature tests
- Test Tamil Nadu 30-day rule explicitly

---

## 🚫 Prohibited

- Direct `Model::create()` in controllers
- `auth()->id()` in repositories
- Raw SQL without Eloquent unless absolutely necessary
- Storing sensitive data (Aadhaar, etc.) unencrypted beyond what is displayed
- `dd()`, `var_dump()` in production code
- Hardcoded credentials anywhere in code
