import { Component, OnInit } from '@angular/core'; 
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  private unsubscribe$ = new Subject();

  constructor(private recipeService: RecipeService) { }

  getRecipes(page = this.currentPage, pageSize = this.itemsPerPage):void {
    console.log('grr', page, pageSize);
    this.recipeService.getRecipes(page, pageSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe( (recipes) => {
        this.recipes = recipes['recipes'];
        this.currentPage = recipes['currentPage'];
      });
  }
  loadPrevPage(){
    console.log('r prev', this.currentPage);
    this.getRecipes(this.currentPage-1, this.itemsPerPage);
  }
  loadNextPage(){
    console.log('r next', this.currentPage, this.currentPage+1);
    this.getRecipes(this.currentPage+1, this.itemsPerPage);
  }

  ngOnInit():void {
    this.getRecipes();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

