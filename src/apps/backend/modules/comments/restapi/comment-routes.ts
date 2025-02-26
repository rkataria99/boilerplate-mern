import { accessAuthMiddleware } from '../../access-token';
import { ApplicationRouter } from '../../application';
import CommentController from './comment-controller';

export default class CommentRouter extends ApplicationRouter {
  configure(): void {
    const { router } = this;
    const ctrl = new CommentController();

    router.use(accessAuthMiddleware);

    router.get('/:taskId/comments', (req, res, next) => {
      console.log(`Incoming Request: ${req.method} ${req.url}`);
      ctrl.getComments(req, res, next);
    });

    router.post('/:taskId/comments', (req, res, next) => {
      console.log(`Incoming Request: ${req.method} ${req.url}`);
      ctrl.createComment(req, res, next);
    });

    router.patch('/:taskId/comments/:id', (req, res, next) => {
      console.log(`Incoming Request: ${req.method} ${req.url}`);
      ctrl.updateComment(req, res, next);
    });

    router.delete('/:taskId/comments/:id', (req, res, next) => {
      console.log(`Incoming Request: ${req.method} ${req.url}`);
      ctrl.deleteComment(req, res, next);
    });
  }
}
