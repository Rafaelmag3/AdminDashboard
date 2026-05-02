export interface Customer {
    idCustomer: number,
    name: string,
    lastName: string,
    phoneNumber: string | null,
    email: string | null,
    createdAt: string
}

export interface CustomerTable extends Customer {
    checkbox: boolean,
}

export interface NewCustomer {
    name: string,
    lastName: string,
    phoneNumber: string,
    email: string,
}

