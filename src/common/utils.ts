import { TournamentTypeEnum } from 'src/tournament/enums/tournament.enum';

export function strToSlug(str: string) {
  str = str.toLowerCase();
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  str = str.replace(/(đ)/g, 'd');
  str = str.replace(/([^0-9a-z-\s])/g, '');
  str = str.replace(/(\s+)/g, '-');
  str = str.replace(/^-+/g, '');
  str = str.replace(/-+$/g, '');
  return str + '-' + makeId(10);
}

function makeId(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const dateToTimeFloat = (date: Date) => {
  const hour = date.getHours();

  const min = date.getMinutes();

  return hour + min / 60;
};

type Tournament = {
  round: number;
  matches: Match[];
};

type Match = {
  teamA: string;
  teamB: string;
};

function interleaveArrays(array1: any[], array2: any[]) {
  const result = [];
  const minLength = Math.min(array1.length, array2.length);

  for (let i = 0; i < minLength; i++) {
    result.push(array1[i], array2[i]);
  }

  result.push(...array1.slice(minLength));
  result.push(...array2.slice(minLength));

  return result;
}

const findTournamentKnockout = (
  tournament: Tournament[],
  currentRound: number,
  restTeam: string[],
  numTeams: number,
): Tournament[] => {
  const totalRounds = Math.ceil(Math.log2(numTeams));
  if (currentRound == totalRounds) return tournament;

  const teams = Array(numTeams)
    .fill(null)
    .map((_, index) => `Đội ${index}`);

  if (currentRound === 0) {
    const matches = [];
    const totalMatchesAtFirstRound = numTeams - 2 ** (totalRounds - 1);

    for (let i = 0; i < totalMatchesAtFirstRound; i++) {
      matches.push({ teamA: teams[2 * i], teamB: teams[2 * i + 1] });
    }

    tournament.push({
      round: currentRound,
      matches,
    });

    const restTeam = teams.slice(totalMatchesAtFirstRound * 2);
    return findTournamentKnockout(tournament, currentRound + 1, restTeam, numTeams);
  } else {
    const winPrevRound = Array(tournament[currentRound - 1].matches.length)
      .fill(null)
      .map((_, index) => `Win round ${currentRound - 1}#${index + 1}`);

    const currentRoundTeams = interleaveArrays(winPrevRound, restTeam);
    const totalMatches = 2 ** (totalRounds - (currentRound + 1));
    const matches = [];
    for (let i = 0; i < totalMatches; i++) {
      matches.push({ teamA: currentRoundTeams[2 * i], teamB: currentRoundTeams[2 * i + 1] });
    }
    tournament.push({
      round: currentRound,
      matches,
    });

    return findTournamentKnockout(tournament, currentRound + 1, [], numTeams);
  }
};

const findTournamentRoundRobin = (tournament: Tournament[], numTeams: number): Tournament[] => {
  const totalRounds = numTeams % 2 === 0 ? numTeams - 1 : numTeams;

  const teams = Array(numTeams)
    .fill(null)
    .map((_, index) => `Đội ${index}`);

  const totalMatchesPerRound = (numTeams * (numTeams - 1)) / (2 * totalRounds);

  for (let round = 0; round < numTeams - 1; round++) {
    const matches: Match[] = [];

    for (let i = 0; i < totalMatchesPerRound; i++) {
      const teamA = teams[i];
      const teamB = teams[numTeams - 1 - i];

      if (teamA !== 'BYE' && teamB !== 'BYE') {
        matches.push({ teamA, teamB });
      }
    }

    tournament.push({ round, matches });

    // Xoay các đội để tạo lịch tiếp theo
    teams.splice(1, 0, teams.pop() as string);
  }

  return tournament;
};

export function createTournament(numTeams: number, type: TournamentTypeEnum) {
  const tournament: Tournament[] = [];

  const result = {
    [TournamentTypeEnum.Knockout]: () => findTournamentKnockout(tournament, 0, [], numTeams),
    [TournamentTypeEnum.RoundRobin]: () => findTournamentRoundRobin(tournament, numTeams),
  };

  return result[type]();
}
