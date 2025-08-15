/************************************************************************
 *    Copyright (C) 2025 Code Forge Temple                              *
 *    This file is part of agentic-signal project                       *
 *    See the LICENSE file in the project root for license details.     *
 ************************************************************************/

import {
    GraphQLContext,
    CalendarEventResult
} from '../types.ts';

export const calendarResolvers = {
    gcalendarFetchEvents: async (
        _parent: unknown,
        {query, timeMin, timeMax, maxResults}: {
            query: string,
            timeMin: string,
            timeMax: string,
            maxResults: number
        },
        {services, request}: GraphQLContext
    ): Promise<CalendarEventResult[]> => {
        if (!timeMin || !timeMax) {
            throw new Error("Missing timeMin or timeMax parameter");
        }

        if (!maxResults || maxResults < 1 || maxResults > 250) {
            throw new Error("maxResults must be between 1 and 250");
        }

        const authHeader = request?.headers?.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error("Missing or invalid Authorization header");
        }

        const accessToken = authHeader.substring(7);

        try {
            const results = await services.fetchGcalendarEvents({
                query,
                timeMin,
                timeMax,
                maxResults,
                accessToken
            });

            return results;
        } catch (err) {
            throw new Error(
                typeof err === "object" && err !== null && "message" in err
                    ? (err as Error).message
                    : String(err)
            );
        }
    },
};