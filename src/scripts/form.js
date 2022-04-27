export default class Form {
  constructor(form, { errorClass, popupNext, popupCurrent }) {
    this.form = form;
    this.errorClass = errorClass;
    this.popupNext = popupNext;
    this.popupCurrent = popupCurrent;

    // Внутренние переменные
    this.submitButton = null;
    this.inputs = [];
    this.errorTimouts = 1000;
    this.formIsValid = false;
    this.dataAttributes = {};

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
  // Получает массив обьектов с атрибутами, используется когда форма в попапе (см.popup.js функция checkAttributes)
  addAttributes(attributes) {
    if (attributes) {
      this.dataAttributes = attributes;
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
      if (element.type === "file") {
        this.formfileHandler(element);
      }
    });
  }
  formFileClear() {
    // Установка текста по умолчанию
    if (!this.textFileSelector) {
      return;
    }
    this.textFileSelector.textContent = this.initialFileText;
  }
  // Поле с файлом настроено на работу как при добавлении 1 файла так и нескольких.

  formfileHandler(inputFile) {
    // Поиск текстового поля, в которое записывается название прикрепляемого файла
    this.textFileSelector = this.form.querySelector(".input-file-text-js");
    // Сохранение текстового значения по умолчанию.
    this.initialFileText = this.textFileSelector.textContent;
    let fileList;

    // Событие выбора файла(ов)
    inputFile.addEventListener("change", () => {
      // создаём массив файлов
      fileList = [];
      for (let i = 0; i < inputFile.files.length; i++) {
        fileList.push(inputFile.files[i]);
      }

      // вызов функции для каждого файла
      fileList.forEach((file) => {
        uploadFile(file);
      });
    });

    // Проверяем размер файлов и выводим название
    const uploadFile = (file) => {
      // файла < 20 Мб
      if (file.size > 20 * 1024 * 1024) {
        alert(` Файл должен быть не более 20 МБ. (${file.name})`);
        return;
      }

      // Показ загружаемых файлов
      if (file && fileList.length > 1) {
        if (fileList.length <= 4) {
          this.textFileSelector.textContent = `Выбрано ${fileList.length} файла`;
        }
        if (fileList.length > 4) {
          this.textFileSelector.textContent = `Выбрано ${fileList.length} файлов`;
        }
      } else {
        this.textFileSelector.textContent = file.name;
      }
    };
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
    this.formFileClear();
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
        this.formIsValid = false;
        break;
      case input.validity.valueMissing:
        this.inputError(input, validationNull);
        this.formIsValid = false;
        break;
      case input.validity.typeMismatch:
        this.inputError(input, validationEmail);
        this.formIsValid = false;
        break;
      case !input.checked && input.type === "checkbox":
        this.inputError(input, validationCheckbox);
        this.formIsValid = false;
        break;
      default:
        this.removeInputError(input);
        this.formIsValid = true;
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
  formDataSettings(formData) {
    // Коменджик
    let comagicData = window.Comagic ? window.Comagic.getCredentials() : null;
    for (let item in comagicData)
      comagicData.hasOwnProperty(item) && formData.append(item, comagicData[item]);

    // Отправка названия формы
    this.form.getAttribute("name") ? formData.append("type", this.form.getAttribute("name")) : null;

    // Добавляем технические атрибуты с кнопки открытия если они есть
    for (let key in this.dataAttributes) {
      formData.append(key, this.dataAttributes[key]);
    }
  }
  // Обработка отправки
  submit() {
    let isSending = false; // флаг для избежания спама кликов
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.formIsValid) {
        return;
      }
      // проверяем не закончился ли еще предыдущий запрос
      if (isSending) {
        return;
      }
      const formData = new FormData(this.form);
      this.formDataSettings(formData);

      isSending = true; // запрещаем последующие запросы пока не завершится текущий

      this.runPreloader(); // запускаем лоудер при отправке
      this.submitButton.dataset.errorName = ""; // обнуляем сообщение об ошибке

      this.sendForm(formData)
        .then((res) => {
          console.log(res);
          this.form.dataset.state = "success"; // Статус формы
          this.popupCurrent ? this.popupCurrent.close() : null; // закрываем текущий попап при успешной отправке
          this.popupNext ? this.popupNext.open() : null; // открываем следующий попап(например с успешной отправкой формы)
          window.ym && ym(69035068, "reachGoal", "formsubmit"); // метрика

          // редирект страницы оплаты
          if (res.confirmation_url) {
            document.location.href = res.confirmation_url;
          }
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
    const url = this.form.action;
    return fetch(url, {
      method: "POST",
      credentials: "include",
      mode: "no-cors",
      headers: {
        "Content-Type": "form/multipart",
      },
      body: data,
    }).then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
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
