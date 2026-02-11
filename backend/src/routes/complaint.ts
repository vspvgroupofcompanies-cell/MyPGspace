import { Router } from 'express';
import { createComplaint, getComplaints, getTenantComplaints, updateComplaintStatus } from '../controllers/complaintController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createComplaint);
router.get('/', authenticate, authorize(['owner']), getComplaints);
router.get('/my-complaints', authenticate, authorize(['tenant']), getTenantComplaints);
router.patch('/:id/status', authenticate, authorize(['owner']), updateComplaintStatus);

export default router;
