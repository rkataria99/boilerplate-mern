import { accessAuthMiddleware } from '../../access-token';
import { ApplicationRouter } from '../../application';
import CommentController from './comment-controller';

export default class CommentRouter extends ApplicationRouter {
  configure(): void {
    const { router } = this;
    const ctrl = new CommentController();

    router.use(accessAuthMiddleware);

    router.get('/', ctrl.getComments);
    router.post('/', ctrl.createComment);
    router.patch('/:id', ctrl.updateComment);
    router.delete('/:id', ctrl.deleteComment);
  }
}
