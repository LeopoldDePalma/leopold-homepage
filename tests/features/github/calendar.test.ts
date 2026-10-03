import {last, map, times} from 'lodash-es';

import {getMonthLabels} from '@/features/github/calendar';
import type {ContributionWeek} from '@/features/github/github';

const DAY_MS = 24 * 60 * 60 * 1000;

const buildWeeks = (from: string, days: number) => {
  const weeks: ContributionWeek[] = [];

  times(days, (offset) => {
    const moment = new Date(Date.parse(`${from}T00:00:00Z`) + offset * DAY_MS);
    const day = {
      date: moment.toISOString().slice(0, 10),
      weekday: moment.getUTCDay(),
      contributionCount: 0,
      contributionLevel: 'NONE' as const,
    };

    if (weeks.length === 0 || day.weekday === 0) {
      weeks.push({contributionDays: []});
    }

    last(weeks)?.contributionDays.push(day);
  });

  return weeks;
};

describe('getMonthLabels', () => {
  const weeks = buildWeeks('2025-10-01', 364);

  it('labels the first week and every week whose first day starts a month', () => {
    const labels = getMonthLabels(weeks);

    expect(labels[0]).toEqual({column: 0, date: '2025-10-01'});
    expect(labels[1]).toEqual({column: 5, date: '2025-11-02'});
    expect(labels).toHaveLength(12);
  });

  it('drops a label that would crowd the next one or the end', () => {
    const shortRange = buildWeeks('2025-10-26', 50);

    expect(map(getMonthLabels(shortRange), 'date')).toEqual(['2025-11-02']);
  });
});
