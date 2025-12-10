import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startCleanupJob } from './utils/cleanup';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Start background jobs
startCleanupJob();

app.use(cors());
app.use(express.json());

import apiRoutes from './routes/apiRoutes';

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

// Routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
