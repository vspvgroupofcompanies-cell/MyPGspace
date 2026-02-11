import { Router } from 'express';
import { handleAIChat } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/chat', authenticate, handleAIChat);

export default router;
