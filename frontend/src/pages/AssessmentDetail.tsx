import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { assessmentService } from '../services/api';
import { ClientProfile } from '../components/assessment/ClientProfile';
import { ScoreCard } from '../components/assessment/ScoreCard';
import { NarrativeSection } from '../components/assessment/NarrativeSection';
import { ClinicalNotes } from '../components/assessment/ClinicalNotes';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Assessment } from '../types/assessment';

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (assessmentId: string) => {
    try {
      const data = await assessmentService.getById(assessmentId);
      setAssessment(data);
    } catch (error) {
      console.error('Failed to fetch assessment', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pendingReview':
        return 'warning';
      case 'inProgress':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (loading)
    return (
      <div className="text-muted-foreground flex h-screen items-center justify-center">
        Loading Assessment...
      </div>
    );
  if (!assessment)
    return <div className="text-destructive p-8 text-center">Assessment not found</div>;

  return (
    <div className="animate-in fade-in mx-auto max-w-7xl space-y-8 pb-12 duration-500">
      {/* 1. Header */}
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className="hover:text-primary w-fit pl-0 hover:bg-transparent"
          asChild
        >
          <Link to="/assessments" className="text-muted-foreground flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Assessments
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            {assessment.client.firstName} {assessment.client.lastName}
          </h1>
          <Badge variant={getStatusVariant(assessment.assessment.status)}>
            {assessment.assessment.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* 2. Top Section: Profile & Notes */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="h-full lg:col-span-2">
          <ClientProfile client={assessment.client} assessmentInfo={assessment.assessment} />
        </div>
        <div className="h-full lg:col-span-1">
          <ClinicalNotes
            assessmentId={assessment.id}
            notes={assessment.clinicalNotes}
            onNoteAdded={(updatedNotes) =>
              setAssessment((prev) => (prev ? { ...prev, clinicalNotes: updatedNotes } : null))
            }
          />
        </div>
      </div>

      {/* 3. Middle Section: Cognitive Profile Grid */}
      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-semibold">Cognitive Profile</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <ScoreCard title="Full Scale IQ" data={assessment.scores.fullScaleIq} highlight={true} />
          {assessment.scores.primaryIndices.map((index, i) => (
            <ScoreCard key={i} title={index.name || 'Index'} data={index} />
          ))}
        </div>
      </div>

      {/* 4. Bottom Section: Narrative */}
      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-semibold">Report Generation</h2>
        <NarrativeSection
          assessmentId={assessment.id}
          clientName={`${assessment.client.firstName} ${assessment.client.lastName}`}
        />
      </div>
    </div>
  );
};

export default AssessmentDetail;
