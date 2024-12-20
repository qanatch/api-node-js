// tests/api.spec.ts
import {test, expect} from '@playwright/test';

let baseURL: string = 'http://localhost:3000/users';

let userID: number;

test.beforeAll(async ({ request }) => {
    const response = await request.post(`${baseURL}`);
    const body = await response.json();
    userID = body.id
});


test.describe('User management API', () => {
    test('GET / - should return empty when no users', async ({request}) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    });

    test('GET /:id - should return a user by ID', async ({request}) => {
        const response = await request.get(`${baseURL}` + "/" + userID);
        const responseBody = await response.text()
        console.log(responseBody)
        expect(response.status()).toBe(200);
    });

    test('GET /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.get(`${baseURL}` + "/" + 123)
        expect(response.status()).toBe(404)
    });

    test('POST / - should add a new user', async ({request}) => {
        const response = await request.post(`${baseURL}`);
        const body = await response.json();
        expect.soft(response.status()).toBe(201)
        expect.soft(body.id).toBeDefined()
    });

    test('DELETE /:id - should delete a user by ID', async ({request}) => {
        const response = await request.delete(`${baseURL}` + "/" + userID);
        const responseBody = await response.json();
        console.log(responseBody)
        expect.soft(response.status()).toBe(200)
        expect.soft(responseBody[0].id).toBe(userID)
    });

    test('DELETE /:id - should return 404 if user not found', async ({request}) => {
        const response = await request.delete(`${baseURL}` + "/" + 111);
        const responseBody = await response.json();
        console.log(responseBody)
        expect.soft(response.status()).toBe(404)
      });
});