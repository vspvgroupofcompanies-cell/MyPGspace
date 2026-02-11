import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Announcement from '../models/Announcement';

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
    const { title, message } = req.body;
    try {
        const announcement = new Announcement({
            propertyId: req.user?.propertyId,
            title,
            message
        });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
    try {
        const announcements = await Announcement.find({ propertyId: req.user?.propertyId }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
