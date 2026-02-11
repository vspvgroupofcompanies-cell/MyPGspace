import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    phone: string;
    role: 'owner' | 'tenant';
    password?: string;
    propertyId: string; // Used to group entities
    isFlightMode?: boolean;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['owner', 'tenant'], required: true },
    password: { type: String, required: true },
    propertyId: { type: String, required: true },
    isFlightMode: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
