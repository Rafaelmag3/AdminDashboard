import { Component, input } from '@angular/core';

@Component({
  selector: 'shared-card',
  imports: [],
  templateUrl: './card.html',
})
export class Card {
  stylesCard = input<string>();
}
