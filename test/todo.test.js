'use strict';

require('dotenv').config({ path: '.env.test' });

const supertest = require('supertest');
const assert = require('assert');
const app = require('../index');
const request = supertest(app);
const httpConstants = require('http2').constants;
describe('Todo API', () => {
    let nonce;
    let jwtAccessToken;
    let createdTodoId;


    before(async () => {
        // get token here
        const nonceResponse = await request.post('/api/v1/auth/nonces');
        nonce = nonceResponse.body.data.nonce;
        const userData = {
            username: process.env.TEST_USERNAME,
            password: process.env.TEST_PASSWORD,
            nonce: nonce,
        };
        const response = await request.post('/api/v1/auth/signin').send(userData);
        jwtAccessToken = response.body.data.access_token;
    });

    it('should add a new todo', (done) => {
        const todo = {
            data: {
                title: 'Test Todo',
                description: 'This is a test todo',
                completed: false,
                due_date: new Date()
            }
        };

        request
            .post('/api/v1/todos/')
            .set('Authorization', jwtAccessToken)
            .send(todo)
            .expect(httpConstants.HTTP_STATUS_CREATED)
            .end((err, res) => {
                assert(res.body.status === true);
                assert(res.body.message === 'Todo successfully created');
                assert(res.body.data.title === todo.data.title);
                assert(res.body.data.description === todo.data.description);
                assert(res.body.data.completed === todo.data.completed);
                assert(res.body.data.due_date === todo.data.due_date.toISOString());
                createdTodoId = res.body.data.id;
                done(err);
            });
    });

    it('should get all todos', (done) => {
        request
            .get('/api/v1/todos/')
            .set('Authorization', jwtAccessToken)
            .expect(httpConstants.HTTP_STATUS_OK)
            .end((err, res) => {
                assert(res.body.status === true);
                assert(res.body.message === 'Todo successfully retrieved');
                assert(Array.isArray(res.body.data.todos));
                done(err);
            });
    });

    it('should return 1 todo', (done) => {
        request
            .get('/api/v1/todos/?limit=1&offset=0')
            .set('Authorization', jwtAccessToken)
            .expect(httpConstants.HTTP_STATUS_OK)
            .end((err, res) => {
                assert(res.body.status === true);
                assert(res.body.message === 'Todo successfully retrieved');
                assert.strictEqual(typeof res.body.data, 'object', 'The variable should be an object');
                done(err);
            });
    });

    it('should get a todo by id', (done) => {
        request
            .get(`/api/v1/todos/${createdTodoId}`)
            .set('Authorization', jwtAccessToken)
            .expect(httpConstants.HTTP_STATUS_OK)
            .end((err, res) => {
                assert(res.body.status === true);
                assert(res.body.message === 'Todo successfully retrieved');
                assert(res.body.data.id === createdTodoId);
                done(err);
            });
    });

    it('should update a todo by id', (done) => {
        const updatedTodo = {
            data: {
                title: 'Updated Todo',
                description: 'This is an updated todo',
                completed: true,
                due_date: new Date()
            }
        };

        request
            .put(`/api/v1/todos/${createdTodoId}`)
            .set('Authorization', jwtAccessToken)
            .send(updatedTodo)
            .expect(httpConstants.HTTP_STATUS_OK)
            .end((err, res) => {
                assert(res.body.status === true);
                assert(res.body.message === 'Todo successfully updated');
                assert(res.body.data.id === createdTodoId);
                assert(res.body.data.title === updatedTodo.data.title);
                assert(res.body.data.description === updatedTodo.data.description);
                assert(res.body.data.completed === updatedTodo.data.completed);
                done(err);
            });
    });

    it('should delete a todo by id', (done) => {
        request
            .delete(`/api/v1/todos/${createdTodoId}`)
            .set('Authorization', jwtAccessToken)
            .expect(httpConstants.HTTP_STATUS_OK)
            .end((err, res) => {
                done(err);
            });
    });
});
