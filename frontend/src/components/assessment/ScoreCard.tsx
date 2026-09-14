import React from 'react';
import { Card, CardContent } from '../ui/Card';
import type { ScoreItem } from '../../types/score';

interface Props {
  title: string;
  data: ScoreItem;
  highlight?: boolean;
}

export const ScoreCard: React.FC<Props> = ({ title, data, highlight = false }) => {
  return (
    <Card className="h-full transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
        <div>
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            {title} {data.abbreviation && `(${data.abbreviation})`}
          </h3>

          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-bold tracking-tight ${
                highlight ? 'text-primary' : 'text-foreground'
              }`}
            >
              {data.score}
            </span>
            <span className="text-muted-foreground text-xs font-medium">Standard Score</span>
          </div>
        </div>

        <div className="border-border/50 grid grid-cols-2 gap-y-1 border-t pt-4">
          <div className="text-muted-foreground text-xs">Percentile</div>
          <div className="text-right text-xs font-medium">{data.percentile}th</div>

          <div className="text-muted-foreground text-xs">Classification</div>
          <div className="text-right text-xs font-medium">{data.classification}</div>
        </div>
      </CardContent>
    </Card>
  );
};
