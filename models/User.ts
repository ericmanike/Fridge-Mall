import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'agent' | 'admin' | 'moderator';
    walletBalance: number;
    phone?: string;
    code?: string;
    referredBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        role: { type: String, enum: ['user','agent', 'admin', 'moderator'], default: 'user' },
        walletBalance: { type: Number, default: 0.00 },
        phone: { type: String },
        code: { type: String, unique: true },
        referredBy: { type: String },
    },
    { timestamps: true }
);

// Pre-save hook to generate unique referral code
UserSchema.pre('save', async function () {
    if (!this.code) {
        const generateCode = () => {
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            let code = "FM";
            for (let i = 0; i < 6; i++) {
                code += chars[Math.floor(Math.random() * chars.length)];
            }
            return code;
        };

        let code = generateCode();
        let codeExists = true;
        const UserModel = this.constructor as mongoose.Model<IUser>;
        while (codeExists) {
            const existing = await UserModel.findOne({ code });
            if (!existing) {
                codeExists = false;
            } else {
                code = generateCode();
            }
        }
        this.code = code;
    }
});

// Prevent overwrite on model compilation
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
