import { Router } from 'express';
import { createShow } from '../controllers/adminController';
import { getShows, getShowDetails, bookSeats } from '../controllers/userController';

const router = Router();

// Admin Routes
router.post('/admin/shows', createShow);

// User Routes
router.get('/shows', getShows);
router.get('/shows/:id', getShowDetails);
router.post('/bookings', bookSeats);

export default router;
