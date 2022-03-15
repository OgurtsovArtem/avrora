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

class Accordion {
  constructor(container, { duration }) {
    this.container = container;
    this.duration = duration ? duration : 500;

    this.attributesName = {
      item: "accordion-js-item",
      button: "accordion-js-button",
      body: "accordion-js-body",
    };
    this.classStatus = {
      active: "accordion-opening-body",
      open: "accordion-body-open",
    };
    this.init();
  }

  init() {
    [...this.Items] = this.container.querySelectorAll(
      `.${this.attributesName.item}`
    );
    this.Items.forEach((item) => {
      this.setListener(item);
    });

    [...this.Bodies] = this.container.querySelectorAll(
      `.${this.attributesName.body}`
    );
    this.Bodies.forEach((body) => {
      this.slideUp(body);
    });
  }

  removeActiveItems() {
    [...this.activeItems] = this.container.querySelectorAll(
      `.${this.attributesName.item}.${this.classStatus.open}`
    );
    if (this.activeItems) {
      this.activeItems.forEach((activeItem) => {
        this.slideUp(activeItem.querySelector(`.${this.attributesName.body}`));
        activeItem.classList.remove(this.classStatus.open);
      });
    }
  }

  itemStatus(event) {
    event.preventDefault();
    const { currentTarget } = event;
    let body = currentTarget.querySelector(`.${this.attributesName.body}`);
    if (!body.classList.contains(this.classStatus.active)) {
      this.removeActiveItems();
      if (currentTarget.classList.contains(this.classStatus.open)) {
        currentTarget.classList.remove(this.classStatus.open);
        this.slideUp(body);
      } else {
        currentTarget.classList.add(this.classStatus.open);
        this.slideDown(body);
      }
    }
  }

  slideUp(target) {
    if (!target.classList.contains(this.classStatus.active)) {
      target.classList.add(this.classStatus.active);
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = `${this.duration}ms`;
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;

      setTimeout(() => {
        target.hidden = true;
        target.style.removeProperty("height");
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove(this.classStatus.active);
      }, this.duration);
    }
  }

  slideDown(target) {
    if (!target.classList.contains(this.classStatus.active)) {
      target.classList.add(this.classStatus.active);
      if (target.hidden) {
        target.hidden = false;
      }
      const height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = `${this.duration}ms`;
      target.style.height = `${height}px`;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");

      setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove(this.classStatus.active);
      }, this.duration);
    }
  }

  setListener(element) {
    element.addEventListener("click", this.itemStatus.bind(this));
  }
}
const accordionTest = document.querySelector(".benefits__accordion_column-one");
const accordionTest2 = document.querySelector(
  ".benefits__accordion_column-two"
);
const accordion = new Accordion(accordionTest, {
  duration: 500,
});
const accordion2 = new Accordion(accordionTest2, {
  duration: 500,
});
