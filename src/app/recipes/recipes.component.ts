import { Component, OnInit } from '@angular/core'; 
import { Subject, Observable } from 'rxjs';
import { filter, map, skip, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select  } from '@ngrx/store';//

import { GoToPreviousPage, GoToNextPage, LoadPage, LoadPageSuccess } from './recipesPages.actions';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe';
import { State, getRecipesState, getAllRecipes } from './recipes.reducer';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[];

  //itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number;
  currentPage$: Observable<number>;
  private unsubscribe$ = new Subject();

  constructor(

    private recipeService: RecipeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<State>
  ) {}
 
  loadPrevPage(){
    this.store.dispatch(new GoToPreviousPage())
  }
  loadNextPage(){
    this.store.dispatch(new GoToNextPage());
  }

  ngOnInit():void {
    this.currentPage$ = this.store.pipe(select('recipes'));

    this.activatedRoute.params.pipe(
        filter(params => 'pageId' in params),
        map(params => params.pageId),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      ).subscribe(pageId => {
        this.store.dispatch(new LoadPage(pageId, 5)); //this.itemsPerPage
      });

      this.store.select(getAllRecipes).subscribe((recipes) => {
        console.log('recipes', recipes);
        if (recipes !== null) {//--> create own pipeable operator to filter notnull
          this.recipes = recipes['recipes'];
          this.currentPage = Number(recipes['currentPage']);
          this.totalPages = Number(recipes['totalPages']);
        };
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}