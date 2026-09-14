import type { Client } from './client';
import type { ClinicalNote } from './note';
import type { Scores } from './score';

export interface AssessmentInfo {
  type: string;
  fullName: string;
  dateAdministered: string;
  examiner: string;
  status: string;
}

export interface Assessment {
  id: string;
  client: Client;
  assessment: AssessmentInfo;
  scores: Scores;
  clinicalNotes: ClinicalNote[];
}

export interface AssessmentListResponse {
  id: string;
  clientName: string;
  assessmentType: string;
  dateAdministered: string;
  status: string;
}
