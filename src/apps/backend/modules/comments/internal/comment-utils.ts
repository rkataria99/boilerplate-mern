import { Comment } from '../types';
import { CommentDB } from './store/comment-db';

export default class CommentUtil {
  public static convertCommentDBToComment(commentDb: CommentDB): Comment {
    const comment = new Comment();
    comment.id = commentDb._id.toString();
    comment.account = commentDb.account.toString();
    comment.taskId = commentDb.task.toString();
    comment.content = commentDb.content;
    return comment;
  }
}
