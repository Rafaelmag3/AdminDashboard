export interface Product {
    idService: number;
    typeService: string;
    description: string;
    durationService: string;
    price: string;
};

export interface ProductTable extends Product {
    checkbox: boolean,
}