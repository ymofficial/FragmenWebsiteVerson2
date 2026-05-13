import mongoose, { Schema, Document } from 'mongoose';

export interface IPageContent extends Document {
  pageId: string;
  content: any;
  updatedAt: Date;
}

const PageContentSchema: Schema = new Schema({
  pageId: { type: String, required: true, unique: true },
  content: { type: Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now },
});

delete mongoose.models.PageContent;
export default mongoose.models.PageContent || mongoose.model<IPageContent>('PageContent', PageContentSchema);
