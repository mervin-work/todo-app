'use strict';

require('dotenv').config({ path: '.env.test' });

const supertest = require('supertest');
const assert = require('assert');
const app = require('../index');
const httpConstants = require('http2').constants;

describe('Auth API', () => {
  let nonce;
  let jwtAccessToken;
  const request = supertest(app);

  describe('POST /api/v1/auth/nonces', () => {
    it('should generate a valid nonce', async () => {
      const response = await request.post('/api/v1/auth/nonces').expect(httpConstants.HTTP_STATUS_CREATED);

      assert(response.body.status);
      assert(response.body.message === 'Successfully created nonce hash');
      assert.ok(response.body.data.nonce);

      nonce = response.body.data.nonce;
    });
  });

  describe('POST /api/v1/auth/signin', () => {
    it('should sign in the user with valid credentials and nonce', async () => {
      const userData = {
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD,
        nonce: nonce,
      };
      console.log(userData);
      const response = await request.post('/api/v1/auth/signin').send(userData).expect(httpConstants.HTTP_STATUS_CREATED);

      assert(response.body.status);
      assert(response.body.message === 'User signed in successfully');
      assert.ok(response.body.data.access_token);
      assert(response.body.data.ttl === 3600);

      jwtAccessToken = response.body.data.access_token;
    });

    it('should not sign in the user with invalid nonce', async () => {
      const userData = {
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD,
        nonce: 'invalid',
      };

      await request.post('/api/v1/auth/signin').send(userData).expect(httpConstants.HTTP_STATUS_BAD_REQUEST);
    });

    it('should not sign in the user with invalid credentials', async () => {
      
      const nonceResponse = await request.post('/api/v1/auth/nonces');
      nonce = nonceResponse.body.data.nonce;

      const userData = {
        username: 'invalid',
        password: 'invalid',
        nonce: nonce,
      };

      await request.post('/api/v1/auth/signin').send(userData).expect(httpConstants.HTTP_STATUS_BAD_REQUEST);
    });
  });

  describe('POST /api/v1/auth/signout', () => {
    it('should log out the user', async () => {
      await request.post('/api/v1/auth/signout').set('Authorization', jwtAccessToken).expect(httpConstants.HTTP_STATUS_OK);
    });
  });
});