import { Component, input } from '@angular/core';
import { DashboardCardItem } from '@features/dashboard/models/dashboard-card-item.interface';
import { Card } from '@shared/card/card';

@Component({
  selector: 'dashboard-card',
  imports: [Card],
  templateUrl: './dashboard-card.html',
})
export class DashboardCard {
  public readonly cardItem = input.required<DashboardCardItem>();
}
