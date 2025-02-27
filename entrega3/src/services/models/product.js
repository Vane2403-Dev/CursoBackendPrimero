import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'


const productCollection = "products"; // Corrección del nombre

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false,
});
productSchema.plugin(mongoosePaginate);
export const Product = mongoose.model(productCollection, productSchema);


