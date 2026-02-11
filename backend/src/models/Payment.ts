import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    tenantId: mongoose.Types.ObjectId;
    amountPaid: number;
    paymentDate: Date;
    paymentMode: 'Cash' | 'UPI' | 'Bank';
    monthFor: string; // e.g., "October 2023"
    receiptNumber: string;
    pdfPath?: string;
    createdBy: mongoose.Types.ObjectId; // Owner ID
}

const PaymentSchema: Schema = new Schema({
    tenantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank'], required: true },
    monthFor: { type: String, required: true },
    receiptNumber: { type: String, required: true, unique: true },
    pdfPath: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
