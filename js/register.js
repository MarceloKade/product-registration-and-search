class Product {
    constructor() {
        this.id = 1;
        this.productArray = [];
        this.editId = null;

        this.LoadListLocalStorage();

        this.saveListLocalStorage = this.saveListLocalStorage.bind(this);
        this.LoadListLocalStorage = this.LoadListLocalStorage.bind(this);
    }

    restart() {
        this.id = 1;
        this.productArray = [];
        this.editId = null;
        const divButtons = document.getElementById('buttons');
        const updateButton = document.getElementById('update');
        updateButton.remove();
        const registerButton = document.createElement('button');
        registerButton.id = 'register';
        registerButton.textContent = 'Register';
        divButtons.appendChild(registerButton);

        this.LoadListLocalStorage();

        this.saveListLocalStorage = this.saveListLocalStorage.bind(this);
        this.LoadListLocalStorage = this.LoadListLocalStorage.bind(this);
    }

    scrollProduct(productId) {
        const tr = document.getElementById(`product-${productId}`);
        if (tr) {
            tr.scrollIntoView({ behavior: "smooth" });
            this.editId = null;
        }
    }

    listTable() {
        const tbody = document.getElementById("tbody");
        tbody.innerHTML = "";
        this.focusNameInput();


        for (let i = 0; i < this.productArray.length; i++) {
            this.productArray[i].id = i + 1;
        }

        for (let i = 0; i < this.productArray.length; i++) {
            let tr = tbody.insertRow();
            tr.setAttribute("id", `product-${this.productArray[i].id}`);

            let td_id = tr.insertCell();
            let td_product = tr.insertCell();
            let td_value = tr.insertCell();
            let td_action = tr.insertCell();

            td_id.innerHTML = this.productArray[i].id;
            td_product.innerHTML = this.productArray[i].nameProduct;

            let price = this.productArray[i].price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 10
            });

            if (price.length > 5) {
                price = price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            }

            td_value.innerHTML = price;


            let divImg = document.createElement('div');
            divImg.setAttribute('id', 'divImg');

            let imgEdit = document.createElement("img");
            imgEdit.src = "img/edit.svg";
            imgEdit.setAttribute("onclick", "product.edit(" + JSON.stringify(this.productArray[i]) + ")");


            let imgRemove = document.createElement("img");
            imgRemove.src = "img/remove.svg";
            imgRemove.setAttribute('onclick', 'product.delete(' + this.productArray[i].id + ')');

            td_action.appendChild(divImg);
            divImg.appendChild(imgEdit);
            divImg.appendChild(imgRemove);

            if (this.editId !== null && this.productArray[i].id === this.editId) {
                this.editId = null;
            }
        }
    }

    edit(data) {
        window.scrollTo(0, 0);
        this.focusNameInput();
        if (data) {
            this.editId = data.id;
            document.getElementById('product').value = data.nameProduct;
            let formatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, minimumIntegerDigits: 1 });
            document.getElementById('price').value = formatter.format(parseFloat(data.price));
            const divButtons = document.getElementById('buttons');
            const registerButton = document.getElementById('register');
            registerButton.remove();
            const updateButton = document.createElement('button');
            updateButton.id = 'update';
            updateButton.textContent = 'Update';
            divButtons.appendChild(updateButton);
            document.querySelector('img').removeAttribute('onclick');
            this.createCancelButton();
            let priceInput = document.getElementById('price');
            if (priceInput.value) {
                priceInput.classList.add('focused');
            }
        }
    }

    setBackgroundForPeriod(element, color, duration) {
        const originalColor = element.style.background;
        element.style.background = color;
        setTimeout(() => {
            element.style.background = originalColor;
        }, duration);
    }

    save() {
        const product = this.readData();
        product.source = "register.html";
        if (this.ValidateFields(product)) {
            if (this.editId === null) {
                this.add(product);
                this.listTable();
                const newRow = document.getElementById(`product-${product.id}`);
                this.setBackgroundForPeriod(newRow, 'rgba(255, 255, 255, 0.2)', 2000);
                newRow.scrollIntoView({ behavior: "smooth" });
                newRow.focus();

            } else {
                const prevEditId = this.editId;
                this.update(prevEditId, product);
                this.editId = null;
                const divButtons = document.getElementById('buttons');
                const updateButton = document.getElementById('update');
                updateButton.remove();
                const registerButton = document.createElement('button');
                registerButton.id = 'register';
                registerButton.textContent = 'Register';
                divButtons.appendChild(registerButton);
                const editRow = document.getElementById(`product-${prevEditId}`);
                this.setBackgroundForPeriod(editRow, 'rgba(255, 255, 255, 0.2)', 2000);
                editRow.scrollIntoView({ behavior: "smooth", block: "center" });
                editRow.focus();
            }

            this.inputClear();
            this.saveListLocalStorage();
            this.removeCancelButton()
        }
    }


    add(product) {
        this.productArray.push(product);
        this.id++;
        this.saveListLocalStorage();
    }

    readData() {
        const product = {}
        product.id = this.id;
        product.nameProduct = document.getElementById('product').value;
        product.price = parseFloat(document.getElementById('price').value.replace(/\./g, '').replace(',', '.'))
        return product;
    }

    focusNameInput() {
        document.getElementById("product").focus();

    }

    createCancelButton() {
        const ButtonExiste = document.getElementById('cancel');
        if (!ButtonExiste) {
            const cancelButton = document.createElement('button');
            const buttonsDiv = document.getElementById('buttons');
            cancelButton.setAttribute('id', 'cancel');
            cancelButton.setAttribute('type', 'button');
            cancelButton.onclick = this.cancel.bind(this);
            cancelButton.textContent = "cancel";
            buttonsDiv.appendChild(cancelButton);
        }
    }

    cancel(event) {
        event.preventDefault();
        document.querySelector('img').removeAttribute('onclick');
        this.removeCancelButton();
        this.restart();
        this.inputClear()
    }

    removeCancelButton() {
        const cancelButton = document.getElementById('cancel');
        if (cancelButton) {
            cancelButton.remove();
        }
    }

    ValidateFields(product) {
        let errors = [];

        if (product.nameProduct.trim() === '') {
            errors.push('--Please enter a product name.');
        }

        if (product.price === '') {
            errors.push('--Please enter a product price.');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }

        return true;
    }

    delete(id) {
        const tbody = document.getElementById("tbody");
        for (let i = 0; i < this.productArray.length; i++) {
            if (this.productArray[i].id === id) {
                this.productArray.splice(i, 1);
                tbody.deleteRow(i);
                break;
            }
        }
        this.saveListLocalStorage();
        this.focusNameInput();

    }

    inputClear() {
        document.getElementById('product').value = '';
        document.getElementById('price').value = '';
    }

    update(id, product) {
        for (let i = 0; i < this.productArray.length; i++) {
            if (this.productArray[i].id == id) {
                this.productArray[i].nameProduct = product.nameProduct;
                this.productArray[i].price = product.price;
                break;
            }
        }

        const editedRow = document.getElementById(`product-${id}`);
        this.setBackgroundForPeriod(editedRow, 'rgba(255, 255, 255, 0.2)', 3000);

        this.inputClear();
        this.saveListLocalStorage();
        this.removeCancelButton();
        this.listTable();
    }

    saveListLocalStorage() {
        localStorage.setItem('productArray', JSON.stringify(this.productArray));
    }

    LoadListLocalStorage() {
        const listLocalStorage = JSON.parse(localStorage.getItem('productArray'));

        if (listLocalStorage !== null) {
            this.productArray = listLocalStorage;
            this.id = this.productArray.length + 1;
            this.listTable();
        }
    }
}

const product = new Product();
window.scrollTo(0, 0);

const form = document.querySelector('form');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!product.ValidateFields({ nameProduct: nameProduct.value, price: priceInput.value })) {
        return;
    }

    priceInput.value = formatter.format(number).replace('R$', '').trim();
    product.save();
});

const nameProduct = document.getElementById('product');
const priceInput = document.getElementById('price');

let number;
let formatter;
priceInput.addEventListener('input', function () {
    let value = priceInput.value;
    value = value.replace(/[^0-9]/g, '');
    number = !Number(value) ? 0 : parseFloat(value, 10) / 100;
    formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 10
    });
    priceInput.value = formatter.format(number);
});