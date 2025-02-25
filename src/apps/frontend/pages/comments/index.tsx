import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { HeadingMedium, ParagraphSmall, VerticalStackLayout } from '../../components';
import { useCommentContext } from '../../contexts/comments.provider';
import { AsyncError } from '../../types';
import CommentHeader from './comment-header';
import CommentSection from './comment-section';
import commentService from '../../services/comment.services'; 

const Comments: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [taskDetails, setTaskDetails] = useState<{ title: string; description: string } | null>(null);

  console.log('Rendering Comments Component for Task ID:', taskId);

  const onError = (error: AsyncError) => {
    toast.error(error.message);
  };

  const { deleteComment, getComments, isGetCommentsLoading, setCommentsList, commentsList } =
    useCommentContext();

  useEffect(() => {
    if (taskId) {
      getComments(taskId).catch((error) => onError(error as AsyncError));

      // Fetching task details
      commentService.getTaskById(taskId)
        .then((response) => setTaskDetails(response.data))
        .catch(() => toast.error('Failed to load task details.'));
    }
  }, [taskId]);

  const handleDeleteComment = (commentId: string) => {
    if (!taskId) {
      console.error("Task ID is missing in deleteComment");
      return;
    }

    deleteComment(commentId, taskId) //taskid included
      .then(() => {
        setCommentsList((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      })
      .catch((error) => onError(error as AsyncError));
  };

  return (
    <div className="mx-auto max-w-5xl">
      <VerticalStackLayout gap={7}>
        {taskDetails && (
          <>
            <HeadingMedium>{taskDetails.title}</HeadingMedium>
            <ParagraphSmall>{taskDetails.description}</ParagraphSmall>
          </>
        )}

        {taskId ? (
          <>
            <CommentHeader taskId={taskId} onError={onError} />
            <CommentSection
              comments={commentsList}
              isGetCommentsLoading={isGetCommentsLoading}
              handleDeleteComment={handleDeleteComment} 
            />
          </>
        ) : (
          <p>Task ID not found</p>
        )}
      </VerticalStackLayout>
    </div>
  );
};

export default Comments;
