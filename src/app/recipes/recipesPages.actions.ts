import { Action } from '@ngrx/store';

export enum ActionTypes {
    GoToNextPage = '[recipesPages Component] goToNextPage',
    GoToPreviousPage = '[recipesPages Component] goToPreviousPage',
}

export class GoToNextPage implements Action {
  readonly type = ActionTypes.GoToNextPage;
}

export class GoToPreviousPage implements Action {
  readonly type = ActionTypes.GoToPreviousPage;
}
