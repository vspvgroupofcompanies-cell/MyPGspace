import mongoose, { Schema, Document } from 'mongoose';

export interface IBed {
    bedCode: string; // e.g., 101A
    status: 'occupied' | 'vacant';
    tenantId?: mongoose.Types.ObjectId;
    vacatingDate?: Date;
    isPartiallyAvailable?: boolean;
}

export interface IRoom extends Document {
    roomNumber: string;
    sharingType: number;
    rentPerBed: number;
    beds: IBed[];
    propertyId: string;
}

const BedSchema: Schema = new Schema({
    bedCode: { type: String, required: true },
    status: { type: String, enum: ['occupied', 'vacant'], default: 'vacant' },
    tenantId: { type: Schema.Types.ObjectId, ref: 'User' },
    vacatingDate: { type: Date },
    isPartiallyAvailable: { type: Boolean, default: false }
});

const RoomSchema: Schema = new Schema({
    roomNumber: { type: String, required: true },
    sharingType: { type: Number, required: true },
    rentPerBed: { type: Number, required: true },
    beds: [BedSchema],
    propertyId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IRoom>('Room', RoomSchema);
