import { Router } from 'express';
import { getRooms, getRoom, createRoom, updateRoom, updateBedStatus } from '../controllers/roomController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getRooms);
router.get('/:id', authenticate, getRoom);
router.post('/', authenticate, authorize(['owner']), createRoom);
router.patch('/:id', authenticate, authorize(['owner']), updateRoom);
router.patch('/beds/status', authenticate, authorize(['owner']), updateBedStatus);

export default router;
