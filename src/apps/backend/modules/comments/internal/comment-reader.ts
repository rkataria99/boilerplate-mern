import {
    GetAllCommentsParams, 
    GetCommentParams,
    Comment,
    CommentNotFoundError,
    PaginationParams,
  } from '../types';
  
  import CommentRepository from './store/comment-repository';
  import CommentUtil from './comment-utils';
  
  export default class CommentReader {
    public static async getCommentForTask(params: GetCommentParams): Promise<Comment> {
      const commentDb = await CommentRepository.findOne({
        _id: params.commentId,
        task: params.taskId,
        active: true,
      });
  
      if (!commentDb) {
        throw new CommentNotFoundError(params.commentId);
      }
  
      return CommentUtil.convertCommentDBToComment(commentDb);
    }
  
    public static async getCommentsForTask(params: GetAllCommentsParams): Promise<Comment[]> { // ✅ Corrected
      const totalCommentsCount = await CommentRepository.countDocuments({
        task: params.taskId,
        active: true,
      });
  
      const paginationParams: PaginationParams = {
        page: params.page ? params.page : 1,
        size: params.size ? params.size : totalCommentsCount,
      };
  
      const startIndex = (paginationParams.page - 1) * paginationParams.size;
  
      const commentsDb = await CommentRepository.find({
        task: params.taskId,
        active: true,
      })
        .limit(paginationParams.size)
        .skip(startIndex);
  
      return commentsDb.map((commentDb) => CommentUtil.convertCommentDBToComment(commentDb));
    }
  }
  