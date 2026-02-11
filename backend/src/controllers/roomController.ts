import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Room from '../models/Room';

export const getRooms = async (req: AuthRequest, res: Response) => {
    try {
        const rooms = await Room.find({ propertyId: req.user?.propertyId });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRoom = async (req: AuthRequest, res: Response) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createRoom = async (req: AuthRequest, res: Response) => {
    const { roomNumber, sharingType, rentPerBed } = req.body;
    try {
        const beds = [];
        for (let i = 0; i < sharingType; i++) {
            beds.push({
                bedCode: `${roomNumber}${String.fromCharCode(65 + i)}`,
                status: 'vacant'
            });
        }

        const room = new Room({
            roomNumber,
            sharingType,
            rentPerBed,
            beds,
            propertyId: req.user?.propertyId
        });

        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBedStatus = async (req: AuthRequest, res: Response) => {
    const { roomId, bedCode, vacatingDate, isPartiallyAvailable, status } = req.body;
    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const bed = room.beds.find(b => b.bedCode === bedCode);
        if (!bed) return res.status(404).json({ message: 'Bed not found' });

        if (vacatingDate !== undefined) bed.vacatingDate = vacatingDate;
        if (isPartiallyAvailable !== undefined) bed.isPartiallyAvailable = isPartiallyAvailable;
        if (status !== undefined) bed.status = status;

        await room.save();
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
