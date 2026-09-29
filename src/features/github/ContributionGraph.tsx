import {Flex, Grid, Span, Stack, Text} from '@chakra-ui/react';
import {flatMap, map, takeRight} from 'lodash-es';
import {getFormatter, getTranslations} from 'next-intl/server';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {site} from '@/content/site';

import {getMonthLabels, RECENT_WEEKS} from './calendar';
import type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel,
  ContributionWeek,
} from './github';

const OPACITY: Record<ContributionLevel, number> = {
  NONE: 0.35,
  FIRST_QUARTILE: 0.4,
  SECOND_QUARTILE: 0.6,
  THIRD_QUARTILE: 0.82,
  FOURTH_QUARTILE: 1,
};
const DIAMOND = 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)';

const columns = (count: number) => `repeat(${String(count)}, minmax(0, 1fr))`;

type DayProps = {
  day: ContributionDay;
  first: boolean;
  recent: boolean;
  describe: (day: ContributionDay) => string;
};

const Day = ({day, first, recent, describe}: DayProps) => {
  const placement = {
    gridRowStart: first ? day.weekday + 1 : undefined,
    hideBelow: recent ? undefined : 'sm',
  };

  if (day.contributionLevel === 'NONE') {
    return (
      <Span
        {...placement}
        display="flex"
        alignItems="center"
        justifyContent="center"
        aspectRatio="square"
        opacity={OPACITY.NONE}
        _before={{content: '""', boxSize: '0.5', rounded: 'full', bg: 'fg'}}
      />
    );
  }

  return (
    <Span
      {...placement}
      title={describe(day)}
      aspectRatio="square"
      clipPath={DIAMOND}
      bg="accent"
      opacity={OPACITY[day.contributionLevel]}
    />
  );
};

type MonthLabelsProps = {weeks: ContributionWeek[]} & ({hideBelow: 'sm'} | {hideFrom: 'sm'});

const MonthLabels = async ({weeks, ...visibility}: MonthLabelsProps) => {
  const format = await getFormatter();

  return map(getMonthLabels(weeks), ({column, date}) => (
    <Span key={date} {...visibility} gridColumn={`${String(column + 1)} / span 3`}>
      {format.dateTime(new Date(date), {month: 'short', timeZone: 'UTC'})}
    </Span>
  ));
};

export const ContributionGraph = async ({calendar}: {calendar: ContributionCalendar}) => {
  const t = await getTranslations('ContributionGraph');
  const format = await getFormatter();

  const {weeks, totalContributions} = calendar;
  const oldWeeks = weeks.length - RECENT_WEEKS;
  const summary = t('total', {count: totalContributions});
  const templateColumns = {base: columns(RECENT_WEEKS), sm: columns(weeks.length)};

  const describe = ({date, contributionCount}: ContributionDay) =>
    t('day', {
      count: contributionCount,
      date: format.dateTime(new Date(date), {dateStyle: 'medium', timeZone: 'UTC'}),
    });

  return (
    <Stack gap="3">
      <Flex wrap="wrap" justify="space-between" gap="2" fontFamily="heading">
        <Text>{summary}</Text>
        <ExternalLink href={site.profiles.github.url} variant="muted">
          <Span as="bdi" dir="ltr" lang="en" fontFamily="heading">
            {site.profiles.github.handle}
          </Span>
        </ExternalLink>
      </Flex>
      <Stack gap="1">
        <Grid
          aria-hidden
          templateColumns={templateColumns}
          columnGap="0.75"
          fontFamily="heading"
          textStyle="xs"
          color="fg.muted"
          whiteSpace="nowrap"
        >
          <MonthLabels weeks={weeks} hideBelow="sm" />
          <MonthLabels weeks={takeRight(weeks, RECENT_WEEKS)} hideFrom="sm" />
        </Grid>
        <Grid
          aria-hidden
          templateColumns={templateColumns}
          templateRows="repeat(7, auto)"
          autoFlow="column"
          gap="0.75"
        >
          {flatMap(weeks, ({contributionDays}, week) =>
            map(contributionDays, (day, index) => (
              <Day
                key={day.date}
                day={day}
                first={week === 0 && index === 0}
                recent={week >= oldWeeks}
                describe={describe}
              />
            )),
          )}
        </Grid>
      </Stack>
    </Stack>
  );
};
