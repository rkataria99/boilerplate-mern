import {
    CreateCommentParams,
    DeleteCommentParams,
    Comment,
    CommentNotFoundError,
    UpdateCommentParams,
  } from '../types';
  
  import CommentRepository from './store/comment-repository';
  
  export default class CommentWriter {
    public static async createComment(params: CreateCommentParams): Promise<Comment> {
      const commentDb = await CommentRepository.create({
        account: params.accountId,
        task: params.taskId,
        content: params.content,
      });
  
      return commentDb.toObject();
    }
  
    public static async updateComment(params: UpdateCommentParams): Promise<Comment> {
      const commentDb = await CommentRepository.findOneAndUpdate(
        { _id: params.commentId, account: params.accountId, task: params.taskId },
        { content: params.content },
        { new: true }
      );
  
      if (!commentDb) {
        throw new CommentNotFoundError(params.commentId);
      }
  
      return commentDb.toObject();
    }
  
    public static async deleteComment(params: DeleteCommentParams): Promise<void> {
      const result = await CommentRepository.deleteOne({
        _id: params.commentId,
        account: params.accountId,
        task: params.taskId,
      });
  
      if (!result.deletedCount) {
        throw new CommentNotFoundError(params.commentId);
      }
    }
  }
  