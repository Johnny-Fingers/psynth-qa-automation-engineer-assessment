import React from 'react';
import { User, School, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Client } from '../../types/client';
import type { AssessmentInfo } from '../../types/assessment';

interface Props {
  client: Client;
  assessmentInfo: AssessmentInfo;
}

export const ClientProfile: React.FC<Props> = ({ client, assessmentInfo }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <User className="h-4 w-4" />
          Client Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Full Name
            </p>
            <p className="text-foreground text-sm font-semibold">
              {client.firstName} {client.lastName}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Demographics
            </p>
            <div className="text-foreground flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                {client.ageAtAssessment} yrs
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="flex items-center gap-1.5">
                <School className="text-muted-foreground h-3.5 w-3.5" />
                {client.grade}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              School
            </p>
            <p className="text-foreground text-sm font-medium">{client.school}</p>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Assessment
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                {assessmentInfo.type}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {new Date(assessmentInfo.dateAdministered).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Box */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            Reason for Referral
          </p>
          <div className="bg-muted/50 border-border/50 rounded-md border p-3">
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              "{client.referralReason}"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
