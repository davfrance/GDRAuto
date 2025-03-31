import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IGame, IRelation, ITeam, ITurn } from '../../Types/Game';

export interface CounterState {
  value: number;
}

const initialState: IGame = {
  teams: [],
  id: '',
  relations: {},
  history: [],
  turn: {} as ITurn,
};

export const GameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    saveTeams: (state, action: PayloadAction<ITeam[]>) => {
      state.teams = action.payload;
    },
    saveTeam: (state, action: PayloadAction<ITeam>) => {
      const team = action.payload;
      const existingTeamIndex = state.teams.findIndex(t => t.id === team.id);
      if (existingTeamIndex !== -1) {
        state.teams[existingTeamIndex] = team;
        return;
      }
    },
    saveGame: (state, action: PayloadAction<IGame>) => {
      return action.payload;
    },
    addTurn: (state, action: PayloadAction<ITurn>) => {
      state.history.push(action.payload);
      state.turn = action.payload;
    },
    updateRelation: (
      state,
      action: PayloadAction<{ relationKey: string; change: number }>
    ) => {
      const { relationKey, change } = action.payload;
      // If the relation exists, update it, otherwise create it
      if (state.relations[relationKey] !== undefined) {
        // Ensure relation stays within 0-100 range
        state.relations[relationKey] = Math.max(
          0,
          Math.min(100, state.relations[relationKey] + change)
        );
      } else {
        // Default to 50 if not found, then apply change
        state.relations[relationKey] = Math.max(0, Math.min(100, 50 + change));
      }
    },
    updateRelationsMap: (state, action: PayloadAction<IRelation>) => {
      state.relations = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  saveTeams,
  reset,
  saveGame,
  addTurn,
  updateRelation,
  saveTeam,
  updateRelationsMap,
} = GameSlice.actions;

export default GameSlice.reducer;
