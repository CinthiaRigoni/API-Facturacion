const express = require('express');
const facturacionRoutes = require('./routes/facturacionRoutes');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/api', facturacionRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
