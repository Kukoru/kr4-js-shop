// js/cart.js

// 1. Инициализация корзины из localStorage
let cart = [];
try {
  const savedCart = localStorage.getItem('shopCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
} catch (e) {
  console.warn('Ошибка чтения корзины', e);
}

// 2. Функция сохранения корзины
function saveCart() {
  try {
    localStorage.setItem('shopCart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Не удалось сохранить корзину', e);
  }
}

// 3. Функция добавления товара
function addToCart(productId) {
  // Ищем товар в массиве
  const product = window.productsData.find(p => p.id === productId);
  if (!product) return;

  // Проверяем, есть ли уже такой товар в корзине
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart();
  updateCartUI();
  console.log(`Товар "${product.title}" добавлен в корзину.`);
}

// 4. Функция удаления товара
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
  if (typeof renderCartPage === 'function') {
    renderCartPage(); // Обновляем страницу корзины, если мы на ней
  }
}

// 5. Функция изменения количества
function changeQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart();
    updateCartUI();
    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  }
}

// 6. Подсчёт общей суммы
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// 7. Подсчёт общего количества
function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// 8. Обновление счётчика в шапке (если он есть)
function updateCartUI() {
  const counterElements = document.querySelectorAll('.cart-counter');
  const totalCount = getCartCount();
  
  counterElements.forEach(el => {
    el.textContent = totalCount;
    // Если товаров нет, можно скрыть счётчик (по желанию)
    // el.style.display = totalCount > 0 ? 'inline-block' : 'none';
  });
}

// 9. Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});