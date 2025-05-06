'use strict';
const pdf = require("pdf-node");
const fs = require("fs");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {foreignKey : 'UserId'})
      Transaction.belongsTo(models.Travel, {foreignKey : 'TravelId'})
    }
    static async getTransactionUserTravel (userId) {
      try {
        let data = await Transaction.findAll({
          include : [sequelize.models.User,sequelize.models.Travel],
          where : {
            UserId : +userId
          }
        })
        return data
      } catch (error) {
        throw error
      }
    }
    static async createTransaction (inputObj, capacity) {
      try {

        if (+capacity < inputObj.quantityOrder) {
          throw `Total Seat not available`
        }
        
        await Transaction.create(inputObj)

        return
      } catch (error) {
        throw error
      }
    }
    static async exportPdf(inputArrOfObj,userId){
      try {
          let html = fs.readFileSync("./views/template.html", "utf8")
          let options = {
              format: "A3",
              orientation: "portrait",
              border: "10mm",
              header: {
                  height: "45mm",
                  contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
              },
              footer: {
                  height: "28mm",
                  contents: {
                      first: 'Cover page',
                      2: 'Second page', // Any page number is working. 1-based index
                      default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                      last: 'Last Page'
                  }
              }
          }
        
          let document = {
              html: html,
              data: {
                // users: users, //! input data disini array of object
                users: inputArrOfObj, //! input data disini array of object
              },
              path: `./outputs/output_user_id_${userId}.pdf`, //! path output
              type: "pdf",
          }

          //! to execute package
          pdf(document, options)
          .then((res) => {
              console.log(res);
          })
          .catch((error) => {
              console.error(error);
          });

      } catch (error) {
          throw error
      }
    }
  }
  Transaction.init({
    schedule: DataTypes.DATE,
    totalPrice: DataTypes.INTEGER,
    quantityOrder: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Quantity Order'
        },
        notNull : {
          msg : 'Please fill Quantity Order'
        },
        min : {
          args : 1,
          msg : 'Please fill Quantity Order Minimum 1'
        }
      }
    },
    TravelId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};