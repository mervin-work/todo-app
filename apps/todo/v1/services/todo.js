'use strict';

const models = require('../../../../models');

/**
 * Todo Services
 * 
 */

/**
 * Create a Todo
 * @param {Object} todoObj - The todo object
 * @returns {Promise<Object>} - A Promise that resolves to the created todo object.
 */
const create =  async (todoObj) => {
    return models.Todo.create(todoObj);
};

/**
 * Find All Todo
 * @param {int} offset - Number of items to skip before fetching the current page.
 * @param {int} limit -  Extract the number of items to display default to 10 if not provided).
 * @returns {Array<Object>} - A Promise that resolves to an object containing the paginated todos.
 */
const findAll = async (limit = 10, offset = 0) => {

    const { rows, count} = await models.Todo.findAndCountAll({
        limit, offset,
    })

    return {
        todos : rows,
        count, 
        offset, 
        limit
    };

};

/**
 * Find Todo by its Primary Id
 * @param {int} id - ID of a todo
 * @returns {Promise<Object>} A Promise that resolves to the retrieved todo.
 * @throws {Error} If the todo with the specified ID does not exist.
 */
const findByPk = async (id) => {
    // Check if the todo with the specified ID exists
    const todo = await models.Todo.findByPk(id);
    if(!todo) throw new Error('Todo not found!');

    return todo;
};

/**
 * Update a Todo by its Id
 * @param {id} id = ID of a Todo
 * @param {Object} todoObj - The todo object
 * @returns {Promise<Object>} - A Promise that resolves to the updated todo object.
 * @throws {Error} If the todo with specified ID does not exist.
 */
const update = async(id, todoObj) => {
    // Check if the todo with the specified ID exists
    const todo = await findByPk(id);
  
    return await todo.update(todoObj);

}

/**
 * Delete a todo by its ID.
 *
 * @param {number} todoId - The ID of the todo to delete.
 * @returns {Promise<number>} A Promise.
 * @throws {Error} If the todo with the specified ID does not exist.
 */
const destroy = async(id) => {

    // Check if the todo with the specified ID exists
    const todo = await findByPk(id);
    
    return await todo.destroy();

}

module.exports = {
    create, update, findAll, findByPk, destroy
}