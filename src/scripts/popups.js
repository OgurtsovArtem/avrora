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

  open(event) {
    event.preventDefault();
    this.popup.classList.add(this.activeClass);
    document.body.style.overflow = "hidden";
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
