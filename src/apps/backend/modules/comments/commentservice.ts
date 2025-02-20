import CommentReader from './internal/comment-reader';

import {
  CreateCommentParams,
  DeleteCommentParams,
  UpdateCommentParams,
  GetAllCommentsParams,
  Comment,
} from './types';

import CommentWriter from './internal/comment-writer';

export default class CommentService {
  static async createComment(params: CreateCommentParams): Promise<Comment> {
    return CommentWriter.createComment(params);
  }

  static async updateComment(params: UpdateCommentParams): Promise<Comment> {
    return CommentWriter.updateComment(params);
  }

  static async deleteComment(params: DeleteCommentParams): Promise<void> {
    return CommentWriter.deleteComment(params);
  }

  static async getCommentsForTask(params: GetAllCommentsParams): Promise<Comment[]> {
    return CommentReader.getCommentsForTask(params);
  }
}
