import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import User from '../models/User';

const router = Router();

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/update-flightmode', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.user?.id, {
            isFlightMode: req.body.isFlightMode
        }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
