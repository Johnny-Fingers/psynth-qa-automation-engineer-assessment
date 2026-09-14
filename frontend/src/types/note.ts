export interface ClinicalNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface NoteCreate {
  content: string;
  author: string;
}
