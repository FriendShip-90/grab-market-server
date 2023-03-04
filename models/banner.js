 module.exports = function ( sequelize, DataTypes){
    const banners = sequelize.define('Banner', {
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull:false
        },
        href:{
            type: DataTypes.STRING(300),
            allowNull:false
        }
    })
    return banners
 }