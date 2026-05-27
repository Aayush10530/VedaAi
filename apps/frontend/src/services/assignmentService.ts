import { api } from './api';
import type { Assignment, CreateAssignmentInput, QuestionPaper, ApiResponse } from '@vedaai/shared';

export const assignmentService = {
  async list(): Promise<Assignment[]> {
    const res = await api.get<ApiResponse<Assignment[]>>('/assignments');
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to list assignments');
  },

  async create(data: CreateAssignmentInput): Promise<Assignment> {
    const res = await api.post<ApiResponse<Assignment>>('/assignments', data);
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to create assignment');
  },

  async get(id: string): Promise<Assignment> {
    const res = await api.get<ApiResponse<Assignment>>(`/assignments/${id}`);
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to fetch assignment details');
  },

  async delete(id: string): Promise<void> {
    const res = await api.delete<ApiResponse<{ deletedId: string }>>(`/assignments/${id}`);
    if (!res.data.success) {
      throw new Error(res.data.error || 'Failed to delete assignment');
    }
  },

  async generate(id: string): Promise<{ jobId: string; assignmentId: string }> {
    const res = await api.post<ApiResponse<{ jobId: string; assignmentId: string }>>(`/assignments/${id}/generate`);
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to trigger AI generation');
  },

  async getResult(id: string): Promise<QuestionPaper> {
    const res = await api.get<ApiResponse<QuestionPaper>>(`/assignments/${id}/result`);
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to fetch generated question paper');
  },

  async uploadFile(file: File): Promise<{ fileUrl: string; extractedText: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<ApiResponse<{ fileUrl: string; extractedText: string; filename: string }>>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.error || 'Failed to upload file');
  },
};
