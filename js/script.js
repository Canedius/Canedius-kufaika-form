const productType = document.getElementById('productType');
const colorSection = document.getElementById('colorSection');
const colorSelect = document.getElementById('color');
const sizeQuantitySection = document.getElementById('sizeQuantitySection');
const addMoreSection = document.getElementById('addMoreSection');
const addMoreButton = document.getElementById('addMore');
const submitButton = document.getElementById('submitButton');
let sizeQuantityCount = 1;

const oversizeKufaikaSizes = ['XS/S', 'M/L', 'XL/XXL'];
const standardSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const ecoBag = 'Еко сумка Kufaika, саржа (38х40 см, 240 г/м², 100% бавовна)';
const shoppers = 'Шопери Kufaika в Кроях';
const blackWhiteOnlyTypes = ['Футболка OVERSIZE Kufaika', 'Футболка Lightness Kufaika', 'Футболка Relaxed Kufaika', 'Світшот Легкий Kufaika Unisex', 'Світшот Утеплений Kufaika Unisex'];
const hoodieLight = 'Худі Легкий Kufaika Unisex';
const hoodieHeavy = 'Худі Утеплений Kufaika Unisex';

const colorOptions = {
  'Футболка Premium Kufaika': ['Чорний(BK)', 'Білий(WH)', 'Бежевий (NU)', 'Олива (OG)', 'Сірий (GB)', 'Койот (KT)', 'Ніжно-рожевий (PK)'],
  [hoodieLight]: ['Чорний(BK)'],
  [hoodieHeavy]: ['Чорний(BK)', 'Білий(WH)', 'Ніжно-рожевий (PK)', 'Бежевий (NU)', 'Олива (OG)', 'Сірий Грі (GF)', 'Хакі (KH)'],
  [ecoBag]: ['Чорний(BK)', 'Темно-Синій'],
  default: ['Чорний(BK)', 'Білий(WH)', 'Темно-Синій', 'Бежевий (NU)', 'Олива (OG)', 'Сірий (GB)', 'Койот (KT)', 'Ніжно-рожевий (PK)', 'Сірий Грі (GF)', 'Хакі (KH)']
};

// Функція для оновлення опцій кольорів 123
function updateColorOptions() {
  const selectedProduct = productType.value;
  if (selectedProduct === shoppers) {
    colorSection.classList.add('hidden');
    return;
  }
  const colors = blackWhiteOnlyTypes.includes(selectedProduct) ? ['Чорний(BK)', 'Білий(WH)'] : (colorOptions[selectedProduct] || colorOptions.default);
  colorSelect.innerHTML = '<option value="">Виберіть колір</option>';
  colors.forEach(color => {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color;
    colorSelect.appendChild(option);
  });
  colorSection.classList.remove('hidden');
}

// Функція для отримання вибраних розмірів
function getSelectedSizes() {
  const selectedSizes = [];
  for (let i = 1; i <= sizeQuantityCount; i++) {
    const sizeSelect = document.getElementById(`size${i}`);
    if (sizeSelect && sizeSelect.value) {
      selectedSizes.push(sizeSelect.value);
    }
  }
  return selectedSizes;
}

// Функція для оновлення опцій розмірів і відображення кількості
function updateSizeOptions() {
  const selectedProduct = productType.value;
  const isEcoBagOrShopper = selectedProduct === ecoBag || selectedProduct === shoppers;
  const selectedSizes = getSelectedSizes();

  const sizeSelects = document.querySelectorAll('select[name^="size"]');
  sizeSelects.forEach((select, index) => {
    const currentValue = select.value;
    select.innerHTML = '<option value="">Виберіть розмір</option>';
    let sizes = selectedProduct === 'Футболка OVERSIZE Kufaika' ? oversizeKufaikaSizes : standardSizes;

    if (isEcoBagOrShopper) {
      select.disabled = true;
      select.parentElement.classList.add('hidden');
      select.closest('.size-quantity-group').querySelector('.quantity-field').classList.remove('hidden');
      select.closest('.size-quantity-group').querySelector('input[name^="quantity"]').disabled = false;
      return;
    }

    select.disabled = false;
    select.parentElement.classList.remove('hidden');
    select.closest('.size-quantity-group').querySelector('input[name^="quantity"]').disabled = false;

    sizes.filter(size => !selectedSizes.includes(size) || size === currentValue).forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.textContent = size;
      select.appendChild(option);
    });

    if (currentValue && sizes.includes(currentValue)) {
      select.value = currentValue;
    }

    // Показуємо поле кількості, якщо розмір вибрано
    const quantityField = select.closest('.size-quantity-group').querySelector('.quantity-field');
    if (currentValue && !isEcoBagOrShopper) {
      quantityField.classList.remove('hidden');
    } else if (!isEcoBagOrShopper) {
      quantityField.classList.add('hidden');
    }
  });
}

// Функція для перевірки, чи всі поля заповнені
function checkFormCompletion() {
  const selectedProduct = productType.value;
  const isEcoBagOrShopper = selectedProduct === ecoBag || selectedProduct === shoppers;
  const color = colorSelect.value;
  const allFieldsFilled = productType.value && 
    (selectedProduct === shoppers ? true : color) &&
    Array.from({ length: sizeQuantityCount }, (_, i) => {
      const size = document.getElementById(`size${i + 1}`)?.value;
      const quantity = Number(document.getElementById(`quantity${i + 1}`)?.value) || 0;
      return isEcoBagOrShopper ? quantity > 0 : (size && quantity > 0);
    }).every(Boolean);

  submitButton.disabled = !allFieldsFilled;
  submitButton.style.opacity = allFieldsFilled ? '1' : '0.5';
  checkAddMoreButton();
}

// Функція для перевірки, чи показувати та активувати кнопку "Додати ще товар"
function checkAddMoreButton() {
  const color = colorSelect.value;
  const size1 = document.getElementById('size1')?.value;
  const quantity1 = Number(document.getElementById('quantity1')?.value) || 0;
  const isEcoBagOrShopper = productType.value === ecoBag || productType.value === shoppers;

  if (isEcoBagOrShopper) {
    addMoreSection.classList.add('hidden');
    addMoreButton.disabled = true;
  } else if (productType.value && color && size1 && quantity1 > 0) {
    addMoreSection.classList.remove('hidden');
    addMoreButton.disabled = false;
  } else {
    addMoreSection.classList.add('hidden');
    addMoreButton.disabled = true;
  }
}

// Показ/приховування секції кольору
productType.addEventListener('change', () => {
  sizeQuantityCount = 1;
  sizeQuantitySection.innerHTML = `
    <div id="sizeQuantity1" class="size-quantity-group">
      <div class="size-field">
        <label for="size1">Розмір 1</label>
        <select id="size1" name="size1">
          <option value="">Виберіть розмір</option>
        </select>
      </div>
      <div class="quantity-field hidden">
        <label for="quantity1">Кількість 1</label>
        <input type="number" id="quantity1" name="quantity1" min="0" placeholder="0" required>
      </div>
    </div>
  `;
  if (productType.value) {
    updateColorOptions();
    if (productType.value === shoppers) {
      sizeQuantitySection.classList.remove('hidden');
      updateSizeOptions();
    } else {
      sizeQuantitySection.classList.add('hidden');
    }
    addMoreSection.classList.add('hidden');
  } else {
    colorSection.classList.add('hidden');
    sizeQuantitySection.classList.add('hidden');
    addMoreSection.classList.add('hidden');
  }
  checkFormCompletion();
});

// Показ/приховування секції розмірів
colorSelect.addEventListener('change', () => {
  if (colorSelect.value && productType.value !== shoppers) {
    sizeQuantitySection.classList.remove('hidden');
    document.querySelector('#sizeQuantity1 .size-field').classList.remove('hidden');
    if (productType.value === ecoBag) {
      document.querySelector('#sizeQuantity1 .quantity-field').classList.remove('hidden');
    } else {
      document.querySelector('#sizeQuantity1 .quantity-field').classList.add('hidden');
    }
    updateSizeOptions();
  } else {
    sizeQuantitySection.classList.add('hidden');
    addMoreSection.classList.add('hidden');
  }
  checkFormCompletion();
});

// Показ/приховування поля кількості після вибору розміру
sizeQuantitySection.addEventListener('change', (e) => {
  if (e.target.matches('select[name^="size"]')) {
    const quantityField = e.target.closest('.size-quantity-group').querySelector('.quantity-field');
    if (e.target.value && productType.value !== ecoBag && productType.value !== shoppers) {
      quantityField.classList.remove('hidden');
    }
    updateSizeOptions();
    checkFormCompletion();
  }
});

// Перевірка заповнення розміру та кількості
sizeQuantitySection.addEventListener('input', () => {
  updateSizeOptions();
  checkFormCompletion();
});

// Додавання нових полів розміру та кількості
addMoreButton.addEventListener('click', () => {
  if (sizeQuantityCount < 7) {
    sizeQuantityCount++;
    const newSizeQuantity = document.createElement('div');
    newSizeQuantity.id = `sizeQuantity${sizeQuantityCount}`;
    newSizeQuantity.className = 'size-quantity-group';
    newSizeQuantity.innerHTML = `
      <div class="size-field">
        <label for="size${sizeQuantityCount}">Розмір ${sizeQuantityCount}</label>
        <select id="size${sizeQuantityCount}" name="size${sizeQuantityCount}">
          <option value="">Виберіть розмір</option>
        </select>
      </div>
      <div class="quantity-field hidden">
        <label for="quantity${sizeQuantityCount}">Кількість ${sizeQuantityCount}</label>
        <input type="number" id="quantity${sizeQuantityCount}" name="quantity${sizeQuantityCount}" min="0" placeholder="0" required>
      </div>
      <button type="button" class="delete-button" onclick="this.parentElement.remove(); sizeQuantityCount--; checkFormCompletion();">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
          <path d="M6 6v14c0 1 1 2 2 2h8c1 0 2-1 2-2V6"></path>
        </svg>
      </button>
    `;
    sizeQuantitySection.appendChild(newSizeQuantity);
    updateSizeOptions();
  }
  if (sizeQuantityCount === 7) {
    addMoreButton.disabled = true;
  }
  checkFormCompletion();
});

// Обробка відправлення форми
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    productType: formData.get('productType'),
    color: formData.get('color') || null,
    sizesAndQuantities: []
  };
  for (let i = 1; i <= sizeQuantityCount; i++) {
    const size = formData.get(`size${i}`);
    const quantity = formData.get(`quantity${i}`);
    if (quantity && Number(quantity) > 0) {
      data.sizesAndQuantities.push({ size: size || null, quantity: Number(quantity) });
    }
  }

  try {
    const response = await fetch('https://pngstudio.app.n8n.cloud/webhook-test/90f3ef63-61a1-4a3c-a764-74bebf106bdc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      console.log('Form Data sent successfully:', data);
      alert('Дані успішно відправлено!');
    } else {
      console.error('Failed to send form data:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      alert(`Помилка при відправленні даних: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Network Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    alert('Помилка мережі. Спробуйте ще раз.');
  }
});