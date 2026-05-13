import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportMessage extends Document {
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

const SupportMessageSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SupportMessage || mongoose.model<ISupportMessage>('SupportMessage', SupportMessageSchema);
