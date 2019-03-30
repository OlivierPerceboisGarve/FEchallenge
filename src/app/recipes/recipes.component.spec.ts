import { Injectable } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed, flush } from '@angular/core/testing';

import { HttpClientTestingModule  } from '@angular/common/http/testing'; 
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './../app-routing.module';
//import { StoreModule } from '@ngrx/store';
//import { TestStore } from '@testing/utils';

import { MockStoreModule } from '@reibo/ngrx-mock-test';
import { EffectsModule } from '@ngrx/effects';
import {StoreModule} from "@ngrx/store";
import { Store, select  } from '@ngrx/store';

import { getTestScheduler, cold } from 'jasmine-marbles';

import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { skip, delay} from 'rxjs/operators';
//import { AppComponent } from './../app.component';
import { RecipesEffects } from './recipes.effects';
import { recipesReducer, getAllRecipes } from './recipes.reducer';
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
        AppRoutingModule,
        //StoreModule.forRoot('currentPage', recipesPagesReducer)
        StoreModule.forRoot({ recipes: recipesReducer }),
        EffectsModule.forRoot([RecipesEffects])
        //StoreModule.forRoot({currentPage: recipesReducer})
        //MockStoreModule.forRoot('currentPage', {})
       ],//
      declarations: [ RecipesComponent, PaginationComponent ],
      providers: [
        /*{
          provide: ActivatedRoute,
           useValue:{
            params: of({pageId: '3'})
          }
        },*/

        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        RecipeService,
        
        /*{ 
          provide: RecipeService,
          useValue: { getRecipes: of([{foo: 'bar'}]) }
        }*/
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

  const createComponent = (): RecipesComponent => {
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

   beforeEach(() => {
      fixture = TestBed.createComponent(RecipesComponent);
      component = fixture.componentInstance;
      //mockActivatedRoute.testParams = {pageId: '1'};
      //fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });

   it('should set the current page to the value of the url param pageId', fakeAsync(() => {
    const data1 = {
      currentPage: 3,
      totalPage: 5,
      recipes: [{id: 1, title: 'trololo', description: 'htotoa'}]
    };
    const data2 = {
      currentPage: 3,
      totalPage: 5,
      recipes: [{id: 3, title: 'trololo', description: 'htotoa'}]
    };
    let getRecipesSpy = spyOn(RecipeService.prototype, 'getRecipes').and.callFake(function() {
      var param = arguments[0];
      if (param === 1) {
        return of(data1).pipe(delay(50));
      }
      if (param === 3) {
        return of(data2).pipe(delay(50));
      }
    });   

    mockActivatedRoute.testParams = {pageId: '1'};
    fixture.detectChanges();
    expect(component.currentPage).toEqual(1);

    mockActivatedRoute.testParams = {pageId: '3'};
    tick(500);
    fixture.detectChanges();
    expect(component.currentPage).toEqual(3);
   }));

   //with fakeAsync
   it('should load all recipes of the page indicated by the value of the url param pageId and make available to the view', fakeAsync(() => {  
    const data = {
      currentPage: 3,
      totalPage: 5,
      recipes: [{id: 2, title: 'trololo', description: 'htotoa'}]
    };
    let getRecipesSpy = spyOn(RecipeService.prototype, 'getRecipes').and.returnValue(of(data).pipe(delay(50)));    
      
    mockActivatedRoute.testParams = {pageId: '3'};
    component = createComponent();
    fixture.detectChanges();
    expect(component.recipes).toEqual(undefined);
    expect(getRecipesSpy).toHaveBeenCalledWith(3, 5);

    tick(100);
    expect(component.recipes).toEqual([{id: 2, title: 'trololo', description: 'htotoa'}]);
   }));

   //with jasmine done()
   it('should load all recipes of the page indicated by the value of the url param pageId', (done) => {   
    const data = {
      currentPage: 3,
      totalPage: 5,
      recipes: [{id: 2, title: 'trololo', description: 'htotoa'}]
    };
    let getRecipesSpy = spyOn(RecipeService.prototype, 'getRecipes').and.returnValue(of(data).pipe(delay(50)));     
    mockActivatedRoute.testParams = {pageId: '3'};
    component = createComponent();
    fixture.detectChanges();
    component.store.select(getAllRecipes).subscribe(() => {
      expect(getRecipesSpy).toHaveBeenCalledWith(3, 5);
      done();
    });
   });

  it('should able to load the previous page', fakeAsync (() => {
    mockActivatedRoute.testParams = {pageId: '2'};
    recipeService = TestBed.get(RecipeService);
    let recipesServiceData = {"currentPage":2,"recipes":[{}]};
    let spy = spyOn(recipeService, 'getRecipes').and.returnValue(of(recipesServiceData));

    fixture.detectChanges();

    expect(recipeService.getRecipes).toHaveBeenCalledWith(2, 5);//itemsPerPage magic number
    expect(component.currentPage).toEqual(2);

    recipesServiceData = {"currentPage":1,"recipes":[{}]};
    spy.and.returnValue(of(recipesServiceData));

    component.loadPrevPage();
    fixture.detectChanges();

    tick();

    expect(recipeService.getRecipes).toHaveBeenCalledWith(1, 5);//itemsPerPage magic number
    expect(component.currentPage).toEqual(1);
  }));

  it('should able to load the next page', fakeAsync (() => {
    mockActivatedRoute.testParams = {pageId: '4'};
    recipeService = TestBed.get(RecipeService);
    let recipesServiceData = {"currentPage":4,"recipes":[{}]};
    let spy = spyOn(recipeService, 'getRecipes').and.returnValue(of(recipesServiceData));

    fixture.detectChanges();

    expect(recipeService.getRecipes).toHaveBeenCalledWith(4, 5);//itemsPerPage magic number
    expect(component.currentPage).toEqual(4);

    recipesServiceData = {"currentPage":5,"recipes":[{}]};
    spy.and.returnValue(of(recipesServiceData));

    component.loadNextPage();
    fixture.detectChanges();

    tick();

    expect(recipeService.getRecipes).toHaveBeenCalledWith(5, 5);//itemsPerPage magic number
    expect(component.currentPage).toEqual(5);
  }));

});