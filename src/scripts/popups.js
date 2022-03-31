export default class Popups {
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
      button.addEventListener("click", this.open.bind(this));
    });
  }

  open() {
    this.popup.classList.add(this.activeClass);
    document.body.style.overflow = "hidden";
  }
  close() {
    this.popup.classList.remove(this.activeClass);
    document.body.style.overflow = "initial";
  }
}
