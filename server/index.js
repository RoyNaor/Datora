const express = require('express');
const app = express();
const cors = require('cors');

const db = require('./models');

// Middleware for CORS
app.use(cors({
    origin: '*', // Allow all origins
    methods: 'GET,POST,PUT', // Allow specific methods
    allowedHeaders: 'Content-Type,Authorization,accessToken' // Allow specific headers
}));

// Middleware for parsing JSON bodies
app.use(express.json()); // Add this line

// Routers
const usersRouter = require('./routes/Users');
app.use('/auth', usersRouter);

const rolesRouter = require('./routes/Roles');
app.use("/roles", rolesRouter);

// Sync Database and Start Server
db.sequelize.sync().then(() => {
    app.listen(3002, () => {
        console.log('Server is running on port 3002');
    });
}).catch((err) => {
    console.error('Error syncing database:', err);
});






























// const rolesRouter = require('./routes/Roles');
// app.use('/roles', rolesRouter);

// const permissionsRouter = require('./routes/Permissions');
// app.use('/permissions', permissionsRouter);

// const rolePermissionsRouter = require('./routes/Role_Permissions');
// app.use('/role_permissions', rolePermissionsRouter);