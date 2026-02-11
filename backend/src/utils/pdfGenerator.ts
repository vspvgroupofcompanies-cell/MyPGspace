import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateReceiptPDF = async (data: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `receipt_${data.receiptNumber}.pdf`;
        const dirPath = path.join(__dirname, '../../uploads/receipts');

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, fileName);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Header
        doc.fontSize(25).text('MyPGspace', { align: 'center' });
        doc.fontSize(10).text('Premium PG Management', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text('RENT RECEIPT', { align: 'center', underline: true });
        doc.moveDown();

        // Details
        doc.fontSize(12);
        doc.text(`Receipt No: ${data.receiptNumber}`);
        doc.text(`Date: ${new Date(data.paymentDate).toLocaleDateString()}`);
        doc.moveDown();

        doc.text(`Tenant Name: ${data.tenantName}`);
        doc.text(`Room/Bed: ${data.roomBed}`);
        doc.text(`Month For: ${data.monthFor}`);
        doc.moveDown();

        doc.fontSize(14).text(`Amount Paid: ₹${data.amountPaid}`);
        doc.fontSize(12).text(`Payment Mode: ${data.paymentMode}`);
        doc.moveDown();

        doc.text(`PG Name: ${data.pgName || 'D-Square PG'}`);
        doc.text(`Contact: ${data.contact || '+91 9876543210'}`);

        doc.moveDown();
        doc.fillColor('green').text('Status: Paid').fillColor('black');

        doc.moveDown(2);
        doc.fontSize(10).text('This is a computer generated receipt.', { align: 'center', oblique: true });

        doc.end();

        stream.on('finish', () => {
            resolve(`/uploads/receipts/${fileName}`);
        });

        stream.on('error', reject);
    });
};
