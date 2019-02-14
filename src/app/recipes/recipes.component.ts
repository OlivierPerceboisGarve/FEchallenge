import { Component, OnInit } from '@angular/core'; 
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
    console.log('grr', page, pageSize);
    this.recipeService.getRecipes(page, pageSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe( (recipes) => {
        console.log('got recipes in component', recipes);
        this.recipes = recipes['recipes'];
        this.currentPage = recipes['currentPage'];
      });
  }
  loadPrevPage(){
    console.log('r prev', this.currentPage);
    //this.getRecipes(this.currentPage-1, this.itemsPerPage);
    this.router.navigate(['recipes/page/'+(this.currentPage-1) ]);
  }
  loadNextPage(){
    console.log('r next', this.currentPage, this.currentPage+1);
    this.getRecipes(this.currentPage+1, this.itemsPerPage);
    this.router.navigate(['recipes/page/'+(this.currentPage+1) ]);
  }

  ngOnInit():void {
    //console.log('ngOnInit activatedRoute.snapshot', this.activatedRoute.snapshot);
    this.activatedRoute.params
      .subscribe(params => {
        console.log('this.activatedRoute.params', params );
        if (params['id']){
          console.log('this.activatedRoute.params HAS PARAM', params );
          this.currentPage = params['id'];
          this.getRecipes(this.currentPage);
        } 
      });
    
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

