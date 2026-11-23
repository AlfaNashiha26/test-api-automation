const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');
const bookingSchema = require('../schemas/booking-schema.json');

const BASE_URL = 'https://restful-booker.herokuapp.com';
const ajv = new Ajv();

test.describe('API Contract & Negative Testing', () => {
  // 1. JSON Schema Validation
  test('API-04 - SCHEMA: Memvalidasi struktur & tipe data JSON response POST /booking', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/booking`, {
      data: {
        firstname: 'Alfa',
        lastname: 'Nashiha',
        totalprice: 500,
        depositpaid: true,
        bookingdates: {
          checkin: '2026-12-01',
          checkout: '2026-12-05'
        },
        additionalneeds: 'Airport Shuttle'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Kompilasi dan validasi response terhadap booking-schema.json
    const validate = ajv.compile(bookingSchema);
    const isValid = validate(body);

    // Jika gagal, tampilkan detail error schema dari Ajv
    expect(isValid, JSON.stringify(validate.errors)).toBe(true);
  });

  // 2. Negative Test: Auth dengan kredensial salah
  test('API-05 - NEGATIVE: Login POST /auth gagal jika password salah', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth`, {
      data: {
        username: 'admin',
        password: 'password_ngawur_123'
      }
    });

    // Restful-Booker mengembalikan 200 dengan body { reason: "Bad credentials" }
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).not.toHaveProperty('token');
    expect(body.reason).toBe('Bad credentials');
  });

  // 3. Negative Test: Mengambil ID booking yang tidak ada (404 Not Found)
  test('API-06 - NEGATIVE: GET /booking/:id mengembalikan 404 untuk ID tidak terdaftar', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/booking/999999999`);
    expect(response.status()).toBe(404);
  });

  // 4. Negative Test: Update data tanpa Cookie Token (403 Forbidden)
  test('API-07 - NEGATIVE: PUT /booking/:id ditolak (403) tanpa token autentikasi', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/booking/1`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        firstname: 'Hacker',
        lastname: 'Test',
        totalprice: 100,
        depositpaid: false,
        bookingdates: {
          checkin: '2026-12-01',
          checkout: '2026-12-02'
        }
      }
    });

    expect(response.status()).toBe(403);
  });

  // 5. Negative Test: Hapus data dengan token tidak valid (403 Forbidden)
  test('API-08 - NEGATIVE: DELETE /booking/:id ditolak (403) dengan token palsu', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/booking/1`, {
      headers: {
        'Cookie': 'token=token_palsu_tidak_valid'
      }
    });

    expect(response.status()).toBe(403);
  });
});