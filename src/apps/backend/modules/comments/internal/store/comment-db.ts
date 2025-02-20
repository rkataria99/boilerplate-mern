import { Schema, Types } from 'mongoose';

export interface CommentDB {
  _id: Types.ObjectId;
  account: Types.ObjectId;
  task: Types.ObjectId;
  active: boolean;
  content: string;
}

export const CommentDbSchema = new Schema<CommentDB>(
  {
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      index: true,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'comments',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);
