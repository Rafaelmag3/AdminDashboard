import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DeviceType } from '@shared/models/device-type.inteface';
import { map } from 'rxjs';
import { MENU_CONSTANTS } from 'src/app/constants/menu.constants';

@Injectable({
  providedIn: 'root',
})
export class DeviceTypeService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /** Returns the current device type based on screen size */
  public readonly device = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).pipe(
      map((): DeviceType => {
        if (this.breakpointObserver.isMatched(Breakpoints.Handset)) return MENU_CONSTANTS.MOBILE;
        if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) return MENU_CONSTANTS.TABLET;
        return MENU_CONSTANTS.DESKTOP;
      })
    ),
    { initialValue: MENU_CONSTANTS.DESKTOP as DeviceType }
  );
}
