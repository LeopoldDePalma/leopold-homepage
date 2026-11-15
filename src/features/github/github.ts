import {unstable_rethrow} from 'next/navigation';
import * as z from 'zod/mini';

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

const levelSchema = z.enum([
  'NONE',
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
]);

const daySchema = z.object({
  date: z.string(),
  weekday: z.number(),
  contributionCount: z.number(),
  contributionLevel: levelSchema,
});

const weekSchema = z.object({contributionDays: z.array(daySchema)});

const calendarSchema = z.object({totalContributions: z.number(), weeks: z.array(weekSchema)});

// GraphQL answers 200 with `data: null` and `errors` when the query fails.
const responseSchema = z.object({
  data: z.optional(
    z.nullable(
      z.object({
        viewer: z.object({
          contributionsCollection: z.object({contributionCalendar: calendarSchema}),
        }),
      }),
    ),
  ),
  errors: z.optional(z.array(z.object({message: z.string()}))),
});

export type ContributionLevel = z.infer<typeof levelSchema>;
export type ContributionDay = z.infer<typeof daySchema>;
export type ContributionWeek = z.infer<typeof weekSchema>;
export type ContributionCalendar = z.infer<typeof calendarSchema>;

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

    const {data, errors} = responseSchema.parse(await response.json());

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
