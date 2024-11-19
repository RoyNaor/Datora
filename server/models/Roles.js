module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define("Roles", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });

    Roles.associate = (models) => {
        Roles.hasMany(models.Users, {
            foreignKey: "role_id",
            as: "users",
        });
        Roles.belongsToMany(models.Permissions, {
            through: "Role_Permissions",
            as: "permissions",
            foreignKey: "role_id",
        });
    };

    return Roles;
};
