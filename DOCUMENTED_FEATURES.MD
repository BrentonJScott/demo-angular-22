# Documented user features

This list describes what a user can do in the **Recipe Book** Angular demo app (`src/app/`). It is derived from the current codebase, not from product specs.

## Global navigation (header)

The header is shown on every page (`app.html`).

| Feature | How |
| --- | --- |
| Go to Recipes from branding | Click **Recipe Book** logo |
| Open Recipes page | Click **Recipes** in the nav |
| Open Shopping list page | Click **Shopping list** in the nav |
| Open Log in | Click **Log in** (shown on login, register, and root routes) |
| Return to Log in (“log out”) | Click **Log out** (shown on recipes and shopping list; navigates to `/login`, no session cleared) |

Routing uses the URL hash (e.g. `/#/recipes`) so the static build works without server rewrites (`app.config.ts`).

## Authentication pages (demo only)

Login and registration are **UI-only**: forms are not submitted to a backend, and credentials are not validated.

### Log in (`/login`)

| Feature | How |
| --- | --- |
| Enter email and password | Use the email and password fields |
| Continue to Recipes | Click **Log in** (router link to `/recipes`) |
| Open registration | Click **Create one** or use **Register** route |
| Read demo notice | Footer explains sign-in is not connected to a backend |

### Create account (`/register`)

| Feature | How |
| --- | --- |
| Enter name, email, password, confirm password | Use the registration fields |
| Continue to Recipes | Click **Create account** (router link to `/recipes`) |
| Open log in | Click **Log in** link |
| Read demo notice | Footer explains sign-up is not connected to a backend |

### Routing defaults

| Behavior | Detail |
| --- | --- |
| Default entry | Empty path redirects to **Log in** |
| Unknown URLs | Wildcard routes redirect to **Log in** |

## Recipes (`/recipes`)

| Feature | How |
| --- | --- |
| See how many recipes exist | Recipe count chip in the page title |
| Browse all recipes | Scroll the **All recipes** list (3 static recipes from `data.ts`) |
| Select a recipe | Click a recipe row; active row is highlighted |
| View recipe details | **Details** panel shows name, description, cook time, and serves |
| View ingredients | Ingredients list shows each item and amount for the selected recipe |
| Add recipe ingredients to shopping list | Click **Add to shopping list** — all ingredients are appended and the app navigates to the shopping list |

Static recipes currently available:

- Spaghetti carbonara  
- Chicken tikka masala  
- Vegetable stir-fry  

## Shopping list (`/shopping-list`)

The list is stored **in memory** via the `ShoppingList` service; it resets when the page is refreshed. It is seeded with a few demo items on first load.

| Feature | How |
| --- | --- |
| See item count | Item count chip in the page title |
| Add a custom item | Enter **Ingredient** and **Amount**, then **Add item** (empty amount defaults to `"1"`) |
| Clear the add form | Click **Clear** (name and amount fields reset) |
| View items | **Items** table shows name, amount, and a remove control per row |
| Remove one item | Click **Remove** on a row |
| Empty state | When there are no items, the message *“Your shopping list is empty.”* is shown |

Items added from a recipe use the same list as manually added items (`addAll` / `add` on `ShoppingList`).

## What users cannot do (by design)

- Create, edit, or delete recipes (data is fixed in `src/app/data.ts`).
- Persist accounts, passwords, or shopping lists across reloads.
- Authenticate against a real API or database.