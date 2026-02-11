import mongoose, { Schema, Document } from 'mongoose';

export interface ITenantProfile extends Document {
    userId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    bedCode: string;
    rentAmount: number;
    joiningDate: Date;
    dueDate: number; // Day of month
    status: 'Paid' | 'Due Soon' | 'Overdue';
    phone: string;
    emergencyContact: string;
    idProof: string;
    noticeDate?: Date;
    vacatingDate?: Date;
    isOnNotice?: boolean;
}

const TenantProfileSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    bedCode: { type: String, required: true },
    rentAmount: { type: Number, required: true },
    joiningDate: { type: Date, required: true },
    dueDate: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Due Soon', 'Overdue'], default: 'Paid' },
    phone: { type: String, required: true },
    emergencyContact: { type: String },
    idProof: { type: String },
    noticeDate: { type: Date },
    vacatingDate: { type: Date },
    isOnNotice: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ITenantProfile>('TenantProfile', TenantProfileSchema);
