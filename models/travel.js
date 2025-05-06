'use strict';
const formatRupiahIDR = require('../helpers/formatRupiah')
const { Op } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Travel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Travel.belongsTo(models.Category, {foreignKey : 'CategoryId'})
      Travel.hasMany(models.Transaction, {foreignKey : 'TravelId'})
    }
    get travelStatus () {
      if (this.schedule < new Date()) {
        return 'Not Active'
      } else {
        return `Active`
      }
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
    static async getTravelCategory() {
      try {
        let data = await Travel.findAll({
          include : {
            model : sequelize.models.Category,
            attributes : ['nameCategory','price','description']
          }
        })
        data.map(el => {
          el.Category.newPrice = formatRupiahIDR(el.Category.price)
        })
        return data
      } catch (error) {
        throw error
      }
    }
    static async getTravelCategoryById(inputId) {
      try {
        let data = await Travel.findOne({
          include : {
            model : sequelize.models.Category,
            attributes : ['nameCategory','price','description']
          },
          where : {
            id : +inputId
          }
        })
        data.Category.newPrice = formatRupiahIDR(data.Category.price)
        return data
      } catch (error) {
        throw error
      }
    }
    static async getTravelCategoryActive(inputSearch) { //! untuk show schedule yang aktif2
      try {

        let ops = {
          include : {
            model : sequelize.models.Category,
            attributes : ['nameCategory','price','description']
          },
          where : { //! Condition apabila schedule > current date
            schedule : {
              [Op.gt] : new Date()
            }
          }
        }
        
        
        if(inputSearch) {
          ops.where.airlineName = {
            [Op.iLike] : `%${inputSearch}%`
          }
        }

        let data = await Travel.findAll(ops)

        data.map(el => {
          el.Category.newPrice = formatRupiahIDR(el.Category.price)
        })
        return data
      } catch (error) {
        console.log(error);
        
        throw error
      }
    }
    static async createTravel(input) {
      try {
        await Travel.create(input)
        return 
      } catch (error) {
        throw error
      }
    }
    static async updateTravel(idTravel, inputBody) {
      try {
        await Travel.update(
          inputBody,
          {
            where : {
              id : +idTravel
            }
          }
        )

        return
      } catch (error) {
        throw error
      }
    }
    static async deleteTravel(idTravel) {
      try {

        let data = await this.getTravelCategoryById(idTravel)

        if (data.schedule > new Date()) {
          throw {name: "validate", msg: `Can't delete data, schedule still active.`}
        }

        let dataTransaction = await sequelize.models.Transaction.findOne({
          where : {
            TravelId : +idTravel
          }
        })
        if(dataTransaction) {
          throw {name: "validate", msg: `Can't delete data, travel schedule booked by user`}
        }
        

        await Travel.destroy({
          where : {
            id : +idTravel
          }
        })
        return
      } catch (error) {
        throw error
      }
    }
    static async decrementCapacity (idTravel,quantityOrder) {
      try {
        await Travel.increment(
          {capacity : -1*Number(quantityOrder)},
          {where : {id : +idTravel}}
        )
        return
      } catch (error) {
        throw error
      }
    }
    
    
  }
  Travel.init({
    airlineName: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Airline Name'
        },
        notNull : {
          msg : 'Please fill Airline Name'
        }
      }
    },
    imgUrl: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Image Url'
        },
        notNull : {
          msg : 'Please fill Image Url'
        }
      }
    },
    schedule: {
      type : DataTypes.DATE,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Schedule'
        },
        notNull : {
          msg : 'Please fill Schedule'
        }
      }
    },
    capacity: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Capacity'
        },
        notNull : {
          msg : 'Please fill Capacity'
        },
        max : {
          args : 14,
          msg : 'Please fill under 15 of Capacity'
        }
      }
    },
    CategoryId: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Category'
        },
        notNull : {
          msg : 'Please fill Category'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Travel'
  });
  return Travel;
};