import { Component, OnInit } from '@angular/core'; 
import { Subject } from 'rxjs';
import { filter, map, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private recipeService: RecipeService, private router: Router, private activatedRoute: ActivatedRoute ) { }

  getRecipes(page = this.currentPage, pageSize = this.itemsPerPage):void {
    this.recipeService.getRecipes(page, pageSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe( (recipes) => {
        this.recipes = recipes['recipes'];
        this.currentPage = Number(recipes['currentPage']);
      });
  }
  loadPrevPage(){
    this.router.navigate(['recipes/page/'+(this.currentPage-1) ]);
  }
  loadNextPage(){
    this.router.navigate(['recipes/page/'+(this.currentPage+1) ]);
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

