import {unstable_rethrow} from 'next/navigation';

const GRAPHQL_URL = 'https://api.github.com/graphql';
const REVALIDATE_SECONDS = 60 * 60;
const QUERY = `query {
  viewer {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date weekday contributionCount contributionLevel } }
      }
    }
  }
}`;

export type ContributionLevel =
  'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export type ContributionDay = {
  date: string;
  weekday: number;
  contributionCount: number;
  contributionLevel: ContributionLevel;
};

export type ContributionWeek = {contributionDays: ContributionDay[]};

export type ContributionCalendar = {totalContributions: number; weeks: ContributionWeek[]};

type CalendarResponse = {
  data?: {viewer: {contributionsCollection: {contributionCalendar: ContributionCalendar}}} | null;
  errors?: {message: string}[];
};

export const getContributionCalendar = async () => {
  const {GITHUB_TOKEN} = process.env;

  if (!GITHUB_TOKEN) {
    return undefined;
  }

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {Authorization: `Bearer ${GITHUB_TOKEN}`},
      body: JSON.stringify({query: QUERY}),
      cache: 'force-cache',
      next: {revalidate: REVALIDATE_SECONDS},
    });

    if (!response.ok) {
      throw new Error(`GitHub refused the request: ${String(response.status)}`);
    }

    const {data, errors} = (await response.json()) as CalendarResponse;

    if (!data) {
      throw new Error(`GitHub could not answer the query: ${JSON.stringify(errors)}`);
    }

    return data.viewer.contributionsCollection.contributionCalendar;
  } catch (error) {
    unstable_rethrow(error);
    console.error('Could not read the GitHub contributions', error);

    return undefined;
  }
};
