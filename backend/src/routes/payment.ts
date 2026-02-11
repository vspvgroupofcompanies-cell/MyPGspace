import { Router } from 'express';
import { recordPayment, getPaymentsByTenant, downloadReceipt } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['owner']), recordPayment);
router.get('/tenant/:tenantId', authenticate, getPaymentsByTenant);
router.get('/receipt/:paymentId', authenticate, downloadReceipt);

export default router;
