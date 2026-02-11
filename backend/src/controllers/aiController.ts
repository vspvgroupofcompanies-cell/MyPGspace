import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const handleAIChat = async (req: AuthRequest, res: Response) => {
    const { message } = req.body;
    const userRole = req.user?.role;

    // Simple rule-based AI response logic (can be expanded to real LLM later)
    let response = "";

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        response = "Hello! I am your MyPGspace AI assistant. How can I help you today?";
    } else if (lowerMsg.includes('room') || lowerMsg.includes('bed')) {
        if (userRole === 'owner') {
            response = "You can manage your rooms and bed availability in the 'Rooms & Beds' section. I see we recently added a pencil icon there for quick updates!";
        } else {
            response = "You can view your current room and bed details in your dashboard. If you have any issues, feel free to raise a complaint.";
        }
    } else if (lowerMsg.includes('payment') || lowerMsg.includes('rent')) {
        if (userRole === 'owner') {
            response = "You can track all tenant payments in the 'Payments' section. Would you like me to show you the overdue list?";
        } else {
            response = "You can view your rent history and due amounts in the 'Payments' tab. Ensure you pay before the due date to avoid late fees.";
        }
    } else if (lowerMsg.includes('complaint')) {
        response = "Our complaint system allows tenants to raise issues (anonymously if needed). Owners can track and update the status of these complaints in real-time.";
    } else if (lowerMsg.includes('notice') || lowerMsg.includes('vacate')) {
        if (userRole === 'owner') {
            response = "You can initiate a notice period for tenants in the 'Tenant Management' section. Remember, we have a default 1-month notice policy active.";
        } else {
            response = "To vacate, you must inform the owner. They will initiate a formal 1-month notice period in the system.";
        }
    } else {
        response = "That's a great question! I'm still learning, but I can help you with Rooms, Payments, Complaints, and Tenant Management. Try asking about those!";
    }

    res.json({ response });
};
