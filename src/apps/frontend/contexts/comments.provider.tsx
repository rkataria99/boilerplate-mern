import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import commentService from '../services/comment.services'; // ✅ Import the instance
import { ApiResponse, AsyncError } from '../types';
import { Comment } from '../types/comment';
import useAsync from './async.hook';

type CommentContextType = {
  addComment: (taskId: string, text: string) => Promise<Comment>;
  addCommentError: AsyncError;
  deleteComment: (commentId: string, taskId: string) => Promise<void>; // ✅ Updated to accept `taskId`
  deleteCommentError: AsyncError;
  updateComment: (commentId: string, taskId: string, text: string) => Promise<Comment>; // ✅ Updated to accept `taskId`
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

export const useCommentContext = (): CommentContextType => useContext(CommentContext)!;

const addCommentFn = async (taskId: string, text: string): Promise<ApiResponse<Comment>> =>
  commentService.addComment(taskId, text);

// ✅ Ensure `taskId` is passed when calling `updateComment`
const updateCommentFn = async (commentId: string, taskId: string, text: string): Promise<ApiResponse<Comment>> =>
  commentService.updateComment({ commentId, taskId, text });

// ✅ Ensure `taskId` is passed when calling `deleteComment`
const deleteCommentFn = async (commentId: string, taskId: string): Promise<ApiResponse<void>> =>
  commentService.deleteComment(commentId, taskId);

export const CommentProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);

  const getCommentsFn = async (taskId: string): Promise<ApiResponse<Comment[]>> => {
    const response = await commentService.getComments(taskId);
    setCommentsList(Array.isArray(response.data) ? response.data : []);
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

  // ✅ Updated `handleDeleteComment` to include `taskId`
  const handleDeleteComment = async (commentId: string, taskId: string) => {
    try {
      await deleteComment(commentId, taskId);
      setCommentsList((prevComments) =>
        Array.isArray(prevComments) ? prevComments.filter((comment) => comment.id !== commentId) : []
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
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
