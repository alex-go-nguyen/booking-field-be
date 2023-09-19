import { BaseQuery } from 'src/common/dtos/query.dto';

export type GetTeamsQuery = {
  tournamentId: number;
} & BaseQuery;
