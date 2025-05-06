'use strict';
const formatRupiahIDR = require('../helpers/formatRupiah')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Travel, {foreignKey : 'CategoryId'})
    }
    formatDate (input) {
      let dt = input.getDate()
      let mth = input.getMonth()+1
      let yr = input.getFullYear()

      let hr = input.getHours()
      let mnt = input.getMinutes()

      if (dt < 10) {
          dt = `0${dt}`
      }
      if (mth < 10) {
          mth = `0${mth}`
      }
      if (hr < 10) {
          hr = `0${hr}`
      }
      if (mnt < 10) {
          mnt = `0${mnt}`
      }
      let resShow = `${dt}-${mth}-${yr} at ${hr}:${mnt}`
      let resShowEdit = `${yr}-${mth}-${dt}T${hr}:${mnt}`
      
      return {
        resShow,
        resShowEdit
      }
    }
    static async getCategory () {
      try {
        let data = await Category.findAll()
        data.map(el => {
          el.newPrice = formatRupiahIDR(el.price)
        })
        return data
      } catch (error) {
        throw error
      }
    }
    static async getCategoryById(inputId){
      try {
        let data = await Category.findOne({
          where : {
            id : +inputId
          }
        })
        return data
      } catch (error) {
        throw error
      }
    }
    static async createCategory(input) {
      try {
        await Category.create(input)

        return 
      } catch (error) {
        throw error
      }
    }
    static async updateCategory(idCategory, inputBody) {
      try {
        await Category.update(
          inputBody,
          {
            where : {
              id : +idCategory
            }
          }
        )

        return
      } catch (error) {
        throw error
      }
    }
    static async deleteCategory(idCategory) {
      try {

        let dataTravel = await sequelize.models.Travel.findOne({
          where : {
            CategoryId : +idCategory
          }
        })
        if(dataTravel) {
          // throw {name: "validate", msg: `Can't delete data, travel schedule booked by user`}
          throw `Can't delete data, category used by travel schedule`
        }

        let data = await this.getCategoryById(idCategory)

        await Category.destroy({
          where : {
            id : +idCategory
          }
        })
        return
      } catch (error) {
        throw error
      }
    }
  }
  Category.init({
    nameCategory: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Name of Category'
        },
        notNull : {
          msg : 'Please fill Name of Category'
        }
      }
    },
    price: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Price'
        },
        notNull : {
          msg : 'Please fill Price'
        }
      }
    },
    description: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Description'
        },
        notNull : {
          msg : 'Please fill Description'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};