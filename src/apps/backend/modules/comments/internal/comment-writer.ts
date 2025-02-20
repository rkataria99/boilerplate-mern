import {
  CreateCommentParams,
  DeleteCommentParams,
  Comment,
  CommentNotFoundError,
  UpdateCommentParams,
} from '../types';

import CommentRepository from './store/comment-repository';
import CommentReader from './comment-reader';
import CommentUtil from './comment-utils';

export default class CommentWriter {
  public static async createComment(params: CreateCommentParams): Promise<Comment> {
    const commentDb = await CommentRepository.create({
      account: params.accountId,
      task: params.taskId,
      content: params.content,
      active: true,
    });

    return CommentUtil.convertCommentDBToComment(commentDb);
  }

  public static async updateComment(params: UpdateCommentParams): Promise<Comment> {
    const commentDb = await CommentRepository.findOneAndUpdate(
      {
        _id: params.commentId,
        account: params.accountId,
        task: params.taskId,
        active: true,
      },
      {
        $set: {
          content: params.content,
        },
      },
      { new: true },
    );

    if (!commentDb) {
      throw new CommentNotFoundError(params.commentId);
    }

    return CommentUtil.convertCommentDBToComment(commentDb);
  }

  public static async deleteComment(params: DeleteCommentParams): Promise<void> {
    const comment = await CommentReader.getCommentForTask({
      accountId: params.accountId,
      taskId: params.taskId,
      commentId: params.commentId,
    });

    await CommentRepository.findOneAndUpdate(
      {
        _id: comment.id,
      },
      {
        $set: {
          active: false,
        },
      },
    );
  }
}
