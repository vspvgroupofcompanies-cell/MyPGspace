import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    propertyId: string;
    title: string;
    message: string;
    createdAt: Date;
}

const AnnouncementSchema: Schema = new Schema({
    propertyId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
