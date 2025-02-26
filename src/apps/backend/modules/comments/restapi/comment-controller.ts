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
import { serializeCommentAsJSON } from './comments-serializer';

export default class CommentController {
  getComments = applicationController(
    async (req: Request<GetAllCommentsParams>, res: Response) => {
      const comments = await CommentService.getCommentsForTask({
        accountId: req.accountId,
        taskId: String(req.params.taskId),
        page: Number(req.query.page),
        size: Number(req.query.size),
      });

      res.status(HttpStatusCodes.OK).send(comments.map(serializeCommentAsJSON));
    }
  );

  createComment = applicationController(
    async (req: Request<CreateCommentParams>, res: Response): Promise<void> => {
      console.log("Create Comment Request Body:", req.body);

      const { userId, content } = req.body;
      const taskId = String(req.params.taskId);

      if (!taskId || !userId || !content) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Missing required fields' });
        return;
      }

      try {
        const comment: Comment = await CommentService.createComment({
          accountId: req.accountId,
          taskId,
          userId,
          content,
        });

        res.status(HttpStatusCodes.CREATED).send(serializeCommentAsJSON(comment));
      } catch (error) {
        console.error("Error creating comment:", error);
        res.status(HttpStatusCodes.SERVER_ERROR).json({ message: 'Failed to create comment' }); // ✅ Fixed status code
      }
    }
  );

  updateComment = applicationController(
    async (req: Request<UpdateCommentParams>, res: Response): Promise<void> => {
      console.log("Update Comment Request Body:", req.body);

      try {
        const comment: Comment = await CommentService.updateComment({
          accountId: req.accountId,
          taskId: String(req.params.taskId),
          commentId: String(req.params.id),
          content: req.body.content,
        });

        res.status(HttpStatusCodes.OK).send(serializeCommentAsJSON(comment));
      } catch (error) {
        console.error("Error updating comment:", error);
        res.status(HttpStatusCodes.SERVER_ERROR).json({ message: 'Failed to update comment' }); // ✅ Fixed status code
      }
    }
  );

  deleteComment = applicationController(
    async (req: Request<DeleteCommentParams>, res: Response): Promise<void> => {
      console.log("Delete Comment Request Body:", req.body);

      try {
        await CommentService.deleteComment({
          accountId: req.accountId,
          taskId: String(req.params.taskId),
          commentId: String(req.params.id),
        });

        res.sendStatus(HttpStatusCodes.NO_CONTENT);
      } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(HttpStatusCodes.SERVER_ERROR).json({ message: 'Failed to delete comment' }); // ✅ Fixed status code
      }
    }
  );
}
