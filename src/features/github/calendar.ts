import {compact, filter, head, map} from 'lodash-es';

import type {ContributionWeek} from './github';

export const RECENT_WEEKS = 26;
const MIN_WEEKS_PER_LABEL = 3;

const monthOf = (date = '') => date.slice(0, 7);

export const getMonthLabels = (weeks: ContributionWeek[]) => {
  const firstDays = compact(
    map(weeks, ({contributionDays}, column) => {
      const day = head(contributionDays);

      return day && {column, date: day.date};
    }),
  );
  const starts = filter(
    firstDays,
    ({date}, index) => monthOf(date) !== monthOf(firstDays[index - 1]?.date),
  );

  return filter(
    starts,
    ({column}, index) =>
      (starts[index + 1]?.column ?? weeks.length) - column >= MIN_WEEKS_PER_LABEL,
  );
};
