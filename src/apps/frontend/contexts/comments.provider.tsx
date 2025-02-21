import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import CommentService from '../services/comment.services';
import { ApiResponse, AsyncError } from '../types';
import { Comment } from '../types/comment';
import useAsync from './async.hook';

type CommentContextType = {
  addComment: (taskId: string, text: string) => Promise<Comment>;
  addCommentError: AsyncError;
  deleteComment: (commentId: string) => Promise<void>;
  deleteCommentError: AsyncError;
  updateComment: (commentId: string, text: string) => Promise<Comment>;
  updateCommentError: AsyncError;
  getComments: (taskId: string) => Promise<Comment[]>;
  getCommentsError: AsyncError;
  isAddCommentLoading: boolean;
  isDeleteCommentLoading: boolean;
  isUpdateCommentLoading: boolean;
  isGetCommentsLoading: boolean;
  setCommentsList: React.Dispatch<React.SetStateAction<Comment[]>>;
  comments: Comment[];
  commentsList: Comment[];
};

const CommentContext = createContext<CommentContextType | null>(null);

const commentService = new CommentService();

export const useCommentContext = (): CommentContextType => useContext(CommentContext)!;

const addCommentFn = async (taskId: string, text: string): Promise<ApiResponse<Comment>> => 
  commentService.addComment(taskId, text);

const updateCommentFn = async (commentId: string, text: string): Promise<ApiResponse<Comment>> => 
  commentService.updateComment(commentId, text);

const deleteCommentFn = async (commentId: string): Promise<ApiResponse<void>> => 
  commentService.deleteComment(commentId);

export const CommentProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);

  const getCommentsFn = async (taskId: string): Promise<ApiResponse<Comment[]>> => {
    const response = await commentService.getComments(taskId);
    setCommentsList(response.data);
    return response;
  };

  const {
    asyncCallback: getComments,
    error: getCommentsError,
    isLoading: isGetCommentsLoading,
    result: comments,
  } = useAsync(getCommentsFn);

  const {
    asyncCallback: addComment,
    error: addCommentError,
    isLoading: isAddCommentLoading,
  } = useAsync(addCommentFn);

  const {
    asyncCallback: updateComment,
    error: updateCommentError,
    isLoading: isUpdateCommentLoading,
  } = useAsync(updateCommentFn);

  const {
    asyncCallback: deleteComment,
    error: deleteCommentError,
    isLoading: isDeleteCommentLoading,
  } = useAsync(deleteCommentFn);

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setCommentsList((prevComments) => prevComments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <CommentContext.Provider
      value={{
        addComment,
        addCommentError,
        deleteComment: handleDeleteComment,
        deleteCommentError,
        updateComment,
        updateCommentError,
        getComments,
        getCommentsError,
        isAddCommentLoading,
        isDeleteCommentLoading,
        isUpdateCommentLoading,
        isGetCommentsLoading,
        setCommentsList,
        comments,
        commentsList,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
