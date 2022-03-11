class Form {
  constructor(form) {
    this.form = form;
    this.inputObserve();
  }
  inputObserve() {
    [...this.form.elements].forEach((element) => {
      if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
        this.setListener(element);
      }
    });
  }
  checkingInputFilled(event) {
    const { target } = event;
    target.value.length > 0
      ? this.addFilledCalss(target)
      : this.removeFilledClass(target);
  }
  addFilledCalss(element) {
    element.classList.add("_filled");
  }
  removeFilledClass(element) {
    element.classList.remove("_filled");
  }
  setListener(element) {
    element.addEventListener("input", this.checkingInputFilled.bind(this));
  }
}

const formTest = document.forms.designer;
const designerFrom = new Form(formTest);
