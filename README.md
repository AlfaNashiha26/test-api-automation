# REST API Automation Testing with Playwright

[![Playwright API Tests](https://github.com/AlfaNashiha26/test-api-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlfaNashiha26/test-api-automation/actions/workflows/playwright.yml)

Repository ini berisi kumpulan script *REST API Automation Testing* menggunakan **Playwright (`APIRequestContext`)** dan **JavaScript** untuk menguji layanan API publik [Restful-Booker](https://restful-booker.herokuapp.com/). Eksekusi pengujian terintegrasi otomatis melalui **GitHub Actions**.

---

## Struktur Direktori

```text
├── .github/
│   └── workflows/
│       └── playwright.yml      # Konfigurasi CI/CD GitHub Actions
├── tests/
│   └── booking.spec.js         # Skenario pengujian CRUD & Auth Token API
├── .gitignore                  # Daftar file/folder yang diabaikan Git
├── package.json                # Daftar dependensi project
└── playwright.config.js        # Konfigurasi utama Playwright API