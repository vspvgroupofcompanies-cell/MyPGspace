import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Room from './models/Room';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Room.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Owner
        const owner = new User({
            name: 'John Owner',
            phone: '9876543210',
            password: hashedPassword,
            role: 'owner',
            propertyId: 'prop_001'
        });
        await owner.save();
        console.log('Owner created');

        // Create some rooms
        const rooms = [
            { roomNumber: '101', sharingType: 2, rentPerBed: 5000 },
            { roomNumber: '102', sharingType: 3, rentPerBed: 4000 },
            { roomNumber: '201', sharingType: 1, rentPerBed: 8000 }
        ];

        for (const r of rooms) {
            const beds = [];
            for (let i = 0; i < r.sharingType; i++) {
                beds.push({
                    bedCode: `${r.roomNumber}${String.fromCharCode(65 + i)}`,
                    status: 'vacant'
                });
            }
            const room = new Room({
                ...r,
                beds,
                propertyId: 'prop_001'
            });
            await room.save();
        }
        console.log('Rooms created');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
