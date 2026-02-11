import { Router } from 'express';
import { createTenant, getTenants, getTenant, updateTenantNotice, cancelTenantNotice } from '../controllers/tenantController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['owner']), createTenant);
router.get('/', authenticate, getTenants);
router.get('/:id', authenticate, getTenant);
router.post('/notice', authenticate, authorize(['owner']), updateTenantNotice);
router.post('/cancel-notice', authenticate, authorize(['owner']), cancelTenantNotice);

export default router;
