import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, User } from 'lucide-react';
import { assessmentService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import type { AssessmentListResponse } from '../types/assessment';

const AssessmentList: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.getAll(filterStatus || undefined);
      setAssessments(data);
    } catch (error) {
      console.error('Failed to fetch assessments', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter((a) =>
    a.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const tableHeaders = [
    { key: 'client_name', label: 'Client Name' },
    { key: 'assessmentType', label: 'Type' },
    { key: 'dateAdministered', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action', className: 'text-right' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending_review':
        return 'warning';
      case 'in_progress':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground mt-1">Manage and review psychological assessments</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
          <Input
            placeholder="Search by client name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-50">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending_review">Pending Review</option>
            <option value="in_progress">In Progress</option>
          </Select>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-card rounded-md border">
        {loading ? (
          <div className="text-muted-foreground p-8 text-center">Loading...</div>
        ) : filteredAssessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User className="text-muted-foreground/50 h-12 w-12" />
            <h3 className="mt-4 text-lg font-medium">No assessments found</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                  {tableHeaders.map((header) => (
                    <th
                      key={header.key}
                      className="text-muted-foreground h-12 px-4 text-left align-middle font-medium"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.id} className="hover:bg-muted/50 border-b transition-colors">
                    <td className="p-4 font-medium">{assessment.clientName}</td>
                    <td className="p-4">
                      <Badge variant="outline">{assessment.assessmentType}</Badge>
                    </td>
                    <td className="text-muted-foreground p-4">
                      {new Date(assessment.dateAdministered).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusVariant(assessment.status)}>
                        {assessment.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/assessments/${assessment.id}`}>
                          View <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentList;
