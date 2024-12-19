// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import {ApiClient} from "../src/api-client";

let baseURL: string = 'http://localhost:3000/users';

let userID: number;

// test.beforeAll(async ({ request }) => {
//     const response = await request.post(`${baseURL}`);
//     const body = await response.json();
//     userID = body.id
// });

test.beforeEach(async ({ request }) => {
    // get all users
    const response = await request.get(`${baseURL}`);
    const responseBody = await response.json()
    // get the number of objects in the array returned
    const numberOfObjects = responseBody.length;

    // create an empty array to store all user ID
    let userIDs = [];

    // loop through all users and store their ID in an array
    for (let i = 0; i < numberOfObjects; i++) {
        // get user ID from the response
        let userID = responseBody[i].id;
        // push is used to add elements to the end of an array
        userIDs.push(userID);
    }

    // delete all users in a loop using previously created array
    for (let i = 0; i < numberOfObjects; i++) {
        // delete user by id
        let response = await request.delete(`${baseURL}/${userIDs[i]}`);
        // validate the response status code
        expect.soft(response.status()).toBe(200);
    }

    // verify that all users are deleted
    const responseAfterDelete = await request.get(`${baseURL}`);
    expect(responseAfterDelete.status()).toBe(200);
    const responseBodyEmpty = await responseAfterDelete.text()
    // validate that the response is an empty array
    expect(responseBodyEmpty).toBe('[]');
})

test.describe('User management API', () => {
    test('GET / - should return empty when no users', async ({request}) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        console.log(responseBody)
        expect(responseBody).toEqual('[]');
    });

    test('POST create n users', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        const usersCount = await apiClient.createUsers(5)
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()
        let numberOfObject = responseBody.length
        expect(numberOfObject).toBe(5)
    });

    test('DELETE n users', async ({request}) => {
        const apiClient = await ApiClient.getInstance(request)
        const usersCount = await apiClient.createUsers(5)
        let userIDs = [];
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()

        // get the number of objects in the array returned
        const numberOfObjects = responseBody.length;
        // loop through all users and store their ID in an array
        for (let i = 0; i < usersCount; i++) {
            // get user ID from the response
            let userID = responseBody[i].id;
            // push is used to add elements to the end of an array
            userIDs.push(userID);
        }

        for (let i = 0; i < numberOfObjects; i++) {
            // delete user by id
            let response = await request.delete(`${baseURL}/${userIDs[i]}`);
            // validate the response status code
        }
        //get all users - must be empty
        const expectResponse = await request.get(`${baseURL}`);
        const expectResponseBody = await expectResponse.json()

        expect(expectResponseBody).toStrictEqual([])
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