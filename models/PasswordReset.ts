import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    },
  },
  { timestamps: true }
);

// Optional: Add a TTL index to automatically delete expired reset tokens
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset: Model<IPasswordReset> =
  mongoose.models.PasswordReset || mongoose.model<IPasswordReset>("PasswordReset", PasswordResetSchema);

export default PasswordReset;
