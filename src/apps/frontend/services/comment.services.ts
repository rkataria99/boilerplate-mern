import { ApiError, ApiResponse } from '../types';
import { JsonObject } from '../types/common-types';
import { Comment as CommentType } from '../types/comment';
import { Task as TaskType } from '../types/task';
import { getAccessTokenFromStorage } from '../utils/storage-util';
import APIService from './api.service';

class CommentService extends APIService {
  addComment = async (taskId: string, text: string): Promise<ApiResponse<CommentType>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      const response = await this.apiClient.post(
        `/tasks/${taskId}/comments`,  // ✅ Ensuring consistency
        { text },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.token}`,
          },
        }
      );
      return new ApiResponse(response.data as CommentType, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response?.data as JsonObject));
    }
  };

  getComments = async (taskId: string): Promise<ApiResponse<CommentType[]>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      const response = await this.apiClient.get(`/tasks/${taskId}/comments`, {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
      });
      return new ApiResponse(Array.isArray(response.data) ? response.data : [], undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response?.data as JsonObject));
    }
  };

  updateComment = async ({ commentId, taskId, text }: { commentId: string; taskId: string; text: string }): Promise<ApiResponse<CommentType>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      const response = await this.apiClient.patch(
        `/tasks/${taskId}/comments/${commentId}`,  // ✅ Consistent with `addComment`
        { text },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.token}`,
          },
        }
      );
      return new ApiResponse(response.data as CommentType, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response?.data as JsonObject));
    }
  };

  deleteComment = async (commentId: string, taskId: string): Promise<ApiResponse<void>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      await this.apiClient.delete(`/tasks/${taskId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
      });
      return new ApiResponse(undefined, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response?.data as JsonObject));
    }
  };

  // ✅ Ensured `getTaskById` follows the same structure
  getTaskById = async (taskId: string): Promise<ApiResponse<TaskType>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      const response = await this.apiClient.get(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
      });
      return new ApiResponse(response.data as TaskType, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response?.data as JsonObject));
    }
  };
}

// ✅ Export an instance, not a class
export default new CommentService();
