// js/validation.js

console.log('Файл validation.js подключён!');

document.addEventListener('DOMContentLoaded', () => {
  // Переименовали переменную, чтобы не конфликтовать с main.js
  const pageOrderForm = document.querySelector('.order-form');

  if (!pageOrderForm) {
    console.warn('Форма .order-form не найдена на странице!');
    return;
  }

  console.log('Форма найдена, настраиваем валидацию.');

  const nameInput = pageOrderForm.querySelector('#order-name');
  const emailInput = pageOrderForm.querySelector('#order-email');
  const phoneInput = pageOrderForm.querySelector('#order-phone');

  const nameError = pageOrderForm.querySelector('#order-name-error');
  const emailError = pageOrderForm.querySelector('#order-email-error');
  const phoneError = pageOrderForm.querySelector('#order-phone-error');

  const formMessage = pageOrderForm.querySelector('.form-message');

  if (!nameInput || !emailInput || !phoneInput) {
    console.error('Ошибка: Одно из полей (name, email, phone) не найдено в HTML!');
    return;
  }

  function showError(input, errorElement, message) {
    if (errorElement) errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    if (errorElement) input.setAttribute('aria-describedby', errorElement.id);
  }

  function clearError(input, errorElement) {
    if (errorElement) errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (value.length < 2) {
      showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
      return false;
    }
    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, 'Введите корректный e-mail.');
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    const phonePattern = /^[0-9+\-()\s]+$/;
    if (value.length < 6 || !phonePattern.test(value)) {
      showError(phoneInput, phoneError, 'Введите корректный номер телефона.');
      return false;
    }
    clearError(phoneInput, phoneError);
    return true;
  }

  pageOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('Попытка отправки формы...');

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid;

    if (!isFormValid) {
      if (formMessage) formMessage.textContent = 'Проверьте поля формы.';
      console.warn('Форма не прошла валидацию.');
      return;
    }

    const requestData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim()
    };

    console.table(requestData);
    if (formMessage) formMessage.textContent = 'Заявка подготовлена. Данные выведены в консоль.';
    pageOrderForm.reset();
  });

  // Проверка при вводе
  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
});