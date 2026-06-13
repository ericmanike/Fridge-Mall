import mongoose,{Schema,Document, Model} from "mongoose";

export interface IProduct extends Document{
    name:string;
    brand:string;
    price:number;
    capacity:string;
    energyRating:string;
    description:string;
    features:string[];
    image:string;
    inStock:boolean;
}
const ProductSchema=new Schema({
    name:{type:String,required:true},
    brand:{type:String,required:true},
    price:{type:Number,required:true},
    capacity:{type:String,required:true},
    energyRating:{type:String,required:true},
    description:{type:String,required:true},
    features:{type:[String],required:true},
    image:{type:String,required:true},
    inStock:{type:Boolean,required:true},
},{
    timestamps:true
})
export default (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>("Product",ProductSchema);