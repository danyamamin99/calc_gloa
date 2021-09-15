'use strict';
//Массив
const DAY_STRING = ['день', 'дня', 'дней'];

//Объект
const DATA = {
  whichSite: ['landing', 'multiPage', 'onlineStore'], 
  price: [4000, 8000, 26000],
  desktopTemplates: [50, 40, 30], 
  adapt: 20, 
  mobileTemplates: 15, 
  editable: 10, 
  metrikaYandex: [500, 1000, 2000], 
  analyticsGoogle: [850, 1350, 3000],
  sendOrder: 500, 
  deadlineDay: [[2, 7], [3, 10], [7, 14]],
  deadlinePercent: [20, 17, 15],
};

//Константы 
const startButton = document.querySelector('.start-button'),
  firstScreen = document.querySelector('.first-screen'),
  mainForm = document.querySelector('.main-form'),
  endButton = document.querySelector('.end-button'),
  total = document.querySelector('.total'),
  formCalculate = document.querySelector('.form-calculate'),
  fastRange = document.querySelector('.fast-range'),
  totalPriceSum = document.querySelector('.total_price__sum'),
  typeSite = document.querySelector('.type-site'),
  maxDeadline = document.querySelector('.max-deadline'),
  rangeDeadline = document.querySelector('.range-deadline'),
  deadlineValue = document.querySelector('.deadline-value'),
  //Для домашки переменные input и span (да/нет)
  desktopTemplates = document.getElementById('desktopTemplates'),
  adapt = document.getElementById('adapt'),
  mobileTemplates = document.getElementById('mobileTemplates'),
  editable = document.getElementById('editable'),
  desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
  adaptValue = document.querySelector('.adapt_value'),
  mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
  editableValue = document.querySelector('.editable_value'),
  calcDescription = document.querySelector('.calc-description'),
  metrikaYandex = document.getElementById('metrikaYandex'),
  analyticsGoogle = document.getElementById('analyticsGoogle'),
  sendOrder = document.getElementById('sendOrder'),
  cardHead = document.querySelector('.card-head'),
  totalPrice = document.querySelector('.total_price'),
  firstFieldset = document.querySelector('.first-fieldset');
//Возвращает число и падеж правильный
function declOfNum(n, titles, from) {
  return n + ' ' + titles[from ? n % 10 === 1 && n % 100 !== 11 ? 1 : 2 : 
     n % 10 === 1 && n % 100 !== 11 ? 0 :
     n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

//Функция появления элемента
function showElem(elem) {
  elem.style.display = 'block';
}

//Функция исчезновения элемента
function hideElem(elem) {
  elem.style.display = 'none';
}

//Подключим Яндекс Метрику, Гугл Аналитику и отправку заявок на почту.
function dopOptionsString() {
  let str = '';

  if (metrikaYandex.checked || analyticsGoogle.checked || sendOrder.checked) {
    str += 'Подключим';

    if (metrikaYandex.checked) {
      str += ' Яндекс Метрику';

      if (analyticsGoogle.checked && sendOrder.checked) {
        str += ', Гугл Аналитику и отправку заявок на почту.';
        return str;
      }
      
      if (analyticsGoogle.checked || sendOrder.checked) {
        str += ' и';
      }
    }

    if (analyticsGoogle.checked) {
      str += ' Гугл Аналитику';

      if (sendOrder.checked) {
        str += ' и';
      }
    }

    if(sendOrder.checked) {
      str += ' отправку заявок на почту';
    }
    str += '.';
  }

  return str;
}

//Функция вывода текста
function renderTextContent(total, site, maxDay, minDay) {

  desktopTemplatesValue.textContent = (desktopTemplates.checked) ? 'Да' : 'Нет';
  adaptValue.textContent = (adapt.checked) ? 'Да' : 'Нет';
  mobileTemplatesValue.textContent = (mobileTemplates.checked) ? 'Да' : 'Нет'; 
  editableValue.textContent = (editable.checked) ? 'Да' : 'Нет';

  totalPriceSum.textContent = total;
  typeSite.textContent = site;
  maxDeadline.textContent =declOfNum(maxDay,DAY_STRING,true);
  rangeDeadline.min = minDay;
  rangeDeadline.max = maxDay;
  deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING, true);

  calcDescription.textContent = `
    Сделаем ${site} ${(adapt.checked) ?
      ',адаптированный под мобильные устройства и планшеты' : ''}.
    ${(editable.checked) ? `Установим панель админстратора,
    чтобы вы могли самостоятельно менять содержание на сайте без разработчика.` : ''}
    ${dopOptionsString()}
  `;
}

//Функция стоимость сайта
function priceCalculation(elem = {}) {
  let result = 0,
      index = 0,
      options = [],
      site = '',
      maxDeadlineDay = DATA.deadlineDay[index][1],
      minDeadlineDay = DATA.deadlineDay[index][0],
      overPersent = 0;

  if (elem.name === 'whichSite') {
    for (const item of formCalculate.elements) {
      if (item.type === 'checkbox') {
        item.checked = false;
      }
    }
    hideElem(fastRange);
  }

  for (const item of formCalculate.elements) {
    if (item.name === 'whichSite' && item.checked) {
      index = DATA.whichSite.indexOf(item.value);
      site = item.dataset.site;
      maxDeadlineDay = DATA.deadlineDay[index][1];
      minDeadlineDay = DATA.deadlineDay[index][0];
    } else if (item.classList.contains('calc-handler') && item.checked) {
      options.push(item.value);
    } else if (item.classList.contains('want-faster') && item.checked) {
      const overDay = maxDeadlineDay - rangeDeadline.value;
      overPersent =  overDay * (DATA.deadlinePercent[index] / 100);
    }
  }
 
  options.forEach(function(key) {
    if (typeof(DATA[key]) === 'number' ) {
      if (key === 'sendOrder') {
        result += DATA[key];
      } else {
        result += DATA.price[index] * DATA[key] / 100;
      }
    } else {
      if (key === 'desktopTemplates') {
        result += DATA.price[index] * DATA.desktopTemplates[index] / 100;
      } else {
        result += DATA[key][index];
      }
    }
  });

  result += DATA.price[index];

  result += result * overPersent;

  renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
}

//Функция если что то изменится в форме
function handlerCallBackFrom(event) {
  const target = event.target;

  if (adapt.checked) {
    mobileTemplates.disabled = false;
  } else {
    mobileTemplates.disabled = true;
    mobileTemplates.checked = false;
  }

  if (target.classList.contains('want-faster')) {
    if (target.checked) {
      showElem(fastRange);
    } else {
      hideElem(fastRange);
    }
    priceCalculation(target);

  }
  
  if (target.classList.contains('calc-handler')) {
    priceCalculation(target);
  }
}
//Цена возвращается от кнопки
function moveBackTotal() {
  if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 20) {
    totalPrice.classList.remove('totalPriceBottom');
    firstFieldset.after(totalPrice);
    window.removeEventListener('scroll', moveBackTotal);
    window.addEventListener('scroll', moveTotal);
  }
}

//Цена падает кнопке
function moveTotal() {
  if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 20) {
    totalPrice.classList.add('totalPriceBottom');
    endButton.before(totalPrice);
    window.removeEventListener('scroll', moveTotal);
    window.addEventListener('scroll', moveBackTotal);
  }
}

//Функция появление формы 
startButton.addEventListener('click', function() {
  showElem(mainForm);
  hideElem(firstScreen);
  window.addEventListener('scroll', moveTotal);
});

//Функция появление отправки данных
endButton.addEventListener('click', function() {
  for (const elem of formCalculate.elements) {
    if (elem.tagName === 'FIELDSET') {
      hideElem(elem);
    }
  }

  cardHead.textContent = 'Заявка на разработку сайта';
  hideElem(totalPrice);
  showElem(total);
});

//Функция если что то изменится в форме
formCalculate.addEventListener('change', handlerCallBackFrom);

priceCalculation();