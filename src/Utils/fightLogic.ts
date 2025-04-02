import { FightParticipant } from '../Redux/fightSlice';

/**
 * Checks if all participants in a team are defeated (HP <= 0).
 * @param teamParticipants Array of participants in the team.
 * @returns True if all participants are defeated, false otherwise.
 */
const isTeamDefeated = (teamParticipants: FightParticipant[]): boolean => {
  return teamParticipants.every(p => p.hp <= 0);
};

/**
 * Checks if the fight has ended based on the state of the participants.
 * @param participantsTeam1 Array of participants in team 1.
 * @param participantsTeam2 Array of participants in team 2.
 * @param team1Id ID of team 1.
 * @param team2Id ID of team 2.
 * @param team1Name Name of team 1.
 * @param team2Name Name of team 2.
 * @returns An object with the winnerTeamId and reason if the fight ended, otherwise null.
 */
export const checkFightEnd = (
    participantsTeam1: FightParticipant[],
    participantsTeam2: FightParticipant[],
    team1Id: string | null,
    team2Id: string | null,
    team1Name: string | null,
    team2Name: string | null
): { winnerTeamId: string | null; reason: string } | null => {

  const team1Defeated = isTeamDefeated(participantsTeam1);
  const team2Defeated = isTeamDefeated(participantsTeam2);

  if (team1Defeated && team2Defeated) {
    return { winnerTeamId: null, reason: 'Mutual Annihilation! Both teams were defeated.' };
  } else if (team1Defeated) {
    return { winnerTeamId: team2Id, reason: `${team2Name || 'Team 2'} wins! ${team1Name || 'Team 1'} was defeated.` };
  } else if (team2Defeated) {
    return { winnerTeamId: team1Id, reason: `${team1Name || 'Team 1'} wins! ${team2Name || 'Team 2'} was defeated.` };
  }

  // Fight continues
  return null;
};

/**
 * Placeholder for damage calculation logic.
 * @param attacker The attacking participant.
 * @param defender The defending participant.
 * @returns The calculated damage amount.
 */
export const calculateDamage = (attacker: FightParticipant, defender: FightParticipant): number => {
    // Basic attack calculation (replace with more detailed logic later)
    // Consider attacker stats (attack, weapon skills), weapon stats, defender stats (defense/stamina?)
    console.log(`Calculating damage: ${attacker.name} vs ${defender.name}`);
    const baseDamage = attacker.stats.attack;
    // Add randomness or defense checks here
    const finalDamage = Math.max(1, baseDamage); // Ensure at least 1 damage
    return finalDamage;
}; 