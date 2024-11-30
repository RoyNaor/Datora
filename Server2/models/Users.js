module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Roles",
                key: "id",
            },
        },
        profile_picture: {
            type: DataTypes.BLOB('long'), 
            allowNull: true, 
        }
    }, {
        timestamps: true, // Enable createdAt and updatedAt as model options
    });

    Users.associate = (models) => {
        Users.belongsTo(models.Roles, {
            foreignKey: "role_id",
            as: "role",
        });
    };

    return Users;
};
