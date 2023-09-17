'use strict';

require('dotenv').config({ path: '.env.test' });
const chai = require('chai');
const supertest = require('supertest');
const assert = require('assert');
const expect = chai.expect;

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
      assert(response.body.message === 'Nonce hash successfully created');
      assert.ok(response.body.data.nonce);

      nonce = response.body.data.nonce;
    });
  });

  describe('POST /api/v1/auth/signin', () => {

    it('should sign in the user with valid credentials and nonce', (done) => {
      const userData = {
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD,
        nonce: nonce,
      };
      request.post('/api/v1/auth/signin')
        .send(userData)
        .end(function(err, res) {

          if (err) {
            return done(err);
          }
        
          assert(res.body.status);
          assert(res.body.message === 'User successfully signed in');
          assert.ok(res.body.data.access_token);
          assert(res.body.data.ttl === 3600);
    
          jwtAccessToken = res.body.data.access_token;
          done();
        });
    });

    it('should not sign in the user with invalid nonce', (done) => {
      const userData = {
        username: process.env.TEST_USERNAME,
        password: process.env.TEST_PASSWORD,
        nonce: 'invalid',
      };

      request.post('/api/v1/auth/signin')
      .send(userData)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.statusCode).to.equal(httpConstants.HTTP_STATUS_BAD_REQUEST);

        done();
      })

    });

    it('should not sign in the user with invalid credentials',  async () => {

      const nonceResponse = await request.post('/api/v1/auth/nonces');
      nonce = nonceResponse.body.data.nonce;

      const userData = {
        username: 'invalid',
        password: 'invalid',
        nonce: nonce,
      };

      await request.post('/api/v1/auth/signin').send(userData).expect(httpConstants.HTTP_STATUS_UNAUTHORIZED);
    });
  });

  // describe('POST /api/v1/auth/signout', () => {
  //   it('should log out the user', async () => {
  //     await request.post('/api/v1/auth/signout').set('Authorization', jwtAccessToken).expect(httpConstants.HTTP_STATUS_OK);
  //   });
  // });
});