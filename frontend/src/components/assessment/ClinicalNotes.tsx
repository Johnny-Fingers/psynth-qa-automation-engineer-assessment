import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { assessmentService } from '../../services/api';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import type { ClinicalNote, NoteCreate } from '../../types/note';

interface Props {
  assessmentId: string;
  notes: ClinicalNote[];
  onNoteAdded: (updatedNotes: ClinicalNote[]) => void;
}

export const ClinicalNotes: React.FC<Props> = ({ assessmentId, notes, onNoteAdded }) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsSubmitting(true);
    try {
      const noteData: NoteCreate = { content: newNote, author: 'Dr. Current User' };
      const updatedAssessment = await assessmentService.addNote(assessmentId, noteData);
      onNoteAdded(updatedAssessment.clinicalNotes);
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <User className="h-4 w-4" />
          Clinical Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {/* Scrollable Note List */}
        <div className="scrollbar-thin max-h-75 min-h-35 flex-1 space-y-4 overflow-y-auto pr-2">
          {notes.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground text-xs italic">No notes recorded.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="border-border relative border-l pb-1 pl-4">
                <div className="bg-primary absolute top-1.5 -left-[3.5px] h-1.5 w-1.5 rounded-full" />
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-foreground text-xs font-semibold">{note.author}</span>
                  <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{note.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="border-border/50 space-y-2 border-t pt-2">
          <Textarea
            placeholder="Add a clinical observation..."
            className="bg-muted/30 min-h-20 resize-none text-xs"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote.trim() || isSubmitting}
              className="h-7 px-3 text-xs"
            >
              {isSubmitting ? 'Saving...' : 'Add Note'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
