import { Component, computed, effect, ElementRef, inject, OnInit, output, signal, viewChild } from '@angular/core';
import { PaginatedResponse, PageChangeEvent } from '@core/models/pagination.inteface';
import { ProductTable } from '@core/models/product.inteface';
import { CurrencyPipe } from '@core/pipes/currency-pipe';
import { UserStoreService } from '@core/services/user-store-service';
import { ProductService } from '@features/services/product-service';
import { Pagination } from '@shared/pagination/pagination';

@Component({
  selector: 'product-table',
  imports: [Pagination, CurrencyPipe],
  templateUrl: './table.html',
})
export class Table implements OnInit {
  private readonly productsService = inject(ProductService);
  private readonly userStoreService = inject(UserStoreService);
  public readonly tableCheckbox = viewChild<ElementRef<HTMLInputElement>>('tableCheckbox');
  private readonly _products = signal<ProductTable[] | null>(null);
  public readonly products = computed(() => this._products());
  public readonly isAdmin = computed(() => this.userStoreService.getIsAdmin());
  public readonly productsSelected = output<ProductTable[] | null>();
  public readonly productsUpdated = output<ProductTable | null>();

  public readonly pagination = signal<PaginatedResponse>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  public readonly headerProducts = [
    { name: 'Checkbox', key: 'checkbox', showName: false },
    { name: 'Type Service', key: 'typeService', showName: true },
    { name: 'Description', key: 'description', showName: true },
    { name: 'Price', key: 'price', showName: true },
    { name: 'Duration Service', key: 'durationService', showName: true },
    { name: 'Actions', key: 'actions', showName: true }
  ];

  constructor() {
    effect(() => {
      this.updateMasterCheckbox();
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(page: number = 1, limit: number = 10): void {
    this.productsService.getProducts({ page, limit }).subscribe({
      next: (response) => {
        if (!response || !response.data) {
          this._products.set(null);
          return;
        }
        this._products.set(response.data.map((product) => ({
          ...product,
          checkbox: false
        })));
        this.pagination.set({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
          hasNext: response.hasNext,
          hasPrev: response.hasPrev
        })
      },
      error: () => {
        this._products.set(null);
      }
    })
  }

  checkAllProducts(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this._products.update(products =>
      products?.map(c => ({ ...c, checkbox: checked })) || null
    );
    this.productsSelected.emit(this.products());
  }

  selectProducts(product: ProductTable): void {
    this._products.update(products =>
      products?.map(c =>
        c.idService === product.idService
          ? { ...c, checkbox: !c.checkbox }
          : c
      ) || null
    );
    this.getSelectedProducts()
  }

  private updateMasterCheckbox(): void {
    const all = this.products();
    const totalSelected = all?.filter(c => c.checkbox).length;
    const checkbox = this.tableCheckbox()?.nativeElement;
    if (!checkbox) return;
    if (totalSelected === 0) {
      checkbox.checked = false;
      return;
    }
    if (totalSelected === all?.length) {
      checkbox.checked = true;
      return;
    }
    checkbox.checked = false;
  }

  onPageChange(event: PageChangeEvent): void {
    this.pagination.set({
      ...this.pagination(),
      page: event.page,
      limit: event.limit
    });
    this.getProducts(this.pagination().page, this.pagination().limit);
  }

  getSelectedProducts(): void {
    const selectedProducts = this.products()?.filter(product => product.checkbox);
    if (!selectedProducts) return;
    this.productsSelected.emit(selectedProducts);
  }

  btnUpdateProduct(product: ProductTable): void {
    this.productsUpdated.emit(product);
  }
}
