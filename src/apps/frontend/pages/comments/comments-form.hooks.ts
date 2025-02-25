import { FormikProps, useFormik } from 'formik';
import * as Yup from 'yup';

import constant from '../../constants';
import { useCommentContext } from '../../contexts';
import { AsyncError } from '../../types';
import { Comment } from '../../types/comment';

interface CommentFormProps {
  onError?: (error: AsyncError) => void;
  onSuccess?: () => void;
}

const useCommentForm = ({ onError, onSuccess }: CommentFormProps) => {
  const {
    addComment,
    setCommentsList,
    commentsList,
    updateComment,
    isAddCommentLoading,
    isUpdateCommentLoading,
  } = useCommentContext();

  const setFormikFieldValue = (
    formik: FormikProps<Comment>,
    fieldName: keyof Comment,
    data: string,
  ) => {
    formik
      .setFieldValue(fieldName, data)
      .then()
      .catch((err) => {
        onError?.(err as AsyncError);
      });
  };

  const updateCommentFormik = useFormik<Comment>({
    initialValues: {
      id: '',
      taskId: '',
      userId: '',
      text: '',
      createdAt: new Date().toISOString(),
      updatedAt: '',
    },
    validationSchema: Yup.object({
      text: Yup.string()
        .min(constant.COMMENT_MIN_LENGTH, constant.COMMENT_VALIDATION_ERROR)
        .required(constant.COMMENT_VALIDATION_ERROR),
    }),
    onSubmit: (values) => {
      console.log("Updating comment for task:", values.taskId); 
      if (!values.taskId) {
        console.error("Task ID is missing in updateComment");
        onError?.({ message: "Task ID is required for updating comment" } as AsyncError);
        return;
      }

      updateComment(values.id, values.taskId, values.text)
        .then((response) => {
          const newUpdatedComments = commentsList.map((commentData) =>
            commentData.id === values.id ? response : commentData
          );
          setCommentsList(newUpdatedComments);
          onSuccess?.();
        })
        .catch((error) => onError?.(error as AsyncError));
    },
  });

  const addCommentFormik = useFormik<Comment>({
    initialValues: {
      id: '',
      taskId: '',  
      userId: '',
      text: '',
      createdAt: new Date().toISOString(),
      updatedAt: '',
    },
    validationSchema: Yup.object({
      text: Yup.string()
        .min(constant.COMMENT_MIN_LENGTH, constant.COMMENT_VALIDATION_ERROR)
        .required(constant.COMMENT_VALIDATION_ERROR),
    }),
    onSubmit: (values) => {
      console.log("Adding comment for task:", values.taskId); 
      if (!values.taskId) {
        console.error("❌ Task ID is missing in addComment");
        onError?.({ message: "Task ID is required for adding comment" } as AsyncError);
        return;
      }

      addComment(values.taskId, values.text)
        .then((newComment) => {
          setCommentsList([...commentsList, newComment]);
          onSuccess?.();
        })
        .catch((error) => {
          onError?.(error as AsyncError);
        });
    },
  });

  return {
    addCommentFormik,
    isAddCommentLoading,
    isUpdateCommentLoading,
    setFormikFieldValue,
    updateCommentFormik,
  };
};

export default useCommentForm;
