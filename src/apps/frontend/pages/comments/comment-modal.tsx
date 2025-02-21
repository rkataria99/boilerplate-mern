import { FormikProps } from 'formik';
import React from 'react';

import { Button, FormControl, Input, VerticalStackLayout } from '../../components';
import Modal from '../../components/modal';
import { AsyncError } from '../../types';
import { ButtonKind, ButtonSize, ButtonType } from '../../types/button';
import { Comment } from '../../types/comment';

import useCommentForm from './comments-form.hooks';

interface CommentModalProps {
  btnText: string;
  formik: FormikProps<Comment>;
  isModalOpen: boolean;
  taskId: string;
  onError?: (error: AsyncError) => void;
  onSuccess?: () => void;
  setIsModalOpen: (open: boolean) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  btnText,
  formik,
  isModalOpen,
  taskId,
  onError,
  onSuccess,
  setIsModalOpen,
}) => {
  const { isAddCommentLoading } = useCommentForm({ taskId, onSuccess, onError });

  const handleClick = () => {
    if (isAddCommentLoading) {
      setIsModalOpen(false);
    }
  };

  return (
    <Modal isModalOpen={isModalOpen}>
      <div className="absolute right-1 top-1 sm:right-5 sm:top-5">
        <Button
          onClick={() => setIsModalOpen(false)}
          kind={ButtonKind.TERTIARY}
          startEnhancer={
            <img src="assets/svg/close-icon.svg" alt="close-icon" className="fill-current" />
          }
        />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <VerticalStackLayout gap={5}>
          <FormControl error={formik.touched.text && formik.errors.text} label={'Comment'}>
            <Input
              data-testid="text"
              disabled={isAddCommentLoading}
              error={formik.touched.text && formik.errors.text}
              name="text"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              placeholder="Enter your comment"
              type="text"
              value={formik.values.text}
            />
          </FormControl>
          <Button
            type={ButtonType.SUBMIT}
            onClick={handleClick}
            isLoading={isAddCommentLoading}
            size={ButtonSize.DEFAULT}
            startEnhancer={
              !isAddCommentLoading && <img src="assets/svg/plus-icon.svg" alt="Plus Icon" />
            }
          >
            {btnText}
          </Button>
        </VerticalStackLayout>
      </form>
    </Modal>
  );
};

export default CommentModal;
