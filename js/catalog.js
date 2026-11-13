// js/catalog.js

// 1. Поиск элементов на странице
const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');

if (!productsContainer) {
  console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
}

// 2. Состояние каталога
const catalogState = {
  query: '',
  category: 'all',
  sort: 'default'
};

// 3. Функции подготовки данных (из ПЗ №16)
function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '') return products;
  return products.filter((product) => product.title.toLowerCase().includes(normalizedQuery));
}

function filterProductsByCategory(products, category) {
  if (category === 'all') return products;
  return products.filter((product) => product.category === category);
}

function sortProducts(products, sortType) {
  const productsCopy = [...products];
  if (sortType === 'price-asc') return productsCopy.sort((a, b) => a.price - b.price);
  if (sortType === 'price-desc') return productsCopy.sort((a, b) => b.price - a.price);
  if (sortType === 'title-asc') return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
  return productsCopy;
}

function getPreparedProducts(products, state) {
  let result = [...products];
  result = searchProducts(result, state.query);
  result = filterProductsByCategory(result, state.category);
  result = sortProducts(result, state.sort);
  return result;
}

// 4. Функция форматирования цены
function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} руб.`;
}

// 5. Создание карточки через createElement (безопасно, без innerHTML)
function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  // Бейдж скидки
  if (product.discountPercent > 0) {
    const badge = document.createElement('span');
    badge.classList.add('product-card__badge');
    badge.textContent = 'Скидка';
    card.append(badge);
  }

  // Картинка (используем заглушку, если картинки нет)
  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image || 'https://via.placeholder.com/300x200?text=No+Image';
  image.alt = product.title;
  card.append(image);

  // Заголовок
  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = product.title;
  card.append(title);

  // Описание (если нет — ставим заглушку)
  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = product.description || 'Краткое описание учебного товара.';
  card.append(description);

  // Цена
  const price = document.createElement('p');
  price.classList.add('product-card__price');
  price.textContent = `Цена: ${formatPrice(product.price)}`;
  card.append(price);

  // Статус
  const status = document.createElement('p');
  status.classList.add('product-card__status');
  status.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';
  card.append(status);

  // Кнопка "В корзину"
  const button = document.createElement('button');
  button.classList.add('button', 'button--primary', 'product-card__button');
  button.type = 'button';
  button.textContent = 'В корзину';
  button.dataset.action = 'add-to-cart';
  button.dataset.productId = String(product.id);

  if (!product.isAvailable) {
    button.disabled = true;
    button.textContent = 'Недоступно';
  }

  card.append(button);
  
  const detailsLink = document.createElement('a');
  detailsLink.classList.add('button', 'button--secondary', 'product-card__button');
  detailsLink.href = `product.html?id=${product.id}`;
  detailsLink.textContent = 'Подробнее';
  card.append(detailsLink);

  return card;
}

// 6. Рендер каталога
function renderProducts(productsToRender) {
  productsContainer.textContent = '';

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = productsToRender.length > 0;
  }

  productsToRender.forEach((product) => {
    const card = createProductCard(product);
    productsContainer.append(card);
  });
}

// 7. Обновление каталога
function updateCatalog() {
  const preparedProducts = getPreparedProducts(window.productsData, catalogState);
  renderProducts(preparedProducts);
}

// 8. Обработчики событий
if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    updateCatalog();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', (event) => {
    catalogState.category = event.target.value;
    updateCatalog();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    updateCatalog();
  });
}

// 9. Первичный вывод
if (productsContainer) {
  updateCatalog();
}

// 10. Делегирование событий для кнопок "В корзину"
if (productsContainer) {
  productsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="add-to-cart"]');
    if (!button) return;

    const productId = Number(button.dataset.productId);
    
    // Вызываем функцию из cart.js
    if (typeof addToCart === 'function') {
      addToCart(productId);
      
      // Визуальный фидбек (кнопка на секунду меняет текст)
      const originalText = button.textContent;
      button.textContent = 'Добавлено ✓';
      button.classList.add('button--success');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('button--success');
      }, 1000);
    }
  });
}