import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesComponent } from './recipes/recipes.component';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipes/page/:pageId', component: RecipesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],//{ enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }