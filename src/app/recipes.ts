import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Recipe, RecipeBook, ShoppingList } from './data';

@Component({
  selector: 'app-recipes',
  imports: [RouterLink],
  template: `
    <main class="page">
      <div class="page-title">
        <h1>Recipe book</h1>
        <span class="chip">{{ recipes().length }}</span>
        <a class="btn btn-outline new-btn" routerLink="/recipes/new">New recipe</a>
      </div>

      <div class="layout">
        <section>
          <span class="section-label">All recipes</span>
          <input
            class="input search"
            type="search"
            placeholder="Search recipes"
            aria-label="Search recipes"
            [value]="search()"
            (input)="search.set($any($event.target).value)"
          />
          <div class="list">
            @for (r of recipes(); track $index; let i = $index) {
              <button
                type="button"
                class="recipe"
                [class.active]="i === selected()"
                (click)="select(i)"
              >
                <strong>{{ r.name }}</strong>
                <span class="muted">{{ r.description }}</span>
                <span class="tags">
                  <span class="badge">{{ r.time }}</span>
                  <span class="badge badge-outline">{{ r.serves }}</span>
                  @if (r.rating) {
                    <span class="badge rating">★ {{ r.rating }}</span>
                  }
                </span>
              </button>
            }
          </div>
        </section>

        <section>
          <span class="section-label">Details</span>
          <div class="card details">
            <div>
              <h2>{{ recipe().name }}</h2>
              <p class="muted">{{ recipe().description }}</p>
              <span class="tags">
                <span class="badge">{{ recipe().time }}</span>
                <span class="badge badge-outline">Serves {{ servings() }}</span>
                @if (recipe().rating) {
                  <span class="badge rating">★ {{ recipe().rating }}</span>
                }
              </span>
              @if (recipe().note) {
                <p class="muted note">Note: {{ recipe().note }}</p>
              }
            </div>
            <hr />
            <div>
              <div class="ingredients-header">
                <span class="section-label">Ingredients</span>
                <span class="stepper">
                  <button
                    type="button"
                    class="btn btn-outline step"
                    aria-label="Fewer servings"
                    [disabled]="servings() <= 1"
                    (click)="servings.set(servings() - 1)"
                  >
                    −
                  </button>
                  <span class="step-value">{{ servings() }}</span>
                  <button
                    type="button"
                    class="btn btn-outline step"
                    aria-label="More servings"
                    (click)="servings.set(servings() + 1)"
                  >
                    +
                  </button>
                </span>
              </div>
              <ul>
                @for (ing of scaledIngredients(); track $index) {
                  <li>
                    <span>{{ ing.name }}</span>
                    <span class="muted">{{ ing.amount }}</span>
                  </li>
                }
              </ul>
            </div>
            <hr />
            <div class="actions">
              <button type="button" class="btn btn-primary" (click)="addToList()">
                Add to shopping list
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
  styles: `
    .new-btn {
      margin-left: auto;
    }
    .rating {
      background: oklch(0.95 0.07 90);
    }
    .note {
      margin-top: 8px;
    }
    .search {
      margin-bottom: 8px;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(280px, 1fr) minmax(0, 2fr);
      gap: 24px;
      align-items: start;
    }
    @media (max-width: 800px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--card-radius);
    }
    .recipe {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      padding: 12px;
      border: none;
      border-radius: var(--radius);
      background: transparent;
      color: var(--foreground);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    .recipe.active {
      background: var(--muted);
    }
    .tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .recipe .tags {
      margin-top: 0;
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .ingredients-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .step {
      width: 32px;
      min-height: 32px;
      padding: 0;
    }
    .step-value {
      min-width: 20px;
      text-align: center;
      font-weight: 600;
    }
    hr {
      width: 100%;
      margin: 0;
      border: none;
      border-top: 1px solid var(--border);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 12px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `,
})
export class Recipes {
  private shoppingList = inject(ShoppingList);
  private router = inject(Router);
  private book = inject(RecipeBook);

  recipes = this.book.recipes;
  selected = signal(0);
  search = signal('');
  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.recipes().filter((r) => r.name.toLowerCase().includes(term));
  });

  servings = signal(servesCount(this.recipes()[0]));
  scaledIngredients = computed(() => {
    const base = parseInt(this.recipe().serves) || this.servings();
    const factor = this.servings() / base;
    return this.recipe().ingredients.map((ing) => ({
      name: ing.name,
      amount: scaleAmount(ing.amount, factor),
    }));
  });

  recipe() {
    return this.recipes()[this.selected()];
  }

  constructor() {
    // The new recipe flow links back here with ?r=<index> to select the new recipe.
    const r = Number(inject(ActivatedRoute).snapshot.queryParamMap.get('r'));
    if (Number.isInteger(r) && r > 0 && r < this.recipes().length) this.select(r);
  }

  select(index: number) {
    this.selected.set(index);
    this.servings.set(servesCount(this.recipe()));
  }

  addToList() {
    this.shoppingList.addAll(this.scaledIngredients());
    this.router.navigateByUrl('/shopping-list');
  }
}

function servesCount(recipe: Recipe): number {
  return Number(recipe.serves.match(/\d+/)?.[0] ?? 1);
}

// Scale the leading number of an amount like "400 g" or "2 cloves".
function scaleAmount(amount: string, factor: number): string {
  const match = amount.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return amount;
  const value = Math.round(Number(match[1]) * factor * 10) / 10;
  return value + match[2];
}
