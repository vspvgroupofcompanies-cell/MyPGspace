import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Room from '../models/Room';
import TenantProfile from '../models/TenantProfile';
import Payment from '../models/Payment';

export const getOwnerDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const propertyId = req.user?.propertyId;

        const rooms = await Room.find({ propertyId });
        const tenants = await TenantProfile.find(); // Filter by roomId if needed, but currently TenantProfile doesn't have propertyId directly.
        // Assuming all tenants in the DB belong to this property for now or link via roomId propertyId

        const totalRooms = rooms.length;
        let totalBeds = 0;
        let occupiedBeds = 0;

        rooms.forEach(room => {
            totalBeds += room.beds.length;
            occupiedBeds += room.beds.filter(b => b.status === 'occupied').length;
        });

        const vacantBeds = totalBeds - occupiedBeds;
        const occupiedRooms = rooms.filter(r => r.beds.some(b => b.status === 'occupied')).length;

        const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        const paidTenants = await Payment.find({ monthFor: { $regex: new Date().getFullYear().toString() } });
        const paidTenantsCount = new Set(paidTenants.map(p => p.tenantId.toString())).size;

        // This is a mockup of the stats for now
        res.json({
            totalRooms,
            occupiedRooms,
            totalBeds,
            occupiedBeds,
            vacantBeds,
            feePaidTenants: occupiedBeds, // Mocking
            pendingPayments: 0,
            receiptsGenerated: await Payment.countDocuments()
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
