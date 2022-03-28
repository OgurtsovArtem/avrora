// ====================== LAZY-LOADING ======================
class Observer {
  constructor({
    element,
    activationRangeTop,
    activationRangeBottom,
    playOnce,
    updateFrequency,
    activeClass,
    top,
    bottom,
    imageLoad,
  }) {
    this.element = element;
    this.top = activationRangeTop ? top || 0 : null;
    this.bottom = activationRangeBottom ? bottom || 0 : null;
    this.activationRangeTop = activationRangeTop || false;
    this.activationRangeBottom = activationRangeBottom || false;
    this.playOnce = playOnce || false;
    this.updateFrequency = updateFrequency || 20;
    this.activeClass = activeClass || "_scroll";
    this.imageLoad = imageLoad;
    // Внутренние переменные
    this.entries = null;
    this.observer = null;
    this.observe();
  }

  _thresholdArray() {
    return Array(this.updateFrequency + 1)
      .fill(0)
      .map((item, index) => index / this.updateFrequency || 0);
  }

  _handleIntersect(entries) {
    [this.entries] = entries;
    this.scrollHandler();
    if (this.playOnce) {
      this.unobserve();
    }
  }

  observe() {
    this.observer = new IntersectionObserver(this._handleIntersect.bind(this), {
      threshold: this._thresholdArray(),
    });

    this.observer.observe(this.element);
  }

  unobserve() {
    const destroyWatcher = () => {
      this.observer.unobserve(this.element);
      this.element.removeEventListener("transitionend", destroyWatcher);
    };
    this.element.addEventListener("transitionend", destroyWatcher);
  }

  addClass() {
    this.element.classList.remove(this.activeClass);
  }

  removeClass() {
    this.element.classList.add(this.activeClass);
  }

  scrollHandler() {
    if (this.activationRangeTop || this.activationRangeBottom) {
      this.determiningDirection();
    } else {
      this.inObject();
    }
  }

  determiningDirection() {
    if (this.activationRangeTop) {
      this.atDistanceOnTop();
    } else if (this.activationRangeBottom) {
      this.atDistanceOnBottom();
    }
  }

  atDistanceOnTop() {
    return this.entries.boundingClientRect.top >= this.top
      ? this.addClass()
      : this.removeClass();
  }

  atDistanceOnBottom() {
    return this.entries.boundingClientRect.bottom <= this.bottom
      ? this.addClass()
      : this.removeClass();
  }
  setImageSrc() {
    const src = this.element.dataset.src;

    this.element.setAttribute("src", src);

    this.element.onload = () => {
      this.observer.unobserve(this.element);
      this.element.removeAttribute("data-src");
      this.element.dataset.lazy = "done";
    };

    this.element.onerror = () => {
      this.element.dataset.lazy = "error-loading";
    };
  }
  inObject() {
    if (this.entries.isIntersecting) {
      this.addClass();
      this.imageLoad ? this.setImageSrc() : null;
    } else {
      this.removeClass();
    }
  }
}
const lazyImages = [...document.querySelectorAll("img[data-lazy]")];
console.log(lazyImages);
if (lazyImages) {
  lazyImages.forEach((image) => {
    const imageObserve = new Observer({
      element: image,
      imageLoad: true,
    });
  });
}
// ====================== POPUPS ======================
class Popups {
  constructor({ popup, openButtons, closeButtons, activeClass }) {
    this.popup = popup;
    this.openButtons = openButtons;
    this.closeButtons = closeButtons;
    this.activeClass = activeClass || "_active";
    if (!popup) {
      return;
    }
    this.init();
  }
  init() {
    this.closeButtons.forEach((button) => {
      button.addEventListener("click", this.close.bind(this));
    });
    this.openButtons.forEach((button) => {
      console.log(button);
      button.addEventListener("click", this.open.bind(this));
    });
  }

  open() {
    this.popup.classList.add(this.activeClass);
    document.body.style.position = "fixed";
  }
  close() {
    this.popup.classList.remove(this.activeClass);
    document.body.style.position = "static";
  }
}

// ====================== FORM ======================
console.log(document.querySelectorAll("[data-popup-open='calc']"));
class Form {
  constructor(form, { errorClass, popupNext, popupCurrent }) {
    this.form = form;
    this.errorClass = errorClass;
    this.popupNext = popupNext;
    this.popupCurrent = popupCurrent;

    //константы
    this.submitButton = null;
    this.inputs = [];

    //Текст ошибок валидации
    this.words = {
      validationLenght: "Недостаточно символов",
      validationNull: "Это обязательное поле",
      validationEmail: "Неправильный формат Email",
      submitError: "Ошибка отправки формы",
    };

    //Инициализация
    if (this.form) {
      this.searchFormElements(); // Собираем данные формы
      this.inputObserve(); // ставим на них слушатели
      this.checkFormValidity(); // ставим слушатель на кнопку submit для проверки формы на пустоту
      this.submit(); // ставим event submit на форму для отправки
    }
  }
  // Поиск нужных полей формы
  searchFormElements() {
    [...this.form.elements].forEach((element) => {
      if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
        this.inputs.push(element);
      }
      if (element.nodeName === "BUTTON" && element.type === "submit") {
        this.submitButton = element;
      }
    });
  }
  // Установка слушателя на каждый input
  inputObserve() {
    this.inputs.forEach((input) => {
      this.setListener(input);
    });
  }
  // Отчистка полей инпутов
  cleanInputs() {
    this.inputs.forEach((input) => {
      input.value = "";
    });
  }
  //Валидация формы при клике на кнопку submit
  checkFormValidity() {
    this.submitButton.addEventListener("click", () => {
      this.inputs.forEach((input) => {
        this.checkInputValidity(input);
      });
    });
  }

  //Обработка данных при вводе символа в текущее поле input
  formTarget(event) {
    const { target } = event;

    // Ставит маску для type='tel'
    if (target.type === "tel") {
      this.phoneMask(target);
    }
    // Валидирует поля
    this.checkInputValidity(target);

    // Анимация placeholder
    target.value.length > 0
      ? this.addFilledCalss(target)
      : this.removeFilledClass(target);
  }

  //Шаблон ошибки
  errorTemplate(error) {
    return ` <span class="${this.errorClass}">${error}</span>`;
  }

  //Добавляем шаблон после input'a
  inputError(input, error) {
    input.classList.add("_error");
    input.insertAdjacentHTML("afterend", this.errorTemplate(error).trim());
  }
  //Удаляем шаблон после input'a
  removeInputError(input) {
    input.classList.remove("_error");
    const nextElement = input.nextSibling;
    if (
      nextElement.nodeType == 1 &&
      nextElement.classList.contains(this.errorClass)
    ) {
      nextElement.remove();
    }
  }
  //Валидация инпута
  checkInputValidity(input) {
    const { validationLenght, validationNull, validationEmail } = this.words;

    this.removeInputError(input); // удалям предыдущие ошибки

    switch (true) {
      case input.validity.tooShort:
        this.inputError(input, validationLenght);
        break;
      case input.validity.valueMissing:
        this.inputError(input, validationNull);
        break;
      case input.validity.typeMismatch:
        this.inputError(input, validationEmail);
        break;
      default:
        this.removeInputError(input);
        break;
    }
  }
  // Прелоудер шаблон
  preloaderTemplate() {
    return `
      <div class="preloader">
        <div class="preloader__container"><span class="preloader__item preloader__item_1"></span><span class="preloader__item preloader__item_2"></span><span class="preloader__item preloader__item_3"></span><span class="preloader__item preloader__item_4"></span><span class="preloader__item preloader__item_5"></span><span class="preloader__item preloader__item_6"></span><span class="preloader__item preloader__item_7"></span><span class="preloader__item preloader__item_8"></span><span class="preloader__item preloader__item_9"></span><span class="preloader__item preloader__item_10"></span>
        </div>
      </div>
    `;
  }
  // активировать прелоудер  кнопки
  runPreloader() {
    this.submitButton.insertAdjacentHTML(
      "beforeend",
      this.preloaderTemplate().trim()
    );
  }
  // остановить прелоудер  кнопки
  stopPreloader() {
    this.submitButton.lastChild.remove();
  }
  // Обработка отправки
  submit() {
    let isSending = false; // флаг для избежания спама кликов
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      // проверяем не закончился ли еще предыдущий запрос
      if (isSending) {
        return;
      }
      const formData = new FormData(this.form);
      isSending = true; // запрещаем последующие запросы пока не завершится текущий

      this.runPreloader(); // запускаем лоудер при отправке
      this.submitButton.dataset.errorName = ""; // обнуляем сообщение об ошибке

      this.sendForm(formData)
        .then(() => {
          this.form.dataset.state = "success"; // Статус формы
          this.popupCurrent ? this.popupCurrent.close() : null; // закрываем текущий попап при успешной отправке
          this.popupNext ? this.popupNext.open() : null; // открываем следующий попап(например с успешной отправкой формы)
        })
        .catch((error) => {
          this.form.dataset.state = "error"; // Статус формы
          this.submitButton.dataset.errorName = this.words.submitError; // выводим сообщение об ошибке под кнопкой
          console.error(error);
        })
        .finally(() => {
          this.stopPreloader(); // по завершению запроса останавливаем лоудер
          this.cleanInputs(); // и очищаем инпуты
          isSending = false; // разрешаем отправку запроса
        });
    });
  }
  // Отправка формы
  sendForm(data) {
    const body = JSON.stringify({
      name: this.form.name,
      data: JSON.stringify(data),
    });
    const url = "/";
    return fetch(url, {
      method: "POST",
      credentials: "include",
      mode: "no-cors",
      headers: {
        "Content-Type": "form/multipart",
      },
      body,
    }).then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response;
    });
  }
  // Маска на поле телефона
  phoneMask(input) {
    let val = input.value.replace(/\D/g, "");

    if (val) {
      if (val[0] === "7" || val[0] === "8") {
        val = val.slice(1);
      }

      val = val.match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      val =
        "+7" +
        (val[2] ? "(" + val[1] + ")" + val[2] : val[1] ? val[1] : "") +
        (val[3] ? "-" + val[3] : "") +
        (val[4] ? "-" + val[4] : "");
    }

    input.value = val;
  }
  // Добавление класса анимации placeholder'a
  addFilledCalss(element) {
    element.classList.add("_filled");
  }
  // Удаление класса анимации placeholder'a
  removeFilledClass(element) {
    element.classList.remove("_filled");
  }
  setListener(element) {
    element.addEventListener("input", this.formTarget.bind(this));
  }
}
const calcPopup = new Popups({
  popup: document.querySelector(".calc-popup"),
  closeButtons: document.querySelectorAll(".calc-popup__close"),
  openButtons: document.querySelectorAll("[data-popup-open='calc']"),
});
const callPopup = new Popups({
  popup: document.querySelector(".call-popup"),
  closeButtons: document.querySelectorAll(".call-popup__close"),
  openButtons: document.querySelectorAll("[data-popup-open='call']"),
});
const donePopup = new Popups({
  popup: document.querySelector(".done-popup"),
  closeButtons: document.querySelectorAll(".done-popup__button"),
  openButtons: document.querySelectorAll("[data-popup-open='done']"),
});

const application = document.forms.application;
const applicationFrom = new Form(application, {
  errorClass: "input__error",
  popupNext: donePopup,
});
const designer = document.forms.designer;
const designerFrom = new Form(designer, {
  errorClass: "input__error",
  popupNext: donePopup,
});
const calc = document.forms.calc;
const calcFrom = new Form(calc, {
  errorClass: "input__error",
  popupCurrent: calcPopup,
  popupNext: donePopup,
});
const call = document.forms.call;
const callFrom = new Form(call, {
  errorClass: "input__error",
  popupCurrent: callPopup,
  popupNext: donePopup,
});
// ====================== CIRCLE TEXT ======================

// расстояние между словами
const rotateBetweenWords = (value) => {
  const words = document.querySelectorAll(".circle-text__word");

  let deg = 0;

  for (let word of words) {
    word.style.transform = `rotate(${deg}deg)`;
    deg += value;
  }
};

// расстояние между буквами
const rotateBetweenLetters = (value) => {
  const letters = document.querySelectorAll(".circle-text__letter");

  let deg = 0;

  for (let letter of letters) {
    letter.style.transform = `rotate(${deg}deg)`;
    deg += value;
  }
};

rotateBetweenWords(0);
rotateBetweenLetters(10.5);
// ====================== SWIPER ======================

const kitchenSmallSwiper = new Swiper(".kitchen-large__swiper", {
  loop: true,
  observer: true,
  observerParents: true,
  slidesPerView: 1,
  spaceBetween: 32,
  speed: 800,
  loop: true,
  loopAdditionalSlides: 5,
  preloadImages: false,
  lazy: true,

  // Navigation arrows
  navigation: {
    nextEl: ".kitchen-large__controls_right",
    prevEl: ".kitchen-large__controls_left",
  },
});
const kitchenLargeSwiper = new Swiper(".kitchen-small__swiper", {
  slidesPerView: 1,
  spaceBetween: 32,
  speed: 800,
  loop: true,
  preloadImages: false,
  lazy: true,

  // Navigation arrows
  navigation: {
    nextEl: ".kitchen-small__controls_right",
    prevEl: ".kitchen-small__controls_left",
  },
});
const kitchenFullSwiper = new Swiper(".kitchen-full__swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 32,
  speed: 800,
  preloadImages: false,
  lazy: true,

  // Navigation arrows
  navigation: {
    nextEl: ".kitchen-full__controls_right",
    prevEl: ".kitchen-full__controls_left",
  },
});
const gallaryDetailSwiper = new Swiper(".detail-gallary__swiper", {
  loop: true,
  slidesPerView: "auto",
  spaceBetween: 20,
  freeMode: true,
});
const popularKitSwiper = new Swiper(".popular-kit__swiper", {
  slidesPerView: 1,
  spaceBetween: 10,

  breakpoints: {
    375: {
      slidesPerView: 1.3,
      spaceBetween: 10,
    },
    650: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
  navigation: {
    nextEl: ".popular-kit__button_right",
    prevEl: ".popular-kit__button_left",
  },
});
const rewievsCardSwiper = new Swiper(".reviews-card__swiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  speed: 800,
  loop: true,
  lazy: true,
  navigation: {
    nextEl: ".reviews-card__swiper-controls_right",
    prevEl: ".reviews-card__swiper-controls_left",
  },
});

// ====================== MASONRY ======================

if (document.querySelector(".reviews-list__body")) {
  const masonryReviews = new Masonry(".reviews-list__body", {
    itemSelector: ".masonry-element",
    columnWidth: ".reviews-list__card",
    gutter: ".reviews-list__column-gap",
    percentPosition: true,
  });
}

// ====================== ACCORDIONS ======================

if (document.querySelector(".benefits__body")) {
  const benefitsAccordion = new Accordion(".benefits__body", {
    openOnInit: [0],
    collapse: true,
  });
}
if (document.querySelector(".filter-selector")) {
  const filterAccordion = new Accordion(".filter-selector", {});
}

document.addEventListener('DOMContentLoaded', () => {

  function header() {
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.header__menu-btn');
    let menuIsActive = false;
    
    function toggleMenu() {
      if (menuIsActive) {
        header.classList.remove('open-menu');
        menuIsActive = false;
      } else {
        header.classList.add('open-menu');
        menuIsActive = true;
      }
    }
    
    menuBtn.addEventListener('click', toggleMenu);
  }

  header();
});
