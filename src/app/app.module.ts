import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { recipesReducer } from './recipes/recipes.reducer';

import { RecipesComponent } from './recipes/recipes.component';
import { PaginationComponent } from './pagination/pagination.component';

import { RecipesEffects } from './recipes/recipes.effects';


@NgModule({
  declarations: [
    AppComponent,
    RecipesComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ recipes: recipesReducer }),
    EffectsModule.forRoot([RecipesEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
