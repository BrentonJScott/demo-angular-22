import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Ingredient, RecipeBook, ShoppingList } from './data';

@Component({
  selector: 'app-recipes',
  template: `
    <main class="page">
      <div class="page-title">
        <h1>Recipes</h1>
        <span class="chip">{{ recipes().length }}</span>
        <button type="button" class="btn btn-outline new-btn" (click)="startCreate()">
          New recipe
        </button>
      </div>

      <div class="layout">
        <section>
          <span class="section-label">All recipes</span>
          <div class="list">
            @for (r of recipes(); track $index; let i = $index) {
              <button
                type="button"
                class="recipe"
                [class.active]="!creating() && i === selected()"
                (click)="select(i)"
              >
                <strong>{{ r.name }}</strong>
                <span class="muted">{{ r.description }}</span>
                <span class="tags">
                  <span class="badge">{{ r.time }}</span>
                  <span class="badge badge-outline">{{ r.serves }}</span>
                </span>
              </button>
            }
          </div>
        </section>

        <section>
          @if (creating()) {
            <span class="section-label">New recipe</span>
            <form class="card details" (submit)="save($event)">
              <div>
                <label class="label" for="recipe-name">Name</label>
                <input
                  class="input"
                  id="recipe-name"
                  placeholder="e.g. Tomato soup"
                  [value]="name()"
                  (input)="name.set($any($event.target).value)"
                />
              </div>
              <div>
                <label class="label" for="recipe-description">Description</label>
                <input
                  class="input"
                  id="recipe-description"
                  placeholder="A short summary"
                  [value]="description()"
                  (input)="description.set($any($event.target).value)"
                />
              </div>
              <div class="fields">
                <div>
                  <label class="label" for="recipe-time">Time</label>
                  <input
                    class="input"
                    id="recipe-time"
                    placeholder="30 min"
                    [value]="time()"
                    (input)="time.set($any($event.target).value)"
                  />
                </div>
                <div>
                  <label class="label" for="recipe-serves">Serves</label>
                  <input
                    class="input"
                    id="recipe-serves"
                    placeholder="4"
                    [value]="serves()"
                    (input)="serves.set($any($event.target).value)"
                  />
                </div>
              </div>
              <div>
                <label class="label" for="recipe-ingredients">Ingredients</label>
                <textarea
                  class="input textarea"
                  id="recipe-ingredients"
                  rows="6"
                  placeholder="One per line, e.g.&#10;Tomatoes, 6&#10;Onion, 1"
                  [value]="ingredients()"
                  (input)="ingredients.set($any($event.target).value)"
                ></textarea>
              </div>
              <div class="actions">
                <button type="button" class="btn btn-outline" (click)="cancelCreate()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary">Save recipe</button>
              </div>
            </form>
          } @else {
            <span class="section-label">Details</span>
            <div class="card details">
              <div>
                <h2>{{ recipe().name }}</h2>
                <p class="muted">{{ recipe().description }}</p>
                <span class="tags">
                  <span class="badge">{{ recipe().time }}</span>
                  <span class="badge badge-outline">{{ recipe().serves }}</span>
                </span>
              </div>
              <hr />
              <div>
                <span class="section-label">Ingredients</span>
                <ul>
                  @for (ing of recipe().ingredients; track ing.name) {
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
          }
        </section>
      </div>
    </main>
  `,
  styles: `
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
    .new-btn {
      margin-left: auto;
    }
    .fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .textarea {
      height: auto;
      padding: 8px 12px;
      resize: vertical;
    }
  `,
})
export class Recipes {
  private shoppingList = inject(ShoppingList);
  private router = inject(Router);
  private book = inject(RecipeBook);

  recipes = this.book.recipes;
  selected = signal(0);
  creating = signal(false);
  name = signal('');
  description = signal('');
  time = signal('');
  serves = signal('');
  ingredients = signal('');

  recipe() {
    return this.recipes()[this.selected()];
  }

  select(index: number) {
    this.creating.set(false);
    this.selected.set(index);
  }

  startCreate() {
    this.name.set('');
    this.description.set('');
    this.time.set('');
    this.serves.set('');
    this.ingredients.set('');
    this.creating.set(true);
  }

  cancelCreate() {
    this.creating.set(false);
  }

  save(event: Event) {
    event.preventDefault();
    const name = this.name().trim();
    if (!name) return;
    this.book.add({
      name,
      description: this.description().trim(),
      time: this.time().trim() || '—',
      serves: 'Serves ' + (this.serves().trim() || '1'),
      ingredients: this.parseIngredients(),
    });
    this.selected.set(this.recipes().length - 1);
    this.creating.set(false);
  }

  // One ingredient per line as "name, amount"; amount defaults to 1.
  private parseIngredients(): Ingredient[] {
    return this.ingredients()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, ...rest] = line.split(',');
        return { name: name.trim(), amount: rest.join(',').trim() || '1' };
      });
  }

  addToList() {
    this.shoppingList.addAll(this.recipe().ingredients);
    this.router.navigateByUrl('/shopping-list');
  }
}
