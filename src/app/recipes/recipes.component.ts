import { Component, OnInit } from '@angular/core'; 
import { Subject, Observable } from 'rxjs';
import { filter, map, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { GoToPreviousPage, GoToNextPage } from './recipesPages.actions';

import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[];

  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number;
  currentPage$: Observable<number>;
  private unsubscribe$ = new Subject();

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<{ currentPage: number }>
  ) {
    this.currentPage$ = store.pipe(select('currentPage'));
    this.currentPage$.subscribe((currentPage) => {
      this.getRecipes(currentPage);
    });
  }

  getRecipes(page:number):void {
    this.recipeService.getRecipes(page, this.itemsPerPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe( (recipes) => {
        this.recipes = recipes['recipes'];
        this.currentPage = Number(recipes['currentPage']);
        this.totalPages = Number(recipes['totalPages']);
      });
  }
  
  loadPrevPage(){
    console.log('prev');
    this.store.dispatch(new GoToPreviousPage())
    //this.router.navigate(['recipes/page/'+(this.currentPage-1) ]);
  }
  loadNextPage(){
    console.log('next');
    this.store.dispatch(new GoToNextPage());
    //this.router.navigate(['recipes/page/'+(this.currentPage+1) ]);
  }

  ngOnInit():void {
    this.activatedRoute.params.pipe(
        filter(params => 'pageId' in params),
        map(params => params.pageId),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      ).subscribe(pageId => {
        this.currentPage = Number(pageId);
        this.getRecipes(this.currentPage);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}