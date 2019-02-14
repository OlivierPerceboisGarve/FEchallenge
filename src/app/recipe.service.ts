import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { pluck } from 'rxjs/operators';
 
import { Recipe } from './recipe';
 
 
@Injectable({ providedIn: 'root' })
export class RecipeService {
 
  private recipesUrl = 'http://localhost:8081/recipes';  // URL to web api
 
  constructor(private http: HttpClient) { }
 
  getRecipes (page:number = 1, pageSize:number = 5): Observable<Recipe[]> {
    const params = { params: new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString()) };
    return this.http.get<Recipe[]>(this.recipesUrl, params );//.pipe(pluck('recipes'));
  }

}