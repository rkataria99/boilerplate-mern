export enum CommentOperationType {
  ADD = 'add',
  EDIT = 'edit',
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export class Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;

  constructor(json: any) {
    this.id = json.id as string;
    this.taskId = json.taskId as string;
    this.userId = json.userId as string;
    this.text = json.text as string;
    this.createdAt = json.createdAt as string;
    this.updatedAt = json.updatedAt as string;
  }
}

export interface CreateCommentParams {
  taskId: string;
  userId: string;
  text: string;
}

export interface UpdateCommentParams {
  commentId: string;
  text: string;
}

export interface DeleteCommentParams {
  commentId: string;
}
