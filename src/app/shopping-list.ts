import { Component, inject, signal } from '@angular/core';
import { ShoppingList as ShoppingListService } from './data';

@Component({
  selector: 'app-shopping-list',
  template: `
    <main class="page narrow">
      <div class="page-title">
        <h1>Shopping list</h1>
        <span class="chip">{{ list.items().length }}</span>
      </div>

      <section>
        <span class="section-label">Add item</span>
        <form class="card form" (submit)="add($event)">
          <div class="fields">
            <div>
              <label class="label" for="item-name">Ingredient</label>
              <input
                class="input"
                id="item-name"
                placeholder="e.g. Tomatoes"
                [value]="name()"
                (input)="name.set($any($event.target).value)"
              />
            </div>
            <div>
              <label class="label" for="item-amount">Amount</label>
              <input
                class="input"
                id="item-amount"
                placeholder="1"
                [value]="amount()"
                (input)="amount.set($any($event.target).value)"
              />
            </div>
          </div>
          <div class="actions">
            <button type="button" class="btn btn-outline" (click)="clear()">Clear</button>
            <button type="submit" class="btn btn-primary">Add item</button>
          </div>
        </form>
      </section>

      <section>
        <div class="items-header">
          <span class="section-label">Items</span>
          @if (list.items().length) {
            <button type="button" class="btn btn-ghost" (click)="list.clearAll()">Clear all</button>
          }
        </div>
        <div class="card table">
          @for (item of list.items(); track $index) {
            <div class="row">
              <span class="item-name">{{ item.name }}</span>
              <span class="muted">{{ item.amount }}</span>
              <span class="row-actions">
                <button
                  type="button"
                  class="btn btn-ghost icon-btn"
                  title="Remove"
                  [attr.aria-label]="'Remove ' + item.name"
                  (click)="remove($index)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
              </span>
            </div>
          } @empty {
            <p class="muted empty">Your shopping list is empty.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: `
    .narrow {
      max-width: 860px;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .fields {
      display: grid;
      grid-template-columns: 3fr 1fr;
      gap: 16px;
    }
    @media (max-width: 600px) {
      .fields {
        grid-template-columns: 1fr;
      }
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .items-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .table {
      padding: 0;
      overflow: hidden;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr 120px auto;
      align-items: center;
      gap: 12px;
      padding: 4px 12px 4px 20px;
      border-top: 1px solid var(--border);
    }
    .row:first-child {
      border-top: none;
    }
    .row-actions {
      display: flex;
      gap: 4px;
    }
    .icon-btn {
      width: 40px;
      padding: 0;
    }
    .icon-btn svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .icon-btn:hover {
      color: var(--foreground);
    }
    .item-name {
      font-weight: 500;
    }
    .empty {
      padding: 40px 20px;
      text-align: center;
    }
  `,
})
export class ShoppingListPage {
  list = inject(ShoppingListService);
  name = signal('');
  amount = signal('');

  add(event: Event) {
    event.preventDefault();
    const name = this.name().trim();
    if (!name) return;
    this.list.add({ name, amount: this.amount().trim() || '1' });
    this.clear();
  }

  clear() {
    this.name.set('');
    this.amount.set('');
  }

  remove(index: number) {
    this.list.remove(index);
  }
}
