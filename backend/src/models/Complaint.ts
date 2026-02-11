import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
    propertyId: string;
    tenantId?: mongoose.Types.ObjectId; // Optional for anonymous
    isAnonymous: boolean;
    category: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Resolved';
    createdAt: Date;
    // Helper fields for easier display if not anonymous
    tenantName?: string;
    roomBed?: string;
    tenantPhone?: string;
}

const ComplaintSchema: Schema = new Schema({
    propertyId: { type: String, required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: 'User' },
    isAnonymous: { type: Boolean, default: false },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    tenantName: { type: String },
    roomBed: { type: String },
    tenantPhone: { type: String }
}, { timestamps: true });

export default mongoose.model<IComplaint>('Complaint', ComplaintSchema);
