# Documented user features

This document lists features that a user can perform in the **Recipe Book** demo app (`cc-demo-angular`). The app is frontend-only: there is no API, no database, and login/register do not validate or persist credentials. The shopping list is held in memory and resets on page refresh.

## Global navigation

- **Open the app**: The default route sends users to the **Log in** page (`/` redirects to `/#/login`).
- **Header navigation**: From any page, use the header to go to **Recipes**, **Shopping list**, or **Recipe Book** (logo, links to Recipes).
- **Auth actions in header**: On login/register routes, the header shows **Log in**; on other routes it shows **Log out** (navigates to login—no server session).
- **Hash URLs**: Routes use hash-based URLs (e.g. `/#/recipes`, `/#/shopping-list`) so the static build works without server rewrite rules.
- **Unknown routes**: Any unrecognized path redirects to the login page.

## Log in (demo)

- **View the login screen**: Email and password fields with labels and placeholders.
- **Proceed as logged in**: **Log in** navigates to the Recipes page (no backend validation).
- **Switch to registration**: **Create one** on the login page goes to **Create account**.
- **See demo notice**: Footer text explains sign-in is not connected to a backend.

## Create account (demo)

- **View the registration form**: Fields for name, email, password, and confirm password.
- **Proceed after sign-up**: **Create account** navigates to the Recipes page (no backend).
- **Switch to login**: **Log in** link returns to the **Log in** page.
- **See demo notice**: Footer text explains sign-up is not connected to a backend.

## Recipes

- **Browse recipes**: See a list of all recipes with name, short description, prep time, and serving size.
- **Recipe count**: The page title shows how many recipes are available.
- **Select a recipe**: Click a recipe in the list to highlight it and load its details.
- **View details**: For the selected recipe, see full description, time, serves, and a full ingredients list with amounts.
- **Add ingredients to shopping list**: **Add to shopping list** copies all ingredients for the current recipe into the shopping list and navigates to the Shopping list page.

Preloaded demo recipes include **Spaghetti carbonara**, **Chicken tikka masala**, and **Vegetable stir-fry**.

## Shopping list

- **View items**: See all shopping list items with ingredient name and amount; the title shows the item count.
- **Add a custom item**: Enter **Ingredient** and **Amount**, then **Add item** (default amount `1` if amount is empty; name required).
- **Clear the add form**: **Clear** resets the ingredient and amount fields without submitting.
- **Remove an item**: **Remove** on a row deletes that item from the list.
- **Empty state**: When there are no items, the list shows “Your shopping list is empty.”

The list is initialized with sample items in the demo and merges in ingredients added from recipes. Changes are lost on full page refresh.

## What users cannot do (by design)

- Persist accounts, passwords, or sessions across visits.
- Save the shopping list after refresh.
- Create, edit, or delete recipes in the UI (recipes are static data in `src/app/data.ts`).
- Authenticate against a real identity provider or API.