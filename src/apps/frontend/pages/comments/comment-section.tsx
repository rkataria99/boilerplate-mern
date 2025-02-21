import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  HeadingSmall,
  LabelLarge,
  MenuItem,
  ParagraphSmall,
  Spinner,
  VerticalStackLayout,
} from '../../components';
import { AsyncError } from '../../types';
import { ButtonKind, ButtonSize } from '../../types/button';
import { Comment } from '../../types/comment';

import CommentModal from './comment-modal';
import useCommentForm from './comments-form.hooks';

interface CommentSectionProps {
  handleDeleteComment: (commentId: string) => void;
  isGetCommentsLoading: boolean;
  onError?: (error: AsyncError) => void;
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  handleDeleteComment,
  isGetCommentsLoading,
  onError,
  comments,
}) => {
  const [updateCommentModal, setUpdateCommentModal] = useState(false);
  const navigate = useNavigate();

  const onSuccess = () => {
    toast.success('Comment has been updated successfully');
    setUpdateCommentModal(false);
  };

  const { updateCommentFormik, setFormikFieldValue } = useCommentForm({
    onError,
    onSuccess,
  });

  const handleCommentOperation = (comment: Comment) => {
    setUpdateCommentModal(!updateCommentModal);
    setFormikFieldValue(updateCommentFormik, 'text', comment.text);
    setFormikFieldValue(updateCommentFormik, 'id', comment.id);
  };

  if (isGetCommentsLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <VerticalStackLayout gap={7}>
      {comments.length > 0 && (
        <HeadingSmall>
          Comments ({comments.length >= 10 ? Math.floor(comments.length / 10) : '0'}
          {comments.length % 10})
        </HeadingSmall>
      )}

      {comments.map((comment) => (
        <div
          className="relative rounded-sm border border-stroke bg-white p-9 shadow-default"
          key={comment.id}
        >
          <VerticalStackLayout gap={3}>
            <ParagraphSmall>{comment.text}</ParagraphSmall>
          </VerticalStackLayout>

          <div className="absolute right-4 top-4">
            <MenuItem>
              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleCommentOperation(comment);
                }}
                kind={ButtonKind.SECONDARY}
                size={ButtonSize.DEFAULT}
                startEnhancer={
                  <img src="assets/svg/edit-icon.svg" alt="Edit comment" />
                }
              >
                Edit
              </Button>

              <Button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  handleDeleteComment(comment.id);
                }}
                kind={ButtonKind.SECONDARY}
                size={ButtonSize.DEFAULT}
                startEnhancer={
                  <img src="assets/svg/delete-icon.svg" alt="Delete comment" />
                }
              >
                Delete
              </Button>
            </MenuItem>
          </div>
        </div>
      ))}

      <CommentModal
        formik={updateCommentFormik}
        isModalOpen={updateCommentModal}
        setIsModalOpen={setUpdateCommentModal}
        btnText={'Update Comment'}
      />
    </VerticalStackLayout>
  );
};

export default CommentSection;
