import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

import { HeadingMedium, VerticalStackLayout } from '../../components';
import { useCommentContext } from '../../contexts/comments.provider';
import { AsyncError } from '../../types';

import CommentHeader from './comment-header';
import CommentSection from './comment-section';

interface CommentsProps {
  taskId: string;
}

const Comments: React.FC<CommentsProps> = ({ taskId }) => {
  const onError = (error: AsyncError) => {
    toast.error(error.message);
  };

  const {
    deleteComment,
    getComments,
    isGetCommentsLoading,
    setCommentsList,
    commentsList,
  } = useCommentContext();

  useEffect(() => {
    getComments(taskId).catch((error) => onError(error as AsyncError));
  }, [taskId]);

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId) // Now it matches deleteComment function
      .then(() => {
        setCommentsList(commentsList.filter((comment) => comment.id !== commentId));
      })
      .catch((error) => onError(error as AsyncError));
  };

  return (
    <div className="mx-auto max-w-5xl">
      <VerticalStackLayout gap={7}>
        <HeadingMedium>Comments</HeadingMedium>
        <CommentHeader taskId={taskId} onError={onError} /> {/* ✅ taskId is now correctly passed */}
        <CommentSection
          comments={commentsList}
          isGetCommentsLoading={isGetCommentsLoading}
          handleDeleteComment={handleDeleteComment}
        />
      </VerticalStackLayout>
    </div>
  );
};

export default Comments;
