import { Component } from '@angular/core';

@Component({
  selector: 'header-app',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">Address Book App</a>
    </nav>
  `
})
export class HeaderComponent {

  constructor() { }
}
