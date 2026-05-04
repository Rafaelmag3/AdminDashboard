import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PATH_CONSTANTS } from '@constants/path.constants';
import { ProductTable } from '@core/models/product.inteface';
import { NavigationService } from '@core/services/navigation-service';
import { Table } from "@features/products/components/table/table";
import { ProductService } from '@features/services/product-service';

@Component({
  selector: 'products',
  imports: [Table],
  templateUrl: './products.html',
})
export class Products {
  private readonly productsService = inject(ProductService);
  private readonly navigationService = inject(NavigationService);
  private readonly _totalProducts = toSignal(this.productsService.getTotalProducts());
  private readonly _selectedProducts = signal<ProductTable[] | null>(null);
  public readonly totalProducts = computed(() => this._totalProducts());
  public readonly selectedProducts = computed(() => this._selectedProducts());
  public readonly isDisabledDelete = computed(() => {
    const product = this.selectedProducts();
    if (!product) return true;
    const productsSelected = product.some(c => c.checkbox);
    return !productsSelected;
  });

  btnNewProduct() {
    this.navigationService.navigateTo(PATH_CONSTANTS.PRODUCT_FORM);
    this.productsService.dataUpdateProduct.set(null);
  }

  handleSelectedProducts(products: ProductTable[] | null): void {
    this._selectedProducts.set(products);
  }

  handleUpdateProduct(product: ProductTable | null) {
    if (!product) return;
    this.productsService.dataUpdateProduct.set(product);
    this.navigationService.navigateTo(PATH_CONSTANTS.PRODUCT_FORM);
  }
}
