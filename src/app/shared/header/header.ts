import { Component, input } from '@angular/core';
import { environment } from '@env/environment';
import { Card } from '@shared/card/card';

@Component({
  selector: 'shared-header',
  imports: [Card],
  templateUrl: './header.html',
})
export class Header {
  public readonly currentNamePage = input.required<string>();
  public readonly imageUser = environment.TEST_USER_PHOTO_URL;
}
