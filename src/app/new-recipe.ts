import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Ingredient, Recipe, RecipeBook, ShoppingList } from './data';

const STEPS = ['Add recipe', 'Shopping list', 'Rate', 'Share'];

// Four-step flow: create a recipe, add its ingredients to the shopping list,
// rate it, then copy a shareable summary.
@Component({
  selector: 'app-new-recipe',
  imports: [RouterLink],
  template: `
    <main class="page narrow">
      <div class="page-title">
        <h1>New recipe</h1>
        <span class="chip">Step {{ step() + 1 }} of {{ steps.length }}</span>
        <a class="btn btn-ghost cancel" routerLink="/recipes">Cancel</a>
      </div>

      <ol class="progress">
        @for (label of steps; track label; let i = $index) {
          <li [class.done]="i < step()" [class.current]="i === step()">
            <span class="dot">{{ i < step() ? '✓' : i + 1 }}</span>
            <span>{{ label }}</span>
          </li>
        }
      </ol>

      @switch (step()) {
        @case (0) {
          <form class="card form" (submit)="next($event)">
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
              <button type="submit" class="btn btn-primary" [disabled]="!name().trim()">
                Next
              </button>
            </div>
          </form>
        }

        @case (1) {
          <div class="card form">
            <div>
              <h2>Add ingredients to your shopping list</h2>
              <p class="muted">Untick anything you already have.</p>
            </div>
            @if (recipe().ingredients.length) {
              <ul class="checklist">
                @for (ing of recipe().ingredients; track $index; let i = $index) {
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        [checked]="picked()[i]"
                        [disabled]="addedCount() !== null"
                        (change)="toggle(i)"
                      />
                      <span>{{ ing.name }}</span>
                    </label>
                    <span class="muted">{{ ing.amount }}</span>
                  </li>
                }
              </ul>
              @if (addedCount() === null) {
                <button
                  type="button"
                  class="btn btn-outline add-btn"
                  [disabled]="!pickedCount()"
                  (click)="addToList()"
                >
                  Add {{ pickedCount() }} {{ pickedCount() === 1 ? 'item' : 'items' }} to shopping
                  list
                </button>
              } @else {
                <p class="success">
                  Added {{ addedCount() }} {{ addedCount() === 1 ? 'item' : 'items' }} to your
                  shopping list.
                </p>
              }
            } @else {
              <p class="muted">This recipe has no ingredients to add.</p>
            }
            <div class="actions">
              <button type="button" class="btn btn-outline" (click)="back()">Back</button>
              <button type="button" class="btn btn-primary" (click)="next()">
                {{ addedCount() === null ? 'Skip' : 'Next' }}
              </button>
            </div>
          </div>
        }

        @case (2) {
          <div class="card form">
            <div>
              <h2>How would you rate {{ recipe().name }}?</h2>
              <p class="muted">Your rating shows on the recipe card.</p>
            </div>
            <div class="stars" role="radiogroup" aria-label="Rating">
              @for (n of [1, 2, 3, 4, 5]; track n) {
                <button
                  type="button"
                  class="star"
                  role="radio"
                  [class.on]="n <= rating()"
                  [attr.aria-checked]="n === rating()"
                  [attr.aria-label]="n + (n === 1 ? ' star' : ' stars')"
                  (click)="rating.set(n)"
                >
                  ★
                </button>
              }
            </div>
            <div>
              <label class="label" for="recipe-note">Note (optional)</label>
              <input
                class="input"
                id="recipe-note"
                placeholder="e.g. Add more garlic next time"
                [value]="note()"
                (input)="note.set($any($event.target).value)"
              />
            </div>
            <div class="actions">
              <button type="button" class="btn btn-outline" (click)="back()">Back</button>
              <button type="button" class="btn btn-primary" (click)="next()">
                {{ rating() ? 'Next' : 'Skip' }}
              </button>
            </div>
          </div>
        }

        @case (3) {
          <div class="card form">
            <div>
              <h2>Share {{ recipe().name }}</h2>
              <p class="muted">Copy the recipe and paste it into a message or email.</p>
            </div>
            <pre class="share">{{ shareText() }}</pre>
            <div class="copy-row">
              <button type="button" class="btn btn-outline" (click)="copy()">
                Copy to clipboard
              </button>
              @if (copyStatus() === 'copied') {
                <span class="success">Copied!</span>
              } @else if (copyStatus() === 'failed') {
                <span class="muted">Couldn't copy. Select the text above instead.</span>
              }
            </div>
            <div class="actions">
              <button type="button" class="btn btn-outline" (click)="back()">Back</button>
              <button type="button" class="btn btn-primary" (click)="finish()">Done</button>
            </div>
          </div>
        }
      }
    </main>
  `,
  styles: `
    .narrow {
      max-width: 720px;
    }
    .cancel {
      margin-left: auto;
    }
    .progress {
      display: flex;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .progress li {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 10px;
      border-top: 3px solid var(--border);
      color: var(--muted-foreground);
      font-weight: 600;
    }
    .progress li.done,
    .progress li.current {
      border-top-color: var(--brand);
      color: var(--foreground);
    }
    .dot {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 9999px;
      background: var(--muted);
      font-size: 12px;
    }
    .current .dot,
    .done .dot {
      background: var(--brand);
      color: var(--brand-foreground);
    }
    @media (max-width: 600px) {
      .progress li span:last-child {
        display: none;
      }
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
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
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .checklist {
      margin: 0;
      padding: 0;
      list-style: none;
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .checklist li {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 12px;
      border-top: 1px solid var(--border);
    }
    .checklist li:first-child {
      border-top: none;
    }
    .checklist label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .add-btn {
      align-self: flex-start;
    }
    .success {
      color: oklch(0.5 0.13 150);
      font-weight: 600;
    }
    .stars {
      display: flex;
      gap: 4px;
    }
    .star {
      padding: 0 2px;
      border: none;
      background: none;
      color: var(--border);
      font-size: 32px;
      line-height: 1;
      cursor: pointer;
    }
    .star.on {
      color: oklch(0.8 0.16 85);
    }
    .share {
      margin: 0;
      padding: 16px;
      border-radius: var(--radius);
      background: var(--muted);
      font: inherit;
      white-space: pre-wrap;
    }
    .copy-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `,
})
export class NewRecipe {
  private book = inject(RecipeBook);
  private shoppingList = inject(ShoppingList);
  private router = inject(Router);

  steps = STEPS;
  step = signal(0);

  // Step 1: recipe details. The recipe is saved when leaving this step.
  name = signal('');
  description = signal('');
  time = signal('');
  serves = signal('');
  ingredients = signal('');
  private index = signal<number | null>(null);

  // Step 2: which ingredients to add, and how many were added (null = not yet).
  picked = signal<boolean[]>([]);
  addedCount = signal<number | null>(null);
  pickedCount = computed(() => this.picked().filter(Boolean).length);

  // Step 3: rating out of 5 (0 = not rated).
  rating = signal(0);
  note = signal('');

  // Step 4
  copyStatus = signal<'idle' | 'copied' | 'failed'>('idle');

  recipe(): Recipe {
    return this.book.recipes()[this.index()!];
  }

  shareText = computed(() => {
    const r = this.recipe();
    const lines = [r.name];
    if (r.description) lines.push(r.description);
    lines.push(`${r.time} · ${r.serves}`);
    if (r.rating) lines.push('★'.repeat(r.rating) + '☆'.repeat(5 - r.rating));
    if (r.note) lines.push(`Note: ${r.note}`);
    if (r.ingredients.length) {
      lines.push('', 'Ingredients:');
      for (const ing of r.ingredients) lines.push(`- ${ing.name}, ${ing.amount}`);
    }
    return lines.join('\n');
  });

  next(event?: Event) {
    event?.preventDefault();
    if (this.step() === 0 && !this.saveDetails()) return;
    if (this.step() === 2) this.saveRating();
    this.step.update((s) => s + 1);
  }

  back() {
    this.step.update((s) => s - 1);
  }

  toggle(i: number) {
    this.picked.update((list) => list.map((on, j) => (j === i ? !on : on)));
  }

  addToList() {
    const items = this.recipe().ingredients.filter((_, i) => this.picked()[i]);
    this.shoppingList.addAll(items);
    this.addedCount.set(items.length);
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.shareText());
      this.copyStatus.set('copied');
    } catch {
      this.copyStatus.set('failed');
    }
  }

  finish() {
    this.router.navigate(['/recipes'], { queryParams: { r: this.index() } });
  }

  // Creates the recipe the first time, and updates it if the user came back to edit.
  private saveDetails(): boolean {
    const name = this.name().trim();
    if (!name) return false;
    const recipe = {
      name,
      description: this.description().trim(),
      time: this.time().trim() || '—',
      serves: 'Serves ' + (this.serves().trim() || '1'),
      ingredients: this.parseIngredients(),
    };
    const index = this.index();
    if (index === null) {
      this.index.set(this.book.add(recipe));
    } else {
      this.book.update(index, recipe);
    }
    // Reset the shopping list step only if nothing has been added yet.
    if (this.addedCount() === null) {
      this.picked.set(recipe.ingredients.map(() => true));
    }
    return true;
  }

  private saveRating() {
    this.book.update(this.index()!, {
      rating: this.rating() || undefined,
      note: this.note().trim() || undefined,
    });
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
}
