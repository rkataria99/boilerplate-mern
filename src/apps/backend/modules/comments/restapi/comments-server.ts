import { ApplicationServer } from '../../application';
import CommentRouter from './comment-routes';

export default class CommentServer extends ApplicationServer {
  configure(): void {
    const { server } = this;
    const router = new CommentRouter();

    server.use('/tasks', router.router);
  }
}
