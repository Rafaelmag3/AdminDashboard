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
  public readonly serviceErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (!response.data) {
          this.serviceErrorMessage.set('No Recent Activity Products');
          this._products.set(null);
          return;
        }
        this._products.set(response.data);
        this.serviceErrorMessage.set(null);
      },
      error: (error) => {
        this.serviceErrorMessage.set(error.message);
        this._products.set(null);
      }
    });
  }

  btnReloadProducts(): void {
    this.getProducts();
  }
}
