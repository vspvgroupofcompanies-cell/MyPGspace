import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Complaint from '../models/Complaint';
import TenantProfile from '../models/TenantProfile';
import User from '../models/User';

export const createComplaint = async (req: AuthRequest, res: Response) => {
    const { category, description, isAnonymous } = req.body;
    try {
        const complaintData: any = {
            propertyId: req.user?.propertyId,
            category,
            description,
            isAnonymous
        };

        if (!isAnonymous) {
            complaintData.tenantId = req.user?.id;
            // Fetch user and profile to store denormalized names for easier viewing
            const [userDoc, profile] = await Promise.all([
                User.findById(req.user?.id),
                TenantProfile.findOne({ userId: req.user?.id }).populate('roomId')
            ]);

            if (userDoc) {
                complaintData.tenantName = userDoc.name || 'Unknown Tenant';
                complaintData.tenantPhone = userDoc.phone || '';
            }

            if (profile && profile.roomId) {
                complaintData.roomBed = `${(profile.roomId as any).roomNumber} / ${profile.bedCode}`;
            }
        }

        const complaint = new Complaint(complaintData);
        await complaint.save();
        res.status(201).json(complaint);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
    try {
        const complaints = await Complaint.find({ propertyId: req.user?.propertyId }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTenantComplaints = async (req: AuthRequest, res: Response) => {
    try {
        const complaints = await Complaint.find({ tenantId: req.user?.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
