'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {foreignKey : 'UserId'})
    }
    static async createProfile(name, birthDate, identityNumber, phoneNumber, UserId) { //!
      try {
        await Profile.create({name, birthDate, identityNumber, phoneNumber, UserId})
        
        return 
      } catch (error) {
        throw error
      }
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Full Name'
        },
        notNull : {
          msg : 'Please fill Full Name'
        }
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Birth Date'
        },
        notNull : {
          msg : 'Please fill Birth Date'
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Phone Number'
        },
        notNull : {
          msg : 'Please fill Phone Number'
        }
      }
    },
    UserId: DataTypes.INTEGER,
    identityNumber : {
      type: DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          msg : 'Please fill Identity Number'
        },
        notNull : {
          msg : 'Please fill Identity Number'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};