class Form {
  constructor(form) {
    this.form = form;
    if (this.form) {
      this.inputObserve();
    }
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

const application = document.forms.application;
const applicationFrom = new Form(application);
const designer = document.forms.designer;
const designerFrom = new Form(designer);

class Accordion {
  constructor(container, { duration, onlyOne }) {
    this.container = container;
    this.duration = duration ? duration : 500;
    this.onlyOne = onlyOne || true;

    this.techNames = {
      attributesName: {
        item: "data-accordion-js-item",
        button: "data-accordion-js-button",
        body: "data-accordion-js-body",
      },
      classStatus: {
        activeBody: "accordion-opening-body",
        openBody: "accordion-body-open",
        activeButton: "accordion-button-active",
      },
      techAttribute: {
        buttonId: "data-accordion-js-button-id",
        bodyId: "data-accordion-js-body-id",
      },
    };
    this.init();
  }

  _idGenerator() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  init() {
    if (document.querySelector(this.container)) {
      this.container = document.querySelector(this.container);
      this.handler();
    }
  }

  handler() {
    this.getControls();
    this.closeAll();
    this.creatingUniquePairs();
  }

  getControls() {
    const { attributesName } = this.techNames;
    [...this.buttons] = this.container.querySelectorAll(
      `[${attributesName.button}]`
    );
    [...this.bodies] = this.container.querySelectorAll(
      `[${attributesName.body}]`
    );
  }
  creatingUniquePairs() {
    this.buttons.forEach((button, index) => {
      const { techAttribute } = this.techNames;
      let id = this._idGenerator();
      button.setAttribute(techAttribute.buttonId, id);
      if (this.bodies[index]) {
        this.bodies[index].setAttribute(techAttribute.bodyId, id);
      }
      this.setListener(button);
    });
  }
  eventHandler(event) {
    event.preventDefault();

    const { techAttribute, classStatus } = this.techNames;

    const { target } = event;

    const currentId = target.getAttribute(techAttribute.buttonId);
    const button = target;
    const body = this.container.querySelector(
      `[${techAttribute.bodyId}="${currentId}"]`
    );

    if (!this.container.classList.contains(classStatus.activeBody)) {
      this.statusController(body, button);
      this.lastBody = body;
      this.lastButton = button;
    }
  }
  statusController(body, button) {
    if (this.lastBody !== body && this.lastBody) {
      this.slideUp(this.lastBody);
      this.removeClass(this.lastBody, this.lastButton);
      this.classController(body, button);
    } else {
      this.classController(body, button);
    }
  }

  classController(body, button) {
    const { classStatus } = this.techNames;
    if (!body.classList.contains(classStatus.activeBody)) {
      if (body.classList.contains(classStatus.openBody)) {
        this.removeClass(body, button);
        this.slideUp(body);
      } else {
        this.addClass(body, button);
        this.slideDown(body);
      }
    }
  }

  closeAll() {
    this.bodies.forEach((body) => {
      this.slideUp(body);
    });
  }
  addClass(body, button) {
    const { classStatus } = this.techNames;
    body ? body.classList.add(classStatus.openBody) : null;
    button ? button.classList.add(classStatus.activeButton) : null;
  }

  removeClass(body, button) {
    const { classStatus } = this.techNames;
    body ? body.classList.remove(classStatus.openBody) : null;
    button ? button.classList.remove(classStatus.activeButton) : null;
  }

  slideUp(target) {
    const { classStatus } = this.techNames;
    if (!target.classList.contains(classStatus.activeBody)) {
      target.classList.add(classStatus.activeBody);
      this.container.classList.add(classStatus.activeBody);
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
        target.classList.remove(classStatus.activeBody);
        this.container.classList.remove(classStatus.activeBody);
      }, this.duration);
    }
  }

  slideDown(target) {
    const { classStatus } = this.techNames;
    if (!target.classList.contains(classStatus.activeBody)) {
      target.classList.add(classStatus.activeBody);
      this.container.classList.add(classStatus.activeBody);
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
        target.classList.remove(classStatus.activeBody);
        this.container.classList.remove(classStatus.activeBody);
      }, this.duration);
    }
  }

  setListener(element) {
    element.addEventListener("click", this.eventHandler.bind(this));
  }
}

const accordion2 = new Accordion(".benefits__body", {
  duration: 500,
});
const accordion3 = new Accordion(".filter-selector", {
  duration: 500,
});

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
  navigation: {
    nextEl: ".reviews-card__swiper-controls_right",
    prevEl: ".reviews-card__swiper-controls_left",
  },
});

const masonryReviews = new Masonry(".reviews-list__body", {
  itemSelector: ".masonry-element",
  columnWidth: ".reviews-list__card",
  gutter: ".reviews-list__column-gap",
  percentPosition: true,
});
