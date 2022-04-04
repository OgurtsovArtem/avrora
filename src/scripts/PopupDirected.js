export default class PopupDirected {
  constructor({ description, card, close }) {
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
