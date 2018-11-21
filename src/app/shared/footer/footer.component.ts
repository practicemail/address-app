import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
        <section class="new-slider">
          <carousel-component >
            <div class="item-carousel">
              <div class="a" style="max-width: 300px; height: 100px">
                <img style="display: block; width: 100%" src="assets/images/ninja.png" alt="avatar-img" />
              </div>
            </div>
            <div class="item-carousel">
              <div class="b" style="max-width: 300px; height: 100px">
                <img style="display: block; width: 100%" src="assets/images/ninja.png" alt="avatar-img" />
              </div>
            </div>
            <div class="item-carousel">
              <div class="c" style="max-width: 300px; height: 100px">
                <img style="display: block; width: 100%" src="assets/images/ninja.png" alt="avatar-img" />
              </div>
            </div>
          </carousel-component>
      </section>
    </footer>
  `
})
export class FooterComponent {

  constructor() { }
}
