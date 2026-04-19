import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Product } from '@core/models/product.inteface';
import { ProductService } from '@features/services/product-service';
import { Card } from '@shared/card/card';

@Component({
  selector: 'recent-products',
  imports: [Card],
  templateUrl: './recent-products.html',
})
export class RecentProducts implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly _products = signal<Product[] | null>(null);
  public readonly products = computed(() => this._products());

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts() {
    this.productService.getProducts().subscribe(response => {
      if (!response.data) {
        this._products.set(null);
        return;
      }
      this._products.set(response.data);
    });
  }

  btnReloadProducts(): void {
    this.getProducts();
  }
}
