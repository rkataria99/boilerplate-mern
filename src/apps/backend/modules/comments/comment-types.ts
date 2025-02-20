import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';

export class Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GetAllCommentsParams = {
  taskId: string;
  page?: number;
  size?: number;
};

export type GetCommentParams = {
  commentId: string;
};

export type CreateCommentParams = {
  taskId: string;
  userId: string;
  content: string;
};

export type UpdateCommentParams = {
  commentId: string;
  content: string;
};

export type DeleteCommentParams = {
  commentId: string;
};

export type PaginationParams = {
  page: number;
  size: number;
};

export enum CommentErrorCode {
  NOT_FOUND = 'COMMENT_ERR_01',
}

export class CommentNotFoundError extends ApplicationError {
  code: CommentErrorCode;

  constructor(commentId: string) {
    super(`Comment with commentId ${commentId} not found.`);
    this.code = CommentErrorCode.NOT_FOUND;
    this.httpStatusCode = HttpStatusCodes.NOT_FOUND;
  }
}
