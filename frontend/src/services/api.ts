import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import type { Assessment, AssessmentListResponse } from '../types/assessment';
import type { NarrativeResponse } from '../types/narrative';
import type { NoteCreate } from '../types/note';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Interceptors */
/**
 * 1. Request Interceptor: Convert camelCase -> snake_case
 */
api.interceptors.request.use((config) => {
  // Convert query parameters (e.g., assessmentType -> assessment_type)
  if (config.params) {
    config.params = snakecaseKeys(config.params, { deep: true });
  }

  // Convert request body (e.g., { firstName: '...'} -> { first_name: '...'})
  if (config.data && config.headers['Content-Type'] === 'application/json') {
    config.data = snakecaseKeys(config.data, { deep: true });
  }

  return config;
});

/**
 * 2. Response Interceptor: Convert snake_case -> camelCase
 */
api.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'object') {
    // Recursively convert all keys in the response data
    response.data = camelcaseKeys(response.data, { deep: true });
  }

  return response;
});

export const assessmentService = {
  /**
   * Retrieves a list of all assessments, optionally filtered by status.
   * Returns a simplified view suitable for dashboard lists.
   *
   * @param status - (Optional) The status to filter assessments by.
   * Values: 'completed' | 'pending_review' | 'in_progress' | 'cancelled'
   *
   * @returns A promise that resolves to an array of assessment summary objects.
   */
  getAll: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get<AssessmentListResponse[]>('/assessments', { params });

    return response.data;
  },

  /**
   * Fetches the complete details for a single assessment.
   * This includes the full client profile, nested score data (indices, subtests),
   * and the history of clinical notes.
   *
   * @param id - The unique identifier (UUID) of the assessment to retrieve.
   * @returns A promise that resolves to the full Assessment object.
   */
  getById: async (id: string) => {
    const response = await api.get<Assessment>(`/assessments/${id}`);

    return response.data;
  },

  /**
   * Requests the generation of a textual narrative report based on the assessment scores.
   * The backend calculates this summary using the standard score classification rules.
   *
   * @param id - The unique identifier of the assessment.
   * @returns A promise that resolves to an object containing the generated narrative string.
   */
  getNarrative: async (id: string) => {
    const response = await api.get<NarrativeResponse>(`/assessments/${id}/narrative`);

    return response.data;
  },

  /**
   * Appends a new clinical note to a specific assessment.
   * The server will automatically timestamp the note upon creation.
   *
   * @param id - The unique identifier of the assessment to update.
   * @param note - The note object containing the text content and author name.
   * @returns A promise that resolves to the updated Assessment object, including the new note.
   */
  addNote: async (id: string, note: NoteCreate) => {
    const response = await api.post<Assessment>(`/assessments/${id}/notes`, note);

    return response.data;
  },
};
