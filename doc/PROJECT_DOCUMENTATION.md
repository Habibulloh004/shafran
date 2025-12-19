# Shafran Backend - To'liq Loyiha Hujjati

## Umumiy Ma'lumot

**Loyiha nomi:** Shafran Backend
**Framework:** Go + Fiber v2
**Ma'lumotlar bazasi:** PostgreSQL + GORM ORM
**Autentifikatsiya:** JWT (JSON Web Tokens)
**Integratsiyalar:** Payme (to'lov tizimi), Billz (admin/moliya API)

---

## Texnologiyalar

| Texnologiya | Versiya | Maqsad |
|-------------|---------|--------|
| Go | 1.24.0 | Asosiy til |
| Fiber | v2.52.9 | Web framework |
| GORM | v1.31.0 | ORM |
| PostgreSQL | 14+ | Ma'lumotlar bazasi |
| JWT | v5.3.0 | Token autentifikatsiya |
| UUID | v1.6.0 | ID generatsiya |
| bcrypt | - | Parol xeshlash |

---

## Loyiha Strukturasi

```
shafran-server/
├── cmd/
│   └── server/
│       └── main.go                 # Ilovaning kirish nuqtasi
├── internal/
│   ├── config/
│   │   └── config.go              # Konfiguratsiya boshqaruvi
│   ├── database/
│   │   └── database.go            # DB ulanish va migratsiyalar
│   ├── handlers/                  # HTTP so'rovlar ishlovchilari
│   │   ├── auth.go               # Autentifikatsiya
│   │   ├── catalog.go            # Katalog (kategoriya, brend, va h.k.)
│   │   ├── product.go            # Mahsulotlar CRUD
│   │   ├── order.go              # Buyurtmalar
│   │   ├── profile.go            # Foydalanuvchi profili
│   │   ├── payme.go              # Payme to'lov integratsiyasi
│   │   ├── billz.go              # Billz API proksi
│   │   └── marketing.go          # Banner, filiallar, to'lov usullari
│   ├── middleware/
│   │   ├── auth.go               # JWT token tekshiruvi
│   │   └── payme.go              # Payme avtorizatsiya
│   ├── models/                   # Ma'lumotlar bazasi modellari
│   │   ├── base.go               # Bazaviy model (UUID, timestamps)
│   │   ├── user.go               # Foydalanuvchi
│   │   ├── catalog.go            # Katalog modellari
│   │   ├── product.go            # Mahsulot modellari
│   │   ├── order.go              # Buyurtma modellari
│   │   ├── profile.go            # Profil modellari
│   │   ├── marketing.go          # Marketing modellari
│   │   └── payme_transaction.go  # Payme tranzaksiya
│   ├── routes/
│   │   └── routes.go             # Barcha routelar ro'yxati
│   ├── services/
│   │   ├── payme_service.go      # Payme biznes logikasi
│   │   └── billz_service.go      # Billz API integratsiyasi
│   └── utils/
│       ├── jwt.go                # JWT funksiyalari
│       ├── hash.go               # Parol xeshlash
│       └── pagination.go         # Sahifalash
├── .env                          # Muhit o'zgaruvchilari
├── docker-compose.yml            # Docker konfiguratsiyasi
├── Dockerfile                    # Docker image
└── go.mod                        # Go modullar
```

---

## So'rov Oqimi (Request Flow)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Middleware │────▶│   Handler   │────▶│   Service   │
│  (Request)  │     │ (Auth/Log)  │     │  (Logic)    │     │ (Business)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │                    │
                                               ▼                    ▼
                                        ┌─────────────┐     ┌─────────────┐
                                        │   Models    │────▶│  Database   │
                                        │   (GORM)    │     │ (PostgreSQL)│
                                        └─────────────┘     └─────────────┘
```

**Qadamlar:**
1. Client HTTP so'rov yuboradi
2. Fiber middleware'lar so'rovni qayta ishlaydi (logging, recovery)
3. Auth middleware JWT tokenni tekshiradi (himoyalangan routelar uchun)
4. Handler so'rov parametrlarini oladi va validatsiya qiladi
5. Service biznes logikani bajaradi
6. GORM orqali ma'lumotlar bazasi bilan ishlaydi
7. Response clientga qaytariladi

---

## API Routelar

Barcha routelar `/api` prefiksi bilan boshlanadi.

### Autentifikatsiya (Ochiq)

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/register` | Yangi foydalanuvchi ro'yxatdan o'tishi |
| POST | `/api/auth/login` | Tizimga kirish |
| POST | `/api/auth/verify` | SMS kodni tasdiqlash |

**Register so'rovi:**
```json
{
  "phone": "+998901234567",
  "password": "parol123",
  "display_name": "Ism Familiya"
}
```

**Login so'rovi:**
```json
{
  "phone": "+998901234567",
  "password": "parol123"
}
```

**Javob:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "uuid",
    "phone": "+998901234567",
    "display_name": "Ism Familiya"
  }
}
```

---

### Katalog (Ochiq)

#### Kategoriyalar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/categories/` | Barcha kategoriyalar ro'yxati |
| GET | `/api/categories/:id` | Bitta kategoriya |
| POST | `/api/categories/` | Kategoriya yaratish |
| PUT | `/api/categories/:id` | Kategoriyani yangilash |
| DELETE | `/api/categories/:id` | Kategoriyani o'chirish |

#### Brendlar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/brands/` | Barcha brendlar |
| GET | `/api/brands/:id` | Bitta brend |
| POST | `/api/brands/` | Brend yaratish |
| PUT | `/api/brands/:id` | Brendni yangilash |
| DELETE | `/api/brands/:id` | Brendni o'chirish |

#### Atir Notalari

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/fragrance-notes/` | Barcha notalar |
| GET | `/api/fragrance-notes/:id` | Bitta nota |
| POST | `/api/fragrance-notes/` | Nota yaratish |
| PUT | `/api/fragrance-notes/:id` | Notani yangilash |
| DELETE | `/api/fragrance-notes/:id` | Notani o'chirish |

#### Fasllar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/seasons/` | Barcha fasllar |
| GET | `/api/seasons/:id` | Bitta fasl |
| POST | `/api/seasons/` | Fasl yaratish |
| PUT | `/api/seasons/:id` | Faslni yangilash |
| DELETE | `/api/seasons/:id` | Faslni o'chirish |

#### Mahsulot Turlari

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/product-types/` | Barcha turlar |
| GET | `/api/product-types/:id` | Bitta tur |
| POST | `/api/product-types/` | Tur yaratish |
| PUT | `/api/product-types/:id` | Turni yangilash |
| DELETE | `/api/product-types/:id` | Turni o'chirish |

---

### Mahsulotlar (Ochiq)

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/products/` | Mahsulotlar ro'yxati (filtrlar bilan) |
| GET | `/api/products/:id` | Mahsulot tafsilotlari |
| POST | `/api/products/` | Mahsulot yaratish |
| PUT | `/api/products/:id` | Mahsulotni yangilash |
| DELETE | `/api/products/:id` | Mahsulotni o'chirish |

**Variantlar:**

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/products/:id/variants` | Mahsulot variantlari |
| POST | `/api/products/:id/variants` | Variant yaratish |
| PUT | `/api/products/:id/variants/:variantId` | Variantni yangilash |
| DELETE | `/api/products/:id/variants/:variantId` | Variantni o'chirish |

**Filtrlar (GET /api/products/):**

| Parametr | Turi | Tavsif |
|----------|------|--------|
| `page` | number | Sahifa raqami (default: 1) |
| `limit` | number | Har sahifadagi elementlar (default: 20) |
| `category_id` | uuid | Kategoriya bo'yicha filtr |
| `brand_id` | uuid | Brend bo'yicha filtr |
| `search` | string | Nom bo'yicha qidirish |
| `min_price` | number | Minimal narx |
| `max_price` | number | Maksimal narx |
| `gender` | string | Jins bo'yicha filtr |

**Misol:**
```
GET /api/products/?category_id=xxx&min_price=100000&max_price=500000&page=1&limit=10
```

---

### Marketing (Ochiq)

#### Bannerlar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/banner/` | Barcha bannerlar |
| POST | `/api/banner/` | Banner yaratish |
| PUT | `/api/banner/:id` | Bannerni yangilash |
| DELETE | `/api/banner/:id` | Bannerni o'chirish |

#### Olib Ketish Filiallari

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/pickup-branches/` | Barcha filiallar |
| POST | `/api/pickup-branches/` | Filial yaratish |
| PUT | `/api/pickup-branches/:id` | Filialni yangilash |
| DELETE | `/api/pickup-branches/:id` | Filialni o'chirish |

#### To'lov Usullari

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/payment-providers/` | To'lov usullari ro'yxati |
| POST | `/api/payment-providers/` | To'lov usuli yaratish |
| PUT | `/api/payment-providers/:id` | To'lov usulini yangilash |
| DELETE | `/api/payment-providers/:id` | To'lov usulini o'chirish |

---

### Himoyalangan Routelar (JWT Talab Qilinadi)

> **Eslatma:** Bu routelar uchun `Authorization: Bearer <token>` headerini yuborish shart.

#### Buyurtmalar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/orders/` | Buyurtma yaratish |
| GET | `/api/orders/` | Foydalanuvchi buyurtmalari |
| GET | `/api/orders/:id` | Buyurtma tafsilotlari |

**Buyurtma yaratish:**
```json
{
  "items": [
    {
      "product_id": "uuid",
      "variant_id": "uuid",
      "quantity": 2
    }
  ],
  "delivery_type": "delivery",
  "delivery_address_id": "uuid",
  "payment_method": "payme",
  "use_bonus": true,
  "bonus_amount": 10000
}
```

#### Profil

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/profile/` | Profil ma'lumotlari |
| PUT | `/api/profile/` | Profilni yangilash |

**Profil yangilash:**
```json
{
  "first_name": "Ism",
  "last_name": "Familiya",
  "display_name": "Ism Familiya"
}
```

#### Manzillar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/profile/addresses` | Manzillar ro'yxati |
| POST | `/api/profile/addresses` | Manzil qo'shish |
| PUT | `/api/profile/addresses/:id` | Manzilni yangilash |
| DELETE | `/api/profile/addresses/:id` | Manzilni o'chirish |

**Manzil qo'shish:**
```json
{
  "label": "Uy",
  "address_line": "Shayxontohur tumani, 15-uy",
  "apartment": "45",
  "city": "Toshkent",
  "district": "Shayxontohur",
  "postal_code": "100000",
  "is_default": true
}
```

#### Bonus

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/profile/bonus` | Bonus tranzaksiyalari |

---

### Payme To'lov Tizimi

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/payme/checkout` | To'lovni boshlash |
| POST | `/api/payme/pay` | Payme JSON-RPC so'rovlari |
| POST | `/api/payme/fake-transaction` | Test tranzaksiya (dev uchun) |

**Payme JSON-RPC metodlari (`/api/payme/pay`):**

| Metod | Tavsif |
|-------|--------|
| `CheckPerformTransaction` | Tranzaksiya bajarilishi mumkinligini tekshirish |
| `CheckTransaction` | Tranzaksiya holatini olish |
| `CreateTransaction` | Yangi tranzaksiya yaratish |
| `PerformTransaction` | Tranzaksiyani yakunlash |
| `CancelTransaction` | Tranzaksiyani bekor qilish |
| `GetStatement` | Tranzaksiyalar tarixi |

---

### Billz API Proksi

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| ALL | `/api/billz/*` | Barcha so'rovlar Billz API ga proksilanadi |

Bu route server tomonida Billz tokenini avtomatik qo'shadi.

---

## Ma'lumotlar Bazasi Modellari

### Bazaviy Model

```go
type BaseModel struct {
    ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4()"`
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

### Foydalanuvchi Modellari

**User:**
```go
type User struct {
    BaseModel
    Phone        string `gorm:"uniqueIndex"`
    PasswordHash string `json:"-"`
    FirstName    string
    LastName     string
    DisplayName  string
    IsVerified   bool
}
```

**UserAddress:**
```go
type UserAddress struct {
    BaseModel
    UserID      uuid.UUID
    Label       string  // "Uy", "Ish", va h.k.
    AddressLine string
    Apartment   string
    City        string
    District    string
    PostalCode  string
    IsDefault   bool
}
```

### Mahsulot Modellari

**Product:**
```go
type Product struct {
    BaseModel
    Name             string
    Slug             string
    BasePrice        float64
    Rating           float64
    Gender           string
    Manufacturer     string
    CountryOfOrigin  string
    FragranceFamily  string
    BrandID          uuid.UUID
    CategoryID       uuid.UUID

    // Bog'lanishlar
    Brand            Brand
    Category         Category
    Variants         []ProductVariant
    Media            []ProductMedia
    Specifications   []ProductSpecification
    FragranceNotes   []FragranceNote   // Many-to-Many
    Seasons          []Season          // Many-to-Many
    ProductTypes     []ProductType     // Many-to-Many
}
```

**ProductVariant:**
```go
type ProductVariant struct {
    BaseModel
    ProductID  uuid.UUID
    SKU        string
    Volume     string  // "50ml", "100ml"
    Price      float64
    Quantity   int     // Ombordagi miqdor
    IsTester   bool
}
```

### Buyurtma Modellari

**Order:**
```go
type Order struct {
    BaseModel
    UserID           uuid.UUID
    Status           string  // "pending", "paid", "shipped", "delivered", "cancelled"
    TotalAmount      float64
    DeliveryType     string  // "delivery", "pickup"
    DeliveryAddressID *uuid.UUID
    PickupBranchID   *uuid.UUID
    PaymentMethod    string
    BonusAmount      float64

    Items            []OrderItem
}
```

**OrderItem:**
```go
type OrderItem struct {
    BaseModel
    OrderID    uuid.UUID
    ProductID  uuid.UUID
    VariantID  uuid.UUID
    Quantity   int
    UnitPrice  float64
}
```

### Munosabatlar Diagrammasi

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────▶│   Order     │────▶│ OrderItem   │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                    │
      ▼                   │                    ▼
┌─────────────┐           │             ┌─────────────┐
│ UserAddress │◀──────────┘             │  Product    │
└─────────────┘                         └─────────────┘
                                              │
      ┌───────────────────────────────────────┼───────────────────────────────────────┐
      │                   │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼                   ▼
┌───────────┐     ┌─────────────┐     ┌─────────────┐     ┌───────────┐     ┌─────────────┐
│   Brand   │     │  Category   │     │ProductVariant│    │ ProductMedia│   │ FragranceNote│
└───────────┘     └─────────────┘     └─────────────┘     └───────────┘     └─────────────┘
```

---

## Middleware'lar

### Auth Middleware

**Fayl:** `internal/middleware/auth.go`

```go
func AuthMiddleware(cfg *config.Config) fiber.Handler {
    return func(c *fiber.Ctx) error {
        // Authorization headerini olish
        authHeader := c.Get("Authorization")

        // "Bearer " prefiksini olib tashlash
        token := strings.TrimPrefix(authHeader, "Bearer ")

        // Tokenni tekshirish
        userID, err := utils.ParseToken(cfg.JWTSecret, token)
        if err != nil {
            return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
        }

        // User ID ni kontekstga saqlash
        c.Locals("currentUserID", userID)
        return c.Next()
    }
}
```

**Foydalanish:**
```go
// Handler ichida
userID := middleware.GetCurrentUserID(c)
```

### Payme Middleware

**Fayl:** `internal/middleware/payme.go`

Payme API so'rovlarini autentifikatsiya qiladi. Base64 kodlangan Authorization headerini tekshiradi.

---

## Konfiguratsiya

### Muhit O'zgaruvchilari (.env)

```env
# Server
APP_PORT=8080

# Ma'lumotlar bazasi
DATABASE_URL=postgres://user:password@localhost:5432/shafran?sslmode=disable

# JWT
JWT_SECRET=your-64-character-secret-key-here
JWT_TTL_HOURS=24

# Payme
PAYME_MERCHANT_ID=your-merchant-id
PAYME_MERCHANT_KEY=your-merchant-key

# Billz
BILLZ_API_SECRET_KEY=your-billz-secret
BILLZ_AUTH_URL=https://api.billz.uz/auth
BILLZ_URL=https://api.billz.uz
```

### Config Strukturasi

```go
type Config struct {
    AppPort          string
    DatabaseURL      string
    JWTSecret        string
    TokenExpires     time.Duration
    PaymeMerchantID  string
    PaymeMerchantKey string
}
```

---

## Javob Formatlari

### Muvaffaqiyatli Javob

```json
{
  "success": true,
  "data": { ... },
  "token": "jwt_token (agar mavjud bo'lsa)",
  "pagination": {
    "current_page": 1,
    "items_per_page": 20,
    "total_items": 100
  }
}
```

### Xatolik Javoblari

**Oddiy xatolik:**
```json
{
  "error": "Xatolik xabari",
  "code": 400
}
```

**Payme xatolik:**
```json
{
  "error": {
    "code": -31001,
    "message": {
      "uz": "Noto'g'ri summa",
      "ru": "Недопустимая сумма",
      "en": "Invalid amount"
    }
  },
  "id": "request_id"
}
```

---

## Ishga Tushirish

### Lokal Ishga Tushirish

```bash
# Dependencylarni yuklash
go mod download

# Serverni ishga tushirish
go run ./cmd/server
```

### Docker bilan Ishga Tushirish

```bash
# Barcha containerlarni ishga tushirish
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f
```

---

## API Misollar (cURL)

### Ro'yxatdan O'tish

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "password": "parol123",
    "display_name": "Test User"
  }'
```

### Tizimga Kirish

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+998901234567",
    "password": "parol123"
  }'
```

### Mahsulotlarni Olish

```bash
curl -X GET "http://localhost:8080/api/products/?page=1&limit=10"
```

### Buyurtma Yaratish (Autentifikatsiya Bilan)

```bash
curl -X POST http://localhost:8080/api/orders/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "product_id": "product-uuid",
        "variant_id": "variant-uuid",
        "quantity": 1
      }
    ],
    "delivery_type": "delivery",
    "delivery_address_id": "address-uuid",
    "payment_method": "payme"
  }'
```

---

## Xulosa

Bu loyiha atir do'koni uchun backend API hisoblanadi. Asosiy imkoniyatlar:

- **Foydalanuvchi boshqaruvi:** Ro'yxatdan o'tish, kirish, SMS tasdiqlash
- **Katalog:** Kategoriyalar, brendlar, atir notalari, fasllar, mahsulot turlari
- **Mahsulotlar:** To'liq CRUD, variantlar, media, spetsifikatsiyalar
- **Buyurtmalar:** Yaratish, ko'rish, holat boshqaruvi
- **Profil:** Ma'lumotlar, manzillar, bonus tizimi
- **To'lovlar:** Payme integratsiyasi
- **Marketing:** Bannerlar, filiallar, to'lov usullari
- **Billz:** Admin panel uchun API proksi

Loyiha Go tilining tez va samarali imkoniyatlaridan foydalangan holda qurilgan bo'lib, ishlab chiqarish uchun tayyor.
