// ===================================
// Модальное окно заявки
// ===================================
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('[data-product]');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

if (orderDialog && orderButtons.length) {
  // Открытие модалки по кнопке «Заказать»
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product || 'Не указан';
      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }
      orderDialog.showModal();
    });
  });

  // Закрытие модалки
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }

  // Закрытие по клику вне окна
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
}

// ===================================
// Обработка формы в модалке
// ===================================
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Сброс старых ошибок
    const formElements = Array.from(orderForm.elements);
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверка валидности
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      orderForm.reportValidity();
      return;
    }

    // Успешная отправка
    // Сохраняем заявку в localStorage
    const orderData = {
      name: orderForm.elements.name?.value || '',
      email: orderForm.elements.email?.value || '',
      product: selectedProductInput?.value || '',
      date: new Date().toISOString(),
    };
    try {
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
    } catch (e) {
      console.warn('localStorage недоступен', e);
    }

    if (successMessage) {
      successMessage.hidden = false;
    }
    orderForm.reset();
    if (orderDialog) {
      orderDialog.close();
    }
  });
}

// ===================================
// Обработка формы на странице order.html
// ===================================
const pageOrderForm = document.getElementById('order-form-page');
const pageSuccessMessage = document.getElementById('success-message-page');

if (pageOrderForm) {
  pageOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(pageOrderForm.elements);
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!pageOrderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      pageOrderForm.reportValidity();
      return;
    }

    if (pageSuccessMessage) {
      pageSuccessMessage.hidden = false;
    }
    pageOrderForm.reset();
  });
}

// ===================================
// Фильтр каталога (старая логика по data-атрибутам, работает до ПЗ №17)
// ===================================
const filtersForm = document.getElementById('filters-form');

if (filtersForm) {
  const cards = document.querySelectorAll('.catalog-products .product-card');
  const priceFrom = document.getElementById('price-from');
  const priceTo = document.getElementById('price-to');

  const applyFilters = () => {
    // Собираем отмеченные категории
    const checkedCategories = Array.from(
      filtersForm.querySelectorAll('input[name="category"]:checked')
    ).map((cb) => cb.value);

    // Считываем диапазон цены
    const minPrice = priceFrom && priceFrom.value ? Number(priceFrom.value) : 0;
    const maxPrice = priceTo && priceTo.value ? Number(priceTo.value) : Infinity;

    // Показываем/прячем карточки
    cards.forEach((card) => {
      const category = card.dataset.category;
      const price = Number(card.dataset.price);

      const categoryMatch =
        checkedCategories.length === 0 || checkedCategories.includes(category);
      const priceMatch = price >= minPrice && price <= maxPrice;

      card.style.display = categoryMatch && priceMatch ? '' : 'none';
    });
  };

  // Фильтрация при изменении чекбоксов
  filtersForm.addEventListener('change', applyFilters);

  // Фильтрация при нажатии «Применить»
  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });
}

// ===================================
// Приветствие при повторном визите
// ===================================
const welcomeBanner = document.getElementById('welcome-banner');
const welcomeText = document.getElementById('welcome-text');
const welcomeClose = document.getElementById('welcome-close');

if (welcomeBanner && welcomeText) {
  try {
    const saved = localStorage.getItem('lastOrder');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name) {
        welcomeText.textContent = `${data.name}, рады видеть вас снова! Хотите оставить новую заявку?`;
        welcomeBanner.hidden = false;
      }
    }
  } catch (e) {
    console.warn('Не удалось прочитать lastOrder', e);
  }

  if (welcomeClose) {
    welcomeClose.addEventListener('click', () => {
      welcomeBanner.hidden = true;
    });
  }
}

// ===================================
// Подстановка данных товара по URL-параметру ?id=N
// (объект переименован в productDetailData, чтобы не путать с массивом из data.js)
// ===================================
const productDetailData = {
  1: { title: 'Товар 1', price: 1000, image: 'images/product-1.jpg', category: 'Электроника', badge: 'Скидка' },
  2: { title: 'Товар 2', price: 1500, image: 'images/product-2.jpg', category: 'Аудио', badge: null },
  3: { title: 'Товар 3', price: 2000, image: 'images/product-3.jpg', category: 'Компьютеры', badge: 'Новинка' },
  4: { title: 'Товар 4', price: 2500, image: 'images/product-4.jpg', category: 'Электроника', badge: null },
  5: { title: 'Товар 5', price: 3000, image: 'images/product-5.jpg', category: 'Аудио', badge: null },
  6: { title: 'Товар 6', price: 3500, image: 'images/product-6.jpg', category: 'Компьютеры', badge: null },
};

const productDetail = document.querySelector('.product-detail');

if (productDetail) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || '1';
  const product = productDetailData[id];

  if (product) {
    // Меняем title страницы
    document.title = `${product.title} — Учебный интернет-магазин`;

    // Меняем фото
    const img = productDetail.querySelector('.product-detail__image img');
    if (img) {
      img.src = product.image;
      img.alt = product.title;
    }

    // Меняем заголовок
    const h1 = productDetail.querySelector('h1');
    if (h1) h1.textContent = product.title;

    // Меняем цену
    const price = productDetail.querySelector('.product-detail__price');
    if (price) price.textContent = `Цена: ${product.price} руб.`;

    // Меняем бейдж
    const badge = productDetail.querySelector('.product-card__badge');
    if (badge) {
      if (product.badge) {
        badge.textContent = product.badge;
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    }

    // Меняем категорию в таблице
    const categoryCell = document.querySelector('.product-table tbody tr:first-child td:last-child');
    if (categoryCell) categoryCell.textContent = product.category;

    // Меняем цену в таблице
    const priceCell = document.querySelector('.product-table tbody tr:nth-child(2) td:last-child');
    if (priceCell) priceCell.textContent = `${product.price} руб.`;

    // Меняем data-product у кнопки «Заказать»
    const orderBtn = productDetail.querySelector('[data-product]');
    if (orderBtn) orderBtn.dataset.product = product.title;

    // Показываем блок после подстановки
    productDetail.classList.add('is-loaded');
  }
}

// ===================================
// ПЗ №15: Базовые функции и безопасный вывод
// ===================================
console.log('Файл main.js подключён');

// Функция форматирования цены
function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} руб.`;
}

// Функция расчета размера скидки
function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

// Функция расчета итоговой цены
function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

// Функция определения статуса товара
function getProductStatus(product) {
  if (product.isAvailable) {
    return 'В наличии';
  }
  return 'Нет в наличии';
}

// Функция создания краткого описания
function createProductSummary(product) {
  const finalPrice = calculateFinalPrice(product.price, product.discountPercent);
  const status = getProductStatus(product);
  return `${product.title}: ${formatPrice(finalPrice)}. Статус: ${status}.`;
}

// ===================================
// ПЗ №16: Функции обработки массива товаров
// ===================================

// 1. Получение названий товаров
function getProductTitles(products) {
  return products.map((product) => product.title);
}

// 2. Получение товаров в наличии
function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

// 3. Поиск по названию
function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') {
    return products;
  }
  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

// 4. Фильтрация по категории
function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }
  return products.filter((product) => {
    return product.category === category;
  });
}

// 5. Сортировка по цене
function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];
  if (direction === 'desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }
  return productsCopy.sort((a, b) => a.price - b.price);
}

// 6. Поиск по ID
function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

// 7. Расчёт общей стоимости
function calculateTotalPrice(products) {
  return products.reduce((sum, product) => {
    return sum + product.price;
  }, 0);
}

// 8. Подсчёт товаров в наличии
function countAvailableProducts(products) {
  return products.filter((product) => product.isAvailable).length;
}

// 9. Расчёт средней цены
function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }
  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}

// 10. Комбинированная функция
function getPreparedProducts(products, query, category, sortDirection) {
  let result = [...products];
  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);
  return result;
}

// ===================================
// ПЗ №16: Проверка в консоли и вывод на страницу
// ===================================
console.log('--- ПЗ №16: Проверка функций ---');
console.log('Названия товаров:', getProductTitles(window.productsData));
console.table('Товары в наличии:', getAvailableProducts(window.productsData));
console.table('Поиск "ко":', searchProducts(window.productsData, 'ко'));
console.table('Категория "kitchen":', filterProductsByCategory(window.productsData, 'kitchen'));
console.table('Сортировка по возрастанию:', sortProductsByPrice(window.productsData, 'asc'));
console.log('Поиск по ID 3:', findProductById(window.productsData, 3));
console.log('Общая стоимость:', calculateTotalPrice(window.productsData));
console.log('В наличии:', countAvailableProducts(window.productsData));
console.log('Средняя цена:', calculateAveragePrice(window.productsData));

// Вывод краткой статистики на страницу
const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement) {
  messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
}

if (productOutputElement) {
  productOutputElement.textContent = [
    `Всего товаров: ${window.productsData.length}`,
    `Товаров в наличии: ${countAvailableProducts(window.productsData)}`,
    `Средняя цена: ${calculateAveragePrice(window.productsData)} руб.`,
    `Результатов поиска "ко": ${searchProducts(window.productsData, 'ко').length}`
  ].join('\n');
}