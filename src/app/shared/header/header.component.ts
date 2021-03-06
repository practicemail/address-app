import { Component } from '@angular/core';

@Component({
  selector: 'header-app',
  template: `
    <header>
        <nav class="navbar navbar-light bg-info">
          <div class="container">
            <a class="navbar-brand text-light" href="/">Address Book</a>
            <a href="#" class="text-light">Sign in</a>
            <a style="display: none" href="#" class="text-light">Sign out</a>
          </div>
        </nav>
    </header>
  `
})
export class HeaderComponent {

  constructor() { }
}
