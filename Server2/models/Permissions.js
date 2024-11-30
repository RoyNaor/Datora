module.exports = (sequelize, DataTypes) => {
    const Permissions = sequelize.define("Permissions", {
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

    Permissions.associate = (models) => {
        Permissions.belongsToMany(models.Roles, {
            through: "Role_Permissions",
            as: "roles",
            foreignKey: "permission_id",
        });
    };

    return Permissions;
};
