import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, ITeam } from '../Types/Game'; // Assuming IUser and ITeam are here
import { checkFightEnd } from '../Utils/fightLogic'; // We'll create this next
import { shuffle } from 'lodash'; // You might need to install lodash: yarn add lodash @types/lodash

export interface FightParticipant extends IUser {}

export interface FightState {
  isActive: boolean;
  team1Id: string | null;
  team2Id: string | null;
  participantsTeam1: FightParticipant[];
  participantsTeam2: FightParticipant[];
  turnOrder: string[]; // Array of participant IUser ids
  currentTurnIndex: number;
  turnCount: number; // How many combat turns have passed in the fight
  combatLog: string[];
  outcome: { winnerTeamId: string | null; reason: string } | null;
  // Store original team info for reference if needed, e.g., for names
  originalTeam1Name: string | null;
  originalTeam2Name: string | null;
}

const initialState: FightState = {
  isActive: false,
  team1Id: null,
  team2Id: null,
  participantsTeam1: [],
  participantsTeam2: [],
  turnOrder: [],
  currentTurnIndex: 0,
  turnCount: 0,
  combatLog: [],
  outcome: null,
  originalTeam1Name: null,
  originalTeam2Name: null,
};

// Helper function to find participant and their team state array
const findParticipantAndTeamArray = (state: FightState, participantId: string): { participant: FightParticipant | undefined, teamArray: 'participantsTeam1' | 'participantsTeam2' | undefined } => {
  let participant = state.participantsTeam1.find(p => p.id === participantId);
  if (participant) return { participant, teamArray: 'participantsTeam1' };
  participant = state.participantsTeam2.find(p => p.id === participantId);
  if (participant) return { participant, teamArray: 'participantsTeam2' };
  return { participant: undefined, teamArray: undefined };
};


const fightSlice = createSlice({
  name: 'fight',
  initialState,
  reducers: {
    startFight: (state, action: PayloadAction<{ team1: ITeam, team2: ITeam }>) => {
      const { team1, team2 } = action.payload;
      state.isActive = true;
      state.team1Id = team1.id;
      state.team2Id = team2.id;
      state.originalTeam1Name = team1.name;
      state.originalTeam2Name = team2.name;
      // Deep clone participants to work with copies during the fight
      state.participantsTeam1 = JSON.parse(JSON.stringify(team1.members));
      state.participantsTeam2 = JSON.parse(JSON.stringify(team2.members));
      state.turnOrder = shuffle([...state.participantsTeam1.map(m => m.id), ...state.participantsTeam2.map(m => m.id)]);
      state.currentTurnIndex = 0;
      state.turnCount = 1;
      state.combatLog = [`Fight started between ${team1.name} and ${team2.name}!`, `--- Turn 1 ---`];
      state.outcome = null;

      // Initial turn announcement
      const firstParticipantId = state.turnOrder[0];
      const { participant: firstParticipant } = findParticipantAndTeamArray(state, firstParticipantId);
      if (firstParticipant && firstParticipant.hp > 0) {
         state.combatLog.push(`It's ${firstParticipant.name}'s turn.`);
      }
       else {
         // If first is somehow already defeated (unlikely), advance turn immediately
         fightSlice.caseReducers.nextTurn(state);
       }
    },
    performAttack: (state, action: PayloadAction<{ attackerId: string; defenderId: string }>) => {
      if (!state.isActive) return;

      const { attackerId, defenderId } = action.payload;
      const { participant: attacker } = findParticipantAndTeamArray(state, attackerId);
      const { participant: defender, teamArray: defenderTeamArray } = findParticipantAndTeamArray(state, defenderId);

      if (!attacker || !defender || !defenderTeamArray) {
        console.error('Attacker or Defender not found in fight state!');
        state.combatLog.push('Error: Invalid attack target.');
        // Optionally advance turn even on error to prevent getting stuck
        // fightSlice.caseReducers.nextTurn(state);
        return;
      }

      // --- Simple Damage Calculation (Placeholder) ---
      const damage = attacker.stats.attack > 0 ? attacker.stats.attack : 1; // Ensure at least 1 damage
      // TODO: Incorporate weapon damage, skills, defense stats later
      // ----------------------------------------------

      // Apply damage - directly modify the participant in the slice state
      // Find the defender in the correct team array and update HP
      const teamToUpdate = state[defenderTeamArray];
      const defenderIndex = teamToUpdate.findIndex(p => p.id === defenderId);
      if (defenderIndex !== -1) {
        teamToUpdate[defenderIndex].hp -= damage;
        if (teamToUpdate[defenderIndex].hp <= 0) {
            teamToUpdate[defenderIndex].hp = 0; // Ensure HP doesn't go negative
            state.combatLog.push(`${attacker.name} attacks ${defender.name} for ${damage} damage. ${defender.name} HP: ${teamToUpdate[defenderIndex].hp}`);
            state.combatLog.push(`${defender.name} has been defeated!`);
        } else {
          state.combatLog.push(`${attacker.name} attacks ${defender.name} for ${damage} damage. ${defender.name} HP: ${teamToUpdate[defenderIndex].hp}`);
        }
      } else {
         console.error("Defender somehow not found in their team array after validation!");
         state.combatLog.push(`Error: Could not apply damage to ${defender.name}.`);
         fightSlice.caseReducers.nextTurn(state); // Advance turn on error
         return;
      }


      // Check for fight end condition
      const endResult = checkFightEnd(state.participantsTeam1, state.participantsTeam2, state.team1Id, state.team2Id, state.originalTeam1Name, state.originalTeam2Name);
      if (endResult) {
        state.outcome = endResult;
        state.isActive = false;
        state.combatLog.push(`Fight ended. ${endResult.reason}`);
      } else {
        // Advance to next turn if fight continues
        fightSlice.caseReducers.nextTurn(state);
      }
    },
    performFlee: (state, action: PayloadAction<{ actorId: string }>) => {
        if (!state.isActive) return;
        const { actorId } = action.payload;
        const { participant: actor, teamArray: actorTeamArray } = findParticipantAndTeamArray(state, actorId);

        if (!actor || !actorTeamArray) {
            console.error('Fleeing actor not found in fight state!');
            state.combatLog.push('Error: Invalid flee attempt.');
            // fightSlice.caseReducers.nextTurn(state);
            return;
        }

        const fleeingTeamName = actorTeamArray === 'participantsTeam1' ? state.originalTeam1Name : state.originalTeam2Name;
        const opponentTeamId = actorTeamArray === 'participantsTeam1' ? state.team2Id : state.team1Id;

        if (state.turnCount >= 3) {
            state.isActive = false;
            // Fleeing means the other team "wins" by default, but the reason indicates fleeing
            state.outcome = { winnerTeamId: opponentTeamId, reason: `${fleeingTeamName || 'A team'} successfully fled!` };
            state.combatLog.push(`${actor.name} initiates a successful retreat for their team!`);
        } else {
            state.combatLog.push(`${actor.name} tries to flee but fails (combat too intense)!`);
            // Failed flee attempt still uses the turn
            fightSlice.caseReducers.nextTurn(state);
        }
    },
    // Internal helper reducer, not meant to be dispatched directly from UI often
    nextTurn: (state) => {
      if (!state.isActive) return;

      let nextIndex = state.currentTurnIndex;
      let nextParticipantFound = false;
      let attempts = 0;

      while (attempts < state.turnOrder.length) {
            nextIndex = (nextIndex + 1) % state.turnOrder.length;
            const nextParticipantId = state.turnOrder[nextIndex];
            const { participant: nextParticipant } = findParticipantAndTeamArray(state, nextParticipantId);

            // Check if this participant is active (HP > 0)
            if (nextParticipant && nextParticipant.hp > 0) {
                nextParticipantFound = true;
                break; // Found the next active participant
            }
            attempts++;
      }

      // If we looped through everyone and found no one active, something is wrong (checkFightEnd should have caught this)
      if (!nextParticipantFound) {
          console.error("NextTurn: Could not find any active participant. Fight should have ended.");
          // Force end the fight as a fallback
          if (!state.outcome) { // Avoid overwriting an existing outcome if possible
             state.isActive = false;
             state.outcome = { winnerTeamId: null, reason: 'Error: All participants defeated unexpectedly.' };
             state.combatLog.push("Error: Fight ended unexpectedly.")
          }
          return;
      }

      // Update the index
      state.currentTurnIndex = nextIndex;

      // Increment turn count only when the cycle restarts (index 0)
      if (state.currentTurnIndex === 0) {
        state.turnCount += 1;
         state.combatLog.push(`--- Turn ${state.turnCount} ---`);
      }

      // Announce the turn
      const { participant: currentParticipant } = findParticipantAndTeamArray(state, state.turnOrder[state.currentTurnIndex]);
      if(currentParticipant) {
         state.combatLog.push(`It's ${currentParticipant.name}'s turn.`);
      }

    },
     // This action is intended to be dispatched from your game logic *after* the fight UI is closed
     // and you are ready to apply the HP changes back to the main Redux state.
     // It consumes the results and resets the fight slice.
     applyFightResults: (state) => {
        // The actual logic to update the main character state based on
        // state.participantsTeam1 and state.participantsTeam2 needs to happen
        // *before* dispatching this action, likely using a thunk or in the component
        // that observes the fight outcome.

        // Example of what you might return to the caller (e.g., a thunk)
        // const results = {
        //    outcome: state.outcome,
        //    finalParticipants1: state.participantsTeam1,
        //    finalParticipants2: state.participantsTeam2
        // };

        // Reset the fight state
        Object.assign(state, initialState);
        // return results; // Can't directly return values from reducer like this
    }
  },
});

export const {
    startFight,
    performAttack,
    performFlee,
    // nextTurn, // Generally shouldn't be dispatched directly from UI
    applyFightResults
} = fightSlice.actions;

export default fightSlice.reducer; 