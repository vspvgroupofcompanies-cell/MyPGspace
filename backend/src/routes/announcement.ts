import { Router } from 'express';
import { createAnnouncement, getAnnouncements } from '../controllers/announcementController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['owner']), createAnnouncement);
router.get('/', authenticate, getAnnouncements);

export default router;
