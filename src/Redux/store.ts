import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './Slices/Game';
import fightReducer from './fightSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    fight: fightReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
