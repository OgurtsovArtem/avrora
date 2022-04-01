export default class PopupDirected {
  constructor({ container, description, card, close }) {
    this.container = container;
    this.description = description;
    this.card = card;
    this.close = close;
    this.listener();
  }
  searhPosition() {
    const card = this.card.getBoundingClientRect();
    const left = card.left;
    const right = window.innerWidth - card.right;
    const difference = Math.abs(left - right);
    const inaccuracy = 200;

    switch (true) {
      case difference > 0 && difference < inaccuracy:
        this.centerDirection();
        break;

      case left > right:
        this.leftDirection();
        break;
      case left < right:
        this.rightDirection();
        break;

      default:
        this.centerDirection();
    }
  }
  rightDirection() {
    this.description.classList.add("popup--open-right");
  }
  centerDirection() {
    this.description.classList.add("popup--open-center");
  }
  leftDirection() {
    this.description.classList.add("popup--open-left");
  }
  closePopup() {
    this.description.classList.remove(
      "popup--open-right",
      "popup--open-center",
      "popup--open-left"
    );
  }
  listener() {
    this.card.addEventListener("click", this.searhPosition.bind(this));
    this.close.addEventListener("click", this.closePopup.bind(this));
  }
}
const payPopupDirected = new PopupDirected({
  description: document.querySelector("[data-poup-direct-desc='pay']"),
  card: document.querySelector("[data-poup-direct-card='pay']"),
  close: document.querySelector("[data-poup-direct-close='pay']"),
});

const installmentsPopupDirected = new PopupDirected({
  description: document.querySelector("[data-poup-direct-desc='installments']"),
  card: document.querySelector("[data-poup-direct-card='installments']"),
  close: document.querySelector("[data-poup-direct-close='installments']"),
});

const creditPopupDirected = new PopupDirected({
  description: document.querySelector("[data-poup-direct-desc='credit']"),
  card: document.querySelector("[data-poup-direct-card='credit']"),
  close: document.querySelector("[data-poup-direct-close='credit']"),
});
