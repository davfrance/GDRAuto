import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IGame, IRelation, ITeam, ITurn, IUser } from '../../Types/Game';

// Updated IGame interface to include defeated teams
export interface GameState extends IGame {
  defeatedTeams: ITeam[];
}

const initialState: GameState = {
  teams: [],
  defeatedTeams: [], // Initialize defeated teams array
  id: '',
  relations: {},
  history: [],
  turn: {} as ITurn,
};

export const GameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // saveGame needs to handle the new GameState structure
    saveGame: (state, action: PayloadAction<GameState>) => {
      // Ensure defeatedTeams is handled if present in payload, otherwise keep existing
      return { ...initialState, ...action.payload }; 
    },
    saveTeams: (state, action: PayloadAction<ITeam[]>) => {
      state.teams = action.payload;
      state.defeatedTeams = []; // Reset defeated teams when setting new active teams
    },
    saveTeam: (state, action: PayloadAction<ITeam>) => {
      const team = action.payload;
      const existingTeamIndex = state.teams.findIndex(t => t.id === team.id);
      if (existingTeamIndex !== -1) {
        state.teams[existingTeamIndex] = team;
        return;
      }
      // Check if it exists in defeated teams (e.g., reviving? unlikely for now)
      // const existingDefeatedIndex = state.defeatedTeams.findIndex(t => t.id === team.id);
      // if (existingDefeatedIndex === -1) { 
      //    state.teams.push(team); // Add only if not already active or defeated
      // }
    },
    addTurn: (state, action: PayloadAction<ITurn>) => {
      state.history.push(action.payload);
      state.turn = action.payload;
      // Reset Mana/Stamina for ACTIVE teams only
      state.teams.forEach(team => {
        team.members.forEach(member => {
          member.stats.mana = member.stats.mana; // Placeholder reset
          member.stats.stamina = member.stats.stamina; // Placeholder reset
          // console.log(`Reset mana/stamina for ${member.name}`);
        });
      });
    },
    updateRelation: (
      state,
      action: PayloadAction<{ relationKey: string; change: number }>
    ) => {
      const { relationKey, change } = action.payload;
      if (state.relations[relationKey] !== undefined) {
        state.relations[relationKey] = Math.max(
          0,
          Math.min(100, state.relations[relationKey] + change)
        );
      } else {
        state.relations[relationKey] = Math.max(0, Math.min(100, 50 + change));
      }
    },
    updateRelationsMap: (state, action: PayloadAction<IRelation>) => {
      state.relations = action.payload;
    },
    // Modified reducer to handle team updates and defeat
    updateTeamMembers: (state, action: PayloadAction<{ teamId: string; updatedMembers: IUser[] }>) => {
        const { teamId, updatedMembers } = action.payload;
        const teamIndex = state.teams.findIndex(t => t.id === teamId);

        if (teamIndex !== -1) {
            // Check if all members are defeated (HP <= 0)
            const isTeamDefeated = updatedMembers.every(member => member.hp <= 0);

            if (isTeamDefeated) {
                // Team is defeated: Remove from active teams and add to defeated teams
                const defeatedTeam = { ...state.teams[teamIndex], members: updatedMembers };
                state.defeatedTeams.push(defeatedTeam);
                state.teams.splice(teamIndex, 1); // Remove from active teams array
                console.log(`Team ${defeatedTeam.name} (${teamId}) moved to defeated.`);
            } else {
                // Team is not defeated: Update the members in the active teams array
                state.teams[teamIndex].members = updatedMembers;
            }
        } else {
             // If team not found in active list, check if they were already defeated (shouldn't happen from fight end)
             const defeatedIndex = state.defeatedTeams.findIndex(t => t.id === teamId);
             if (defeatedIndex !== -1) {
                 // Update state even if already defeated (e.g., if some logic modified them again)
                 state.defeatedTeams[defeatedIndex].members = updatedMembers;
             } else {
                console.warn(`updateTeamMembers: Team with ID ${teamId} not found in active or defeated list.`);
             }
        }
    },
    // Reset needs to clear defeatedTeams as well
    reset: () => {
      return initialState;
    },
  },
});

export const {
  saveTeams,
  reset,
  saveGame,
  addTurn,
  updateRelation,
  saveTeam,
  updateRelationsMap,
  updateTeamMembers, 
} = GameSlice.actions;

export default GameSlice.reducer;
