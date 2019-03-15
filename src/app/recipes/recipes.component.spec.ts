import { Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule  } from '@angular/common/http/testing'; 
import { RouterTestingModule } from '@angular/router/testing';
//import { StoreModule } from '@ngrx/store';
//import { TestStore } from '@testing/utils';

import { MockStoreModule } from '@reibo/ngrx-mock-test';

import {StoreModule} from "@ngrx/store";
import { Store, select  } from '@ngrx/store';

import { convertToParamMap, ActivatedRoute } from '@angular/router';
//import { of } from 'rxjs';
import { BehaviorSubject, Observable, of } from 'rxjs';
//import { AppComponent } from './../app.component';

import { recipesPagesReducer } from './recipes.reducer';
import { RecipeService } from './../recipe.service';
import { RecipesComponent } from './recipes.component';
import { PaginationComponent } from './../pagination/pagination.component';

/*export class ActivatedRouteStub {
  public paramMap = of(convertToParamMap({ 
    pageId: '1',      
  }));
}*/
@Injectable()
export class ActivatedRouteStub
{
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    private _testParams: {};
    get testParams() { return this._testParams; }
    set testParams(params: {}) {
        this._testParams = params;
        this.subject.next(params);
    }
}
/*
let recipesService: RecipesService;
class MockRecipesService {
  Recipes$ = of(MockRecipesServiceData);
  getRecipes(){
    return this.Recipes$;
  }
}*/

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;

  let mockParams, mockActivatedRoute; 

  let recipeService: RecipeService;

  //const testStore = jasmine.createSpyObj('Store', ['pipe']);//.and.callThrough();

  beforeEach(async(() => {
    mockActivatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      /*providers: [
        { provide: StoreModule, useClass: TestStore }   // use test store instead of ngrx store
      ],*/
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        //StoreModule.forRoot('currentPage', recipesPagesReducer)
        StoreModule.forRoot({currentPage: recipesPagesReducer})
        //MockStoreModule.forRoot('currentPage', {})
       ],//
      declarations: [ RecipesComponent, PaginationComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        RecipeService,
        
        //{ provide: Store, useValue: testStore }
        /*{
            provide: RecipeService,
            useClass: class { 
               getRecipes = jasmine.createSpy("getRecipes"); 
            }
         }*/
      ]
    })
    .compileComponents();


  }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RecipesComponent);
      component = fixture.componentInstance;
      //mockActivatedRoute.testParams = {pageId: '1'};
      //fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should set the current page to the value of the url param pageId', () => {
      mockActivatedRoute.testParams = {pageId: '1'};
      fixture.detectChanges();
      expect(component.currentPage).toEqual(1);
      mockActivatedRoute.testParams = {pageId: '3'};
      fixture.detectChanges();
      expect(component.currentPage).toEqual(3);
   });

   it('should call load the recipes() with the value of the url param pageId', () => {
      let getRecipesSpy = spyOn(component, 'getRecipes');    
      mockActivatedRoute.testParams = {pageId: '3'};
      fixture.detectChanges();
      expect(getRecipesSpy).toHaveBeenCalledWith(3);
   });

   it('should able to load the previous page', async () => {
      mockActivatedRoute.testParams = {pageId: '2'};
      recipeService = TestBed.get(RecipeService);
      let recipesServiceData = {"currentPage":2,"recipes":[{}]};
      let spy = spyOn(recipeService, 'getRecipes').and.returnValue(of(recipesServiceData));

      fixture.detectChanges();
      await component.currentPage$.subscribe();
  
      expect(recipeService.getRecipes).toHaveBeenCalledWith(2, component.itemsPerPage);
      expect(component.currentPage).toEqual(2);

      recipesServiceData = {"currentPage":1,"recipes":[{}]};
      spy.and.returnValue(of(recipesServiceData));

      component.loadPrevPage();
      fixture.detectChanges();

      await component.currentPage$.subscribe();

      expect(recipeService.getRecipes).toHaveBeenCalledWith(1, component.itemsPerPage);
      expect(component.currentPage).toEqual(1);
   });

   it('should able to load the next page', async () => {
      mockActivatedRoute.testParams = {pageId: '4'};
      recipeService = TestBed.get(RecipeService);
      let recipesServiceData = {"currentPage":45,"recipes":[{}]};
      let spy = spyOn(recipeService, 'getRecipes').and.returnValue(of(recipesServiceData));

      fixture.detectChanges();
      await component.currentPage$.subscribe();
  
      expect(recipeService.getRecipes).toHaveBeenCalledWith(4, component.itemsPerPage);
      expect(component.currentPage).toEqual(4);

      recipesServiceData = {"currentPage":5,"recipes":[{}]};
      spy.and.returnValue(of(recipesServiceData));

      component.loadNextPage();
      fixture.detectChanges();

      await component.currentPage$.subscribe();

      expect(recipeService.getRecipes).toHaveBeenCalledWith(5, component.itemsPerPage);
      expect(component.currentPage).toEqual(5);
   });

});