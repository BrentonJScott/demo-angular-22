import { Routes } from '@angular/router';
import { Login } from './login';
import { NewRecipe } from './new-recipe';
import { Recipes } from './recipes';
import { Register } from './register';
import { ShoppingListPage } from './shopping-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recipes', component: Recipes },
  { path: 'recipes/new', component: NewRecipe },
  { path: 'shopping-list', component: ShoppingListPage },
  { path: '**', redirectTo: 'login' },
];
