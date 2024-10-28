const express = require('express');
const cors = require('cors');
const router = require('./routes/facturacionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors({ origin: 'https://nvo-front.vercel.app/' }));

app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
    console.log("Server in port " + PORT);
});
