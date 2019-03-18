import { Action } from '@ngrx/store';
import { Recipe } from '../recipe';

export enum ActionTypes {
    GoToNextPage = '[recipesPages Component] goToNextPage',
    GoToPreviousPage = '[recipesPages Component] goToPreviousPage',
    LoadPage = '[recipesPages Component] loadPage',
    LoadPageSuccess = '[recipesPages Component] loadPage Success',
    LoadPageFail = '[recipesPages Component] loadPage Fail',
}

export class GoToNextPage implements Action {
  readonly type = ActionTypes.GoToNextPage;
}

export class GoToPreviousPage implements Action {
  readonly type = ActionTypes.GoToPreviousPage;
}

export class LoadPage implements Action {
  readonly type = ActionTypes.LoadPage;
  constructor(public page: number, itemsPerPage: number){}
}

export class LoadPageSuccess implements Action {
  readonly type = ActionTypes.LoadPageSuccess;
  constructor(public payload: Recipe[], public page: number){}
}
export class LoadPageFail implements Action {
  readonly type = ActionTypes.LoadPageFail;
  constructor(public payload: Error){}
}


export type RecipesActions = GoToNextPage
                             | GoToPreviousPage
                             | LoadPage
                             | LoadPageSuccess
                             | LoadPageFail;


