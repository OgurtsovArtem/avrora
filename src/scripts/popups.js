const DATA_FROM_ATTRIBUTES_INCLUDE = ["item-id", "item"]; // Массив атрибутов для формы

export default class Popups {
  constructor({ popupClass, openButtons, closeButtonClass, activeClass }) {
    this.popupClass = popupClass;
    this.closeButtonClass = closeButtonClass;
    this.openButtons = openButtons;
    this.activeClass = activeClass || "_active";

    this.form = null;

    if (!document.querySelector(`.${this.popupClass}`)) {
      return;
    }

    this.popup = document.querySelector(`.${this.popupClass}`);
    this.closeButtons = document.querySelectorAll(`.${this.closeButtonClass}`);

    this.init();
  }
  init() {
    this.closeButtons.forEach((button) => {
      button.addEventListener("mousedown", this.checkEvents.bind(this));
    });
    this.openButtons.forEach((button) => {
      button.addEventListener("click", this.open.bind(this));
    });
  }

  // проверяем кнопку на дополнительные атрибуты
  checkAttributes(button) {
    let dataObj = {};

    for (let attr of DATA_FROM_ATTRIBUTES_INCLUDE) {
      const val = button.getAttribute(`data-${attr}`);
      val && (dataObj[attr] = val);
    }

    this.form.addAttributes(dataObj);
  }

  open(event) {
    this.popup.classList.add(this.activeClass);
    document.body.style.overflow = "hidden";
    if (this.form) {
      window.ym && ym(69035068, "reachGoal", "formopen");
      this.checkAttributes(event.currentTarget); // отправляем экземпляр кнопки для проверки атрибутов
    }
  }

  checkEvents(event) {
    const { target } = event;
    const targetPopup = target.classList.contains(this.popupClass);
    const targetClose = target.classList.contains(this.closeButtonClass);

    if (targetPopup || targetClose) {
      this.close();
    }
  }
  close() {
    this.popup.classList.remove(this.activeClass);
    document.body.style.overflow = "initial";
    if (this.form) {
      this.form.cleanInputs();
    }
  }
}
