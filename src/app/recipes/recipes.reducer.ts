import { Action } from '@ngrx/store';
import { ActionTypes } from './recipesPages.actions';
 
export const initialState:number = 1;

export const recipesPagesReducer = (state:number = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.GoToNextPage:
      return state + 1;
 
    case ActionTypes.GoToPreviousPage:
      return state - 1;

    default:
      return state;
  }
}