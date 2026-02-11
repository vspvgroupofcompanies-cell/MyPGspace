import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import TenantProfile from '../models/TenantProfile';
import User from '../models/User';
import Room from '../models/Room';
import bcrypt from 'bcryptjs';

export const createTenant = async (req: AuthRequest, res: Response) => {
    const { name, phone, roomId, bedCode, rentAmount, joiningDate, dueDate, emergencyContact, idProof } = req.body;

    try {
        // 1. Create User account for tenant
        let user = await User.findOne({ phone });
        if (!user) {
            const hashedPassword = await bcrypt.hash('123456', 10); // Default password
            user = new User({
                name,
                phone,
                password: hashedPassword,
                role: 'tenant',
                propertyId: req.user?.propertyId
            });
            await user.save();
        }

        // 2. Update Bed status in Room
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const bed = room.beds.find(b => b.bedCode === bedCode);
        if (!bed || bed.status === 'occupied') {
            return res.status(400).json({ message: 'Bed not available' });
        }

        bed.status = 'occupied';
        bed.tenantId = user._id;
        await room.save();

        // 3. Create Tenant Profile
        const profile = new TenantProfile({
            userId: user._id,
            roomId,
            bedCode,
            rentAmount,
            joiningDate,
            dueDate,
            phone,
            emergencyContact,
            idProof,
            status: 'Paid'
        });

        await profile.save();
        res.status(201).json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTenants = async (req: AuthRequest, res: Response) => {
    try {
        const tenants = await TenantProfile.find().populate('userId', 'name phone');
        res.json(tenants);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTenant = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await TenantProfile.findOne({ userId: req.params.id }).populate('userId', 'name phone').populate('roomId');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateTenantNotice = async (req: AuthRequest, res: Response) => {
    const { profileId, noticeDate, vacatingDate } = req.body;
    try {
        const profile = await TenantProfile.findByIdAndUpdate(profileId, {
            noticeDate,
            vacatingDate,
            isOnNotice: true
        }, { new: true });

        // Also update the room bed status if needed
        if (profile) {
            const room = await Room.findById(profile.roomId);
            if (room) {
                const bed = room.beds.find(b => b.bedCode === profile.bedCode);
                if (bed) {
                    bed.vacatingDate = vacatingDate;
                    await room.save();
                }
            }
        }

        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelTenantNotice = async (req: AuthRequest, res: Response) => {
    const { profileId } = req.body;
    try {
        const profile = await TenantProfile.findByIdAndUpdate(profileId, {
            noticeDate: null,
            vacatingDate: null,
            isOnNotice: false
        }, { new: true });

        // Also clear the room bed status
        if (profile) {
            const room = await Room.findById(profile.roomId);
            if (room) {
                const bed = room.beds.find(b => b.bedCode === profile.bedCode);
                if (bed) {
                    bed.vacatingDate = undefined;
                    await room.save();
                }
            }
        }

        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
