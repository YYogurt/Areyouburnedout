import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessageDoc extends Document {
  nickname?: string;
  content: string;
  color: string;
  starSize: number;
  posX: number;
  posY: number;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>(
  {
    nickname: {
      type: String,
      trim: true,
      maxlength: [30, "Nickname must be 30 characters or less"],
      default: "",
    },
    content: {
      type: String,
      required: [true, "Please enter a message"],
      trim: true,
      maxlength: [280, "Message must be 280 characters or less"],
    },
    color: {
      type: String,
      default: "#fbbf24",
    },
    starSize: {
      type: Number,
      default: 30,
    },
    posX: {
      type: Number,
      default: 50,
    },
    posY: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true, // auto-creates createdAt and updatedAt
  }
);

// Prevent model recompilation in development
const Message: Model<IMessageDoc> =
  mongoose.models.Message || mongoose.model<IMessageDoc>("Message", MessageSchema);

export default Message;
