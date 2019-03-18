import { Action } from '@ngrx/store';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import { ActionTypes, RecipesActions } from './recipesPages.actions';
import { Recipe } from '../recipe';
 
export interface State {
  recipes: Recipe[];
  page: number;
  itemsPerPage: number;
  loading: boolean;
  error: any;
}

export const initialState: State = {
  recipes: null,
  page: 1,
  itemsPerPage: 5,
  loading: false,
  error: null
};

export const recipesReducer = (state:State = initialState, action: RecipesActions) => {
  switch (action.type) {
    case ActionTypes.GoToNextPage:
      return {...state, loading: true};
 
    case ActionTypes.GoToPreviousPage:
      return {...state, loading: true};

      case ActionTypes.LoadPage:
      return {...state, loading: true};

      case ActionTypes.LoadPageSuccess:
      return {...state, loading: false, page: Number(action.page), recipes: action.payload};

    default:
      return state;
  }
}


export const getRecipesState = createFeatureSelector < State > ('recipes');
export const getAllRecipes = createSelector(getRecipesState, (state: State) => state.recipes);

