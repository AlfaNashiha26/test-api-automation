const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://restful-booker.herokuapp.com';

// 1. GET Request: Mengambil daftar ID booking
test('API 01 - GET: Mengambil daftar seluruh booking', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/booking`);

  // Verifikasi HTTP Status Code 200 OK
  expect(response.status()).toBe(200);

  // Ubah response menjadi JSON dan pastikan datanya berupa array tidak kosong
  const body = await response.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
  console.log('Total booking ditemukan:', body.length);
});

// 2. POST Request: Membuat data booking baru
test('API 02 - POST: Membuat data booking baru', async ({ request }) => {
  const payload = {
    firstname: 'Alfa',
    lastname: 'Nashiha',
    totalprice: 250,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-12-01',
      checkout: '2026-12-05'
    },
    additionalneeds: 'Breakfast'
  };

  const response = await request.post(`${BASE_URL}/booking`, {
    data: payload
  });

  // Verifikasi status 200 OK & struktur JSON response
  expect(response.status()).toBe(200);
  const body = await response.json();

  expect(body).toHaveProperty('bookingid');
  expect(body.booking.firstname).toBe('Alfa');
  expect(body.booking.lastname).toBe('Nashiha');
  expect(body.booking.totalprice).toBe(250);
  console.log('Booking ID baru berhasil dibuat:', body.bookingid);
});

// 3. End-to-End API Flow: Login Token -> Create -> Update (PUT) -> Delete (DELETE)
test('API 03 - E2E CRUD: Auth Token, Create, Update, dan Delete Booking', async ({ request }) => {
  // A. POST /auth -> Dapatkan token autentikasi
  const authResponse = await request.post(`${BASE_URL}/auth`, {
    data: {
      username: 'admin',
      password: 'password123'
    }
  });
  expect(authResponse.status()).toBe(200);
  const { token } = await authResponse.json();
  expect(token).toBeTruthy();

  // B. POST /booking -> Buat data baru untuk diuji
  const createResponse = await request.post(`${BASE_URL}/booking`, {
    data: {
      firstname: 'Budi',
      lastname: 'Santoso',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-12-10',
        checkout: '2026-12-12'
      },
      additionalneeds: 'Late Checkout'
    }
  });
  const { bookingid } = await createResponse.json();

  // C. PUT /booking/:id -> Update data menggunakan Cookie Token
  const updateResponse = await request.put(`${BASE_URL}/booking/${bookingid}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cookie': `token=${token}`
    },
    data: {
      firstname: 'Budi',
      lastname: 'Santoso Updated',
      totalprice: 300,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-12-10',
        checkout: '2026-12-15'
      },
      additionalneeds: 'Dinner & Breakfast'
    }
  });
  expect(updateResponse.status()).toBe(200);
  const updatedBody = await updateResponse.json();
  expect(updatedBody.lastname).toBe('Santoso Updated');
  expect(updatedBody.totalprice).toBe(300);

  // D. DELETE /booking/:id -> Hapus data yang sudah selesai diuji
  const deleteResponse = await request.delete(`${BASE_URL}/booking/${bookingid}`, {
    headers: {
      'Cookie': `token=${token}`
    }
  });
  expect(deleteResponse.status()).toBe(201);
});