import React, { useState } from 'react';
import { Wand2, Download } from 'lucide-react';
import { assessmentService } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { jsPDF } from 'jspdf';

interface Props {
  assessmentId: string;
  clientName?: string; // Optional: Pass client name for the filename
}

export const NarrativeSection: React.FC<Props> = ({ assessmentId, clientName = 'Client' }) => {
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.getNarrative(assessmentId);
      setNarrative(data.narrative);
    } catch (error) {
      console.error('Failed to generate narrative', error);
    } finally {
      setLoading(false);
    }
  };

  // PDF Generation Logic
  const handleDownloadPdf = () => {
    if (!narrative) return;

    const doc = new jsPDF();

    // 1. Add Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Narrative Summary', 20, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client: ${clientName}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 36);

    // 2. Add Content (Text Wrapping)
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(narrative.replace(/\*\*/g, ''), 170); // Remove markdown ** and wrap at 170mm
    doc.text(splitText, 20, 50);

    // 3. Save
    doc.save(`${clientName.replace(/\s+/g, '_')}_Narrative.pdf`);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p
        key={i}
        className={`text-foreground text-sm leading-relaxed ${line.trim() === '' ? 'h-4' : 'mb-2'}`}
      >
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={j} className="text-primary-700 dark:text-primary-400 font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    ));
  };

  return (
    <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10 h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Wand2 className="text-primary h-5 w-5" />
          Narrative Summary
        </CardTitle>

        {/* Header Actions */}
        <div className="flex gap-2">
          {narrative && (
            <Button
              onClick={handleDownloadPdf}
              variant="outline"
              size="sm"
              className="bg-background/50 hover:bg-background/80 h-8 gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </Button>
          )}

          {!narrative && (
            <Button onClick={handleGenerate} disabled={loading} size="sm" className="h-8">
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {narrative ? (
          <div className="bg-background/80 dark:bg-background/50 border-border/50 animate-in fade-in slide-in-from-bottom-2 rounded-lg border p-6 shadow-sm duration-500">
            {renderFormattedText(narrative)}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                disabled={loading}
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                {loading ? 'Regenerating...' : 'Regenerate'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center">
            <div className="bg-background rounded-full p-3 shadow-sm">
              <Wand2 className="text-muted-foreground/50 h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Ready to Generate</p>
              <p className="text-muted-foreground mx-auto max-w-[250px] text-xs">
                Click the button above to analyze scores and generate a clinical narrative summary.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
