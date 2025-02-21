import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Button, HeadingLarge } from '../../components';
import { AsyncError } from '../../types';
import { ButtonSize } from '../../types/button';

import CommentModal from './comment-modal';
import useCommentForm from './comments-form.hooks';

interface CommentHeaderProps {
  onError?: (error: AsyncError) => void;
  taskId: string;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ onError, taskId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSuccess = () => {
    toast.success('Comment has been added successfully');
    setIsModalOpen(false);
  };

  const { addCommentFormik } = useCommentForm({
    onError,
    onSuccess,
    taskId,  // Add taskId to the useCommentForm hook
  });

  return (
    <div className="rounded-sm border border-stroke bg-white p-3 shadow-default">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="pl-2">
          <HeadingLarge>Comments</HeadingLarge>
        </div>
        <div>
          <Button
            onClick={() => setIsModalOpen(!isModalOpen)}
            size={ButtonSize.COMPACT}
            startEnhancer={
              <img src="assets/svg/plus-icon.svg" alt="Plus Icon" />
            }
          >
            Add Comment
          </Button>
        </div>
        <CommentModal
          formik={addCommentFormik}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          btnText={'Add Comment'}
        />
      </div>
    </div>
  );
};

export default CommentHeader;
