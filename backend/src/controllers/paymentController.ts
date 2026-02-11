import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Payment from '../models/Payment';
import TenantProfile from '../models/TenantProfile';
import User from '../models/User';
import { generateReceiptPDF } from '../utils/pdfGenerator';
import path from 'path';
import fs from 'fs';

export const recordPayment = async (req: AuthRequest, res: Response) => {
    const { tenantId, amountPaid, paymentMode, monthFor } = req.body;

    try {
        const tenantUser = await User.findById(tenantId);
        const tenantProfile = await TenantProfile.findOne({ userId: tenantId }).populate('roomId');

        if (!tenantUser || !tenantProfile) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        const receiptNumber = `RCP-${Date.now()}`;

        const payment = new Payment({
            tenantId,
            amountPaid,
            paymentMode,
            monthFor,
            receiptNumber,
            createdBy: req.user?.id
        });

        const pdfPath = await generateReceiptPDF({
            receiptNumber,
            paymentDate: new Date(),
            tenantName: tenantUser.name,
            roomBed: `${(tenantProfile.roomId as any).roomNumber} / ${tenantProfile.bedCode}`,
            monthFor,
            amountPaid,
            paymentMode
        });

        payment.pdfPath = pdfPath;
        await payment.save();

        tenantProfile.status = 'Paid';
        await tenantProfile.save();

        res.status(201).json(payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getPaymentsByTenant = async (req: AuthRequest, res: Response) => {
    try {
        const payments = await Payment.find({ tenantId: req.params.tenantId }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const downloadReceipt = async (req: AuthRequest, res: Response) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);
        if (!payment || !payment.pdfPath) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        const filePath = path.join(__dirname, '../../', payment.pdfPath);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ message: 'File not found on server' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
