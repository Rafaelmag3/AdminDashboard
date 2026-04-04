import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from '@shared/menu/menu';

@Component({
  selector: 'shared-layout',
  imports: [Menu, RouterOutlet],
  templateUrl: './layout.html',
})
export class Layout {

}
