'use strict';
const bcryptjs = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {foreignKey : 'UserId'})
      User.hasMany(models.Transaction, {foreignKey : 'UserId'})
    }
    static async getUserProfileById (inputId) {
      try {
        return await User.findOne({
          include : {
            model : sequelize.models.Profile
          },
          where : {
            id : +inputId
          }
        })
      } catch (error) {
        throw error
      }
    }
    static async createUser(email, password, role) { //!
      try {

        let data = await this.findUserByEmail(email)
        if(data) {
          throw `Email registered`
        }
        
        await User.create({email, password, role})
        
        let maxIdUser = await User.max('id')
        let newDataUser = await User.findOne({
          where : {
            id : maxIdUser
          }
        })
        
        return newDataUser
      } catch (error) {
        throw error
      }
    }
    static async deleteUserById (inputId) {
      try {
        await User.destroy({
          where : {
            id : +inputId
          }
        })
      } catch (error) {
        throw error
      }
    }
    static async findUserByEmail(inputEmail) {
      try {
        return await User.findOne({
          where : {
            email : inputEmail
          }
        })
      } catch (error) {
        throw error
      }
    }
    static async decryptPassword(inputEmail,inputPassword) {
      try {
        let dataUser = await this.findUserByEmail(inputEmail)
        if(!dataUser) {
          throw {
            name : 'errorEmail',
            msg : `Email not Registered`
          }
        }

        let checkPassword = bcryptjs.compareSync(inputPassword, dataUser.password)
        if(!checkPassword) {
          throw {
            name : 'errorPassword',
            msg : `Password Incorrect`
          }
        }

        let dataUserProfile = await this.getUserProfileById(dataUser.id)

        return {
          checkPassword,
          dataUserProfile
        }
        
      } catch (error) {
        throw error
      }
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Email First!'
        },
        notNull : {
          msg : 'Please fill Email First!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Password First!'
        },
        notNull : {
          msg : 'Please fill Password First!'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Role'
        },
        notNull : {
          msg : 'Please fill Role'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks : {
      beforeCreate(instance) {
        let salt = bcryptjs.genSaltSync(10);
        instance.password = bcryptjs.hashSync(instance.password, salt);
      }
    }
  });
  return User;
};