// ====================== FORM ======================
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

// ====================== SWIPER ======================

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

// ====================== MASONRY ======================

if (document.querySelector(".reviews-list__body")) {
  const masonryReviews = new Masonry(".reviews-list__body", {
    itemSelector: ".masonry-element",
    columnWidth: ".reviews-list__card",
    gutter: ".reviews-list__column-gap",
    percentPosition: true,
  });
}

// ====================== ACCORDIONS ======================

if (document.querySelector(".benefits__accordion")) {
  const accordions = Array.from(
    document.querySelectorAll(".benefits__accordion")
  );
  const benefitsAccordion = new Accordion(accordions, {
    openOnInit: [0],
    collapse: true,
  });
}
if (document.querySelector(".filter-selector")) {
  const filterAccordion = new Accordion(".filter-selector", {});
}
