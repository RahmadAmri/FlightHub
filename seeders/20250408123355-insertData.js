'use strict';
const bcryptjs = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  let dataUsers = require('../data/users.json').map(el => {
    delete el.id

    let salt = bcryptjs.genSaltSync(10);
    el.password = bcryptjs.hashSync(el.password, salt);

    el.createdAt = el.updatedAt = new Date()
    return el
  })
  let dataCategories = require('../data/categories.json').map(el => {
    delete el.id
    el.createdAt = el.updatedAt = new Date()
    return el
  })
  let dataProfiles = require('../data/profiles.json').map(el => {
    delete el.id
    el.createdAt = el.updatedAt = new Date()
    return el
  })
  let dataTravels = require('../data/travels.json').map(el => {
    delete el.id
    el.createdAt = el.updatedAt = new Date()
    return el
  })
  let dataTransactions = require('../data/transactions.json').map(el => {
    delete el.id
    el.createdAt = el.updatedAt = new Date()
    return el
  })
   await queryInterface.bulkInsert('Users',dataUsers)
   await queryInterface.bulkInsert('Categories',dataCategories)
   await queryInterface.bulkInsert('Profiles',dataProfiles)
   await queryInterface.bulkInsert('Travels',dataTravels)
   await queryInterface.bulkInsert('Transactions',dataTransactions)
  },

  async down (queryInterface, Sequelize) {
    // Drop in reverse order to respect foreign key constraints
    await queryInterface.bulkDelete('Transactions',null)
    await queryInterface.bulkDelete('Travels',null)
    await queryInterface.bulkDelete('Profiles',null)
    await queryInterface.bulkDelete('Categories',null)
    await queryInterface.bulkDelete('Users',null)
  }
}