export default class Form {
  constructor(form, { errorClass, popupNext, popupCurrent }) {
    this.form = form;
    this.errorClass = errorClass;
    this.popupNext = popupNext;
    this.popupCurrent = popupCurrent;

    //константы
    this.submitButton = null;
    this.inputs = [];
    this.errorTimouts = 1000;

    //Текст ошибок валидации
    this.words = {
      validationLenght: "Недостаточно символов",
      validationNull: "Это обязательное поле",
      validationEmail: "Неправильный формат Email",
      validationCheckbox: "Подтвердите согласие",
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
      this.removeFilledClass(input);
      this.removeInputError(input);
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
    target.value.length > 0 ? this.addFilledCalss(target) : this.removeFilledClass(target);
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
    if (nextElement.nodeType == 1 && nextElement.classList.contains(this.errorClass)) {
      nextElement.remove();
    }
  }
  //Валидация инпута
  checkInputValidity(input) {
    const { validationLenght, validationNull, validationEmail, validationCheckbox } = this.words;

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
      case !input.checked && input.type === "checkbox":
        this.inputError(input, validationCheckbox);
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
    this.submitButton.insertAdjacentHTML("beforeend", this.preloaderTemplate().trim());
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
    const url = this.form.action;
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
