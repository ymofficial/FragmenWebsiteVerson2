import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  brand: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  fragranceNotes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  imageUrls: string[];
  sizes: {
    label: string;
    title: string;
    price: number;
  }[];
  inStock: boolean;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true, default: 'Fragmen' },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // base price
  stockQuantity: { type: Number, required: true, default: 0 },
  category: { type: String, required: true, default: 'Eau de Parfum' },
  fragranceNotes: {
    top:   { type: [String], default: [] },
    heart: { type: [String], default: [] },
    base:  { type: [String], default: [] },
  },
  sizes: {
    type: [{
      label: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true }
    }],
    default: []
  },
  imageUrls: { type: [String], default: [] },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

delete mongoose.models.Product;
export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
