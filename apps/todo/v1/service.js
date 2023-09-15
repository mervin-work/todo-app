'use strict';

const models = require("../../../models");

/**
 * Add a new todo.
 *
 * @param {Object} todoData - The data for the new todo.
 * @returns {Promise<Object>} A Promise that resolves to the created todo object.
 */
exports.addTodo = (todoData) =>
    models.Todo.create(todoData);

/**
 * Get todos with pagination.
 *
 * @param {Object} queryParams - The query parameters for pagination (limit, offset).
 * @returns {Promise<Object>} A Promise that resolves to an object containing the paginated todos.
 */
exports.getTodos = async (queryParams) => {
    const result = {};

    result.data = await models.Todo.findAll({
        limit: queryParams.limit,
        offset: queryParams.offset
    });

    result.count = result.data.length;

    result.total = await models.Todo.count();

    result.limit = queryParams.limit;
    result.offset = queryParams.offset;

    return result;
};

/**
 * Retrieve a todo by its ID.
 *
 * @param {number} todoId - The ID of the todo to retrieve.
 * @returns {Promise<Object>} A Promise that resolves to the retrieved todo.
 * @throws {Error} If the todo with the specified ID does not exist.
 */
exports.getTodoById = async (todoId) => {
    const todo = await models.Todo.findOne({
        where: {
            id: todoId
        }
    });

    if (!todo) {
        throw new Error('Todo not found');
    }

    return todo;
};
/**
 * Delete a todo by its ID.
 *
 * @param {number} todoId - The ID of the todo to delete.
 * @returns {Promise<number>} A Promise.
 * @throws {Error} If the todo with the specified ID does not exist.
 */
exports.deleteTodoById = async (todoId) => {
    // Check if the todo with the specified ID exists
    const existingTodo = await models.Todo.findByPk(todoId);
    if (!existingTodo) {
        throw new Error('Todo not found');
    }

    // Delete the todo
    return models.Todo.destroy({
        where: {
            id: todoId
        }
    });
};

/**
 * Update a todo by its ID.
 *
 * @param {number} todoId - The ID of the todo to update.
 * @param {Object} todoData - The updated data for the todo.
 * @returns {Promise<Object>} A Promise that resolves to the updated todo data.
 * @throws {Error} If the todo with the specified ID does not exist.
 */
exports.updateTodoById = async (todoId, todoData) => {
    // Check if the todo with the specified ID exists
    const existingTodo = await models.Todo.findByPk(todoId);
    if (!existingTodo) {
        throw new Error('Todo not found');
    }

    // Update the todo
    await models.Todo.update(todoData, {
        where: {
            id: todoId
        }
    });

    // Retrieve the updated todo data
    return models.Todo.findByPk(todoId);
};