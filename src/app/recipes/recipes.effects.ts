import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, withLatestFrom, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';




import { RecipeService } from '../recipe.service';
import { 
    ActionTypes,
    GoToPreviousPage,
    GoToNextPage,
    LoadPage,
    LoadPageSuccess,
    LoadPageFail
     } from './recipesPages.actions';
import { Recipe } from '../recipe';
import { State } from './recipes.reducer';

@Injectable()
export class RecipesEffects {
    constructor(
        private actions$: Actions,
        private store$: Store<State>,
        private recipeService: RecipeService,
        private router: Router
        ){
            console.log('EFFECTS');
        }

    @Effect()
    goToPreviousPage$ = this.actions$.pipe(
            ofType(ActionTypes.GoToPreviousPage),
            withLatestFrom(this.store$.pipe(select('recipes'))),
            switchMap(([action, storeState ] ) => {
                return of(new LoadPage(storeState.page - 1, storeState.itemsPerPage));
            }
        )
    );        

    @Effect()
    goToNextPage$ = this.actions$.pipe(
            ofType(ActionTypes.GoToNextPage),
            withLatestFrom(this.store$.pipe(select('recipes'))),
            switchMap(([action, storeState ] ) => {
                console.log('goToNextPage$', action, storeState);
                return of(new LoadPage(storeState.page + 1, storeState.itemsPerPage));
            }
        )
    );

    @Effect()
    loadPage$ = this.actions$.pipe(
            ofType(ActionTypes.LoadPage),
            withLatestFrom(this.store$.pipe(select('recipes'))),
            switchMap(([action, storeState ]:[State, State]) => {
                console.log('effect loadpage page:', action.page, ' itemsPerPage: ', storeState.itemsPerPage);
                return this.recipeService.getRecipes(action.page, storeState.itemsPerPage).pipe(
                    map((recipes: Recipe[]) => new LoadPageSuccess(recipes, action.page)),
                    catchError(error => of(new LoadPageFail(error))),
                    tap((_) => console.log('tap after getRecipes in effect'))
                );
            })
    );

    @Effect({ dispatch: false })
    loadPageSuccess$ = this.actions$.pipe(
            ofType(ActionTypes.LoadPageSuccess),
            withLatestFrom(this.store$.pipe(select('recipes'))),
            tap(([action, storeState ] ) => {
                console.log('effect loadPageSuccess');
                this.router.navigate(['recipes/page/'+(storeState.page) ]);
            })

    );
    
}