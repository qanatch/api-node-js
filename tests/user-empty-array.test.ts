// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import {Stats} from "node:fs";
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'http://localhost:3000/users';

let userID: number;

test.describe('User management API', () => {

    test('GET / - should return empty when no users', async ({request}) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(StatusCodes.OK);
        const responseBody = await response.json()
        expect(responseBody).toEqual([]);
    });
})