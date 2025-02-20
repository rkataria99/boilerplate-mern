import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import {
  CreateCommentParams,
  DeleteCommentParams,
  UpdateCommentParams,
  GetAllCommentsParams,
  Comment,
} from '../types';

import CommentService from '../commentservice';
import CommentReader from '../internal/comment-reader';
import { serializeCommentAsJSON } from './comments-serializer';

export default class CommentController {
  getComments = applicationController(
    async (req: Request<GetAllCommentsParams>, res: Response) => {
      const comments = await CommentReader.getCommentsForTask({
        accountId: req.accountId,
        taskId: String(req.query.taskId),
        page: Number(req.query.page),
        size: Number(req.query.size),
      });

      res.status(HttpStatusCodes.OK).send(comments.map(serializeCommentAsJSON));
    }
  );

  createComment = applicationController(
    async (req: Request<CreateCommentParams>, res: Response) => {
      const comment: Comment = await CommentService.createComment({
        accountId: req.accountId,
        taskId: String(req.body.taskId),
        userId: String(req.body.userId),
        content: req.body.content,
      });

      const commentJSON = serializeCommentAsJSON(comment);
      res.status(HttpStatusCodes.CREATED).send(commentJSON);
    }
  );

  updateComment = applicationController(
    async (req: Request<UpdateCommentParams>, res: Response) => {
      const comment: Comment = await CommentService.updateComment({
        accountId: req.accountId,
        taskId: String(req.body.taskId),
        commentId: String(req.params.id),
        content: req.body.content,
      });

      const commentJSON = serializeCommentAsJSON(comment);
      res.status(HttpStatusCodes.OK).send(commentJSON);
    }
  );

  deleteComment = applicationController(
    async (req: Request<DeleteCommentParams>, res: Response) => {
      await CommentService.deleteComment({
        accountId: req.accountId,
        taskId: String(req.body.taskId),
        commentId: String(req.params.id),
      });

      res.sendStatus(HttpStatusCodes.NO_CONTENT);
    }
  );
}
