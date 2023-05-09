class ProductsLocalStorage {
    constructor(id, nameProduct, price) {
        this.id = id;
        this.nameProduct = nameProduct;
        this.price = price;
    }

    removeAccents(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    includesSearchTerm(SearchTerm) {
        const nameWithoutAccents = this.removeAccents(this.nameProduct.toLowerCase());
        const termWithoutAccents = this.removeAccents(SearchTerm);
        return nameWithoutAccents.includes(termWithoutAccents) || this.id == SearchTerm;
    }

    render() {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = `${this.id}: ${this.nameProduct}`;

        const tdPrice = document.createElement('td');
        tdPrice.textContent = `R$ ${this.price.toFixed(2)}`;

        tr.appendChild(tdName);
        tr.appendChild(tdPrice);

        return tr;
    }
}

class ProductsSearch {
    constructor() {
        this.products = [];
        this.resultList = document.getElementById('result-list');
        this.searchInput = document.getElementById('search');
        this.searchInput.addEventListener('input', () => {
            const SearchTerm = this.searchInput.value.toLowerCase();
            if (SearchTerm === '') {
                this.resultList.innerHTML = '';
                return;
            }
            const filteredProducts = this.products.filter(product => product.includesSearchTerm(SearchTerm));
            this.resultList.innerHTML = '';
            filteredProducts.forEach(product => {
                this.resultList.appendChild(product.render());
            });
        });

        this.loadProducts();
        this.searchInput.focus()
    }

    loadProducts() {
        const productsLocalStorage = JSON.parse(localStorage.getItem('productArray'));
        if (productsLocalStorage) {
            this.products = productsLocalStorage.map(p => new ProductsLocalStorage(p.id, p.nameProduct, p.price));
        }
    }
}

const productsSearch = new ProductsSearch();