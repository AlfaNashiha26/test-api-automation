# REST API Automation Testing with Playwright
# By Alfa Nashiha

[![Playwright API Tests](https://github.com/AlfaNashiha26/test-api-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlfaNashiha26/test-api-automation/actions/workflows/playwright.yml)

Repository ini berisi kumpulan skenario pengujian otomatis (**REST API Automation Testing**) menggunakan **Playwright (`APIRequestContext`)** dan **JavaScript**. Pengujian mencakup verifikasi fungsionalitas CRUD (*Create, Read, Update, Delete*), autentikasi *Cookie Token*, **JSON Schema Validation (Ajv)**, serta **API Negative Testing** pada layanan API publik [Restful-Booker](https://restful-booker.herokuapp.com/).

Seluruh pengujian terintegrasi dengan **GitHub Actions** yang berjalan otomatis pada setiap `push`/`pull_request`, terjadwal setiap hari (*Cron Job*), serta dapat dipicu secara manual (*Workflow Dispatch*).

---

## Teknologi & Tools

* **Runtime Environment:** Node.js (v26+)
* **Automation Framework:** Playwright Test (`@playwright/test` — HTTP client bawaan `request` tanpa overhead browser)
* **Schema Validator:** Ajv (`ajv` — *Another JSON Validator*)
* **Target API:** [Restful-Booker API](https://restful-booker.herokuapp.com/) (`https://restful-booker.herokuapp.com`)
* **CI/CD Pipeline:** GitHub Actions (Cron Schedule, Manual Trigger, & Job Summary)

---

## Struktur Direktori

```text
├── .github/
│   └── workflows/
│       └── playwright.yml                  # Konfigurasi CI/CD, Cron Job, & Step Summary
├── schemas/
│   └── booking-schema.json                 # Kontrak JSON Schema untuk validasi response API
├── tests/
│   ├── booking-negative-schema.spec.js     # Skenario JSON Schema Validation & API Negative Testing
│   └── booking.spec.js                     # Skenario Happy Path CRUD & Auth Token API
├── .gitignore                              # Pengecualian file lokal (node_modules, report, cache)
├── package.json                            # Metadata dan daftar dependensi Node.js
├── package-lock.json                       # Lockfile versi dependensi yang konsisten
├── playwright.config.js                    # Konfigurasi baseURL, testDir, dan reporter Playwright
└── README.md                               # Dokumentasi teknis project


## Matriks & Detail Test Cases (`tests/booking.spec.js`)

Pengujian dibagi menjadi 3 skenario utama yang menguji operasi pembacaan data, pembuatan data baru, hingga siklus hidup data secara menyeluruh (*End-to-End API Flow*):

| Test ID | Nama Skenario | HTTP Method & Endpoint | Autentikasi | Ringkasan Pengujian & Validasi (`Assertions`) |
| :--- | :--- | :--- | :--- | :--- |
| **API-01** | Mengambil daftar seluruh booking | `GET /booking` | Tidak diperlukan | • Memastikan HTTP status code adalah `200 OK`.<br>• Memvalidasi tipe data response berupa `Array`.<br>• Memastikan jumlah ID booking yang dikembalikan tidak kosong (`length > 0`). |
| **API-02** | Membuat data booking baru | `POST /booking` | Tidak diperlukan | • Mengirim payload JSON berisi detail tamu, harga, dan tanggal.<br>• Memastikan HTTP status code adalah `200 OK`.<br>• Memvalidasi keberadaan properti `bookingid` yang baru dibuat.<br>• Mencocokkan isi response (`firstname`, `lastname`, `totalprice`) dengan payload yang dikirim. |
| **API-03** | E2E CRUD Flow (Auth $\rightarrow$ Create $\rightarrow$ Update $\rightarrow$ Delete) | `POST /auth`<br>`POST /booking`<br>`PUT /booking/:id`<br>`DELETE /booking/:id` | Cookie Token (`token=<value>`) | • **Step A (Auth):** Login dengan kredensial admin dan mengekstrak `token` (`200 OK`).<br>• **Step B (Create):** Membuat record booking baru dan menyimpan `bookingid`.<br>• **Step C (Update):** Memperbarui data menggunakan header `Cookie: token=...`, lalu memverifikasi perubahan nilai pada `lastname` dan `totalprice` (`200 OK`).<br>• **Step D (Delete):** Menghapus record uji coba dan memastikan status code `201 Created`. |

---

## Contoh Struktur Payload & Validasi

### 1. Request Payload (`POST /booking`)
```json
{
  "firstname": "Alfa",
  "lastname": "Nashiha",
  "totalprice": 250,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-12-01",
    "checkout": "2026-12-05"
  },
  "additionalneeds": "Breakfast"
}