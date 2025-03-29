import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IGame, ITeam, ITurn } from '../../Types/Game';

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
    saveGame: (state, action: PayloadAction<IGame>) => {
      return action.payload;
    },
    addTurn: (state, action: PayloadAction<ITurn>) => {
      state.history.push(action.payload);
      state.turn = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveTeams, reset, saveGame, addTurn } = GameSlice.actions;

export default GameSlice.reducer;
