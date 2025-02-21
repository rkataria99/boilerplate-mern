import { ApiError, ApiResponse } from '../types';
import { JsonObject } from '../types/common-types';
import { Comment as CommentType } from '../types/comment';
import { getAccessTokenFromStorage } from '../utils/storage-util';
import APIService from './api.service';

export default class CommentService extends APIService {
  addComment = async (taskId: string, text: string): Promise<ApiResponse<CommentType>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      const response = await this.apiClient.post(
        `/tasks/${taskId}/comments`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.token}`,
          },
        },
      );
      return new ApiResponse(response.data as CommentType, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data as JsonObject));
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
      return new ApiResponse(response.data as CommentType[], undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data as JsonObject));
    }
  };

  updateComment = async (commentId: string, text: string): Promise<ApiResponse<CommentType>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      const response = await this.apiClient.patch(
        `/comments/${commentId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.token}`,
          },
        },
      );
      return new ApiResponse(response.data as CommentType, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data as JsonObject));
    }
  };

  deleteComment = async (commentId: string): Promise<ApiResponse<void>> => {
    try {
      const userAccessToken = getAccessTokenFromStorage();
      await this.apiClient.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
      });
      return new ApiResponse(undefined, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data as JsonObject));
    }
  };
}
