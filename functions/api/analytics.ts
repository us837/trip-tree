import { PLAN_LIMITS } from '../../src/lib/plans';
import type { AnalyticsResponse } from '../../src/lib/types';
import { getSessionUser } from '../../src/server/auth';
import type { Env } from '../../src/server/env';
import { errorJson, json, today } from '../../src/server/http';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await getSessionUser(request, env);
  if (!user) return errorJson('Not signed in', 401);

  const days = PLAN_LIMITS[user.plan].analyticsDays;
  const since = today(days - 1);

  const [views, clicks] = await env.DB.batch<{ day?: string; link_id?: string; count: number }>([
    env.DB.prepare('SELECT day, count FROM page_views WHERE user_id = ? AND day >= ?').bind(user.id, since),
    env.DB.prepare(
      'SELECT link_id, SUM(count) AS count FROM link_clicks WHERE user_id = ? AND day >= ? GROUP BY link_id',
    ).bind(user.id, since),
  ]);

  const viewsByDay = new Map(views.results.map((r) => [r.day!, r.count]));
  const body: AnalyticsResponse = {
    days,
    // Fill in days with no views so the chart has a continuous axis.
    views: Array.from({ length: days }, (_, i) => {
      const day = today(days - 1 - i);
      return { day, count: viewsByDay.get(day) ?? 0 };
    }),
    clicks: Object.fromEntries(clicks.results.map((r) => [r.link_id!, r.count])),
  };
  return json(body);
};
