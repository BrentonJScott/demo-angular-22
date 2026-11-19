import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  template: `
    <main class="auth login">
      <div class="card login-card">
        <div class="login-header">
          <span class="logo" aria-hidden="true">🍳</span>
          <h1>Log in</h1>
          <p class="muted">Welcome back. Log in to see your recipes and shopping list.</p>
        </div>
        <form>
          <div>
            <label class="label" for="email">Email</label>
            <input class="input" id="email" type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label class="label" for="password">Password</label>
            <input class="input" id="password" type="password" placeholder="Enter your password" />
          </div>
          <!-- Demo only: the button just goes to the recipes page. -->
          <a class="btn btn-primary" routerLink="/recipes">Log in</a>
          <p class="muted signup">
            Don't have an account? <a routerLink="/register">Create one</a>
          </p>
        </form>
      </div>
      <p class="muted note">Demo app. Sign-in isn't connected to a backend.</p>
    </main>
  `,
  styles: `
    .login {
      max-width: 440px;
    }
    .login-card {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding: 32px;
      border-top: 4px solid var(--brand);
      box-shadow: 0 12px 32px oklch(0 0 0 / 0.08);
    }
    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-align: center;
    }
    .logo {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 9999px;
      background: var(--brand);
      font-size: 24px;
    }
    .signup,
    .note {
      text-align: center;
    }
  `,
})
export class Login {}
