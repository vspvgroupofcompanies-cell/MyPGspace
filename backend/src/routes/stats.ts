import { Router } from 'express';
import { getOwnerDashboardStats } from '../controllers/dashboardController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/owner', authenticate, authorize(['owner']), getOwnerDashboardStats);

export default router;
