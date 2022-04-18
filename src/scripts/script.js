import * as accordion from "./accordion";
import * as circleText from "./circleText";
import * as map from "./map";
import * as swipers from "./swipers";

import header from "./header";

import Observer from "./observer";
import Popups from "./popups";
import Form from "./form";

// ====================== LAZY-LOADING ======================
const lazyImages = [...document.querySelectorAll("img[data-lazy], source[data-lazy]")];
if (lazyImages) {
  lazyImages.forEach((image) => {
    const imageObserve = new Observer({
      element: image,
      imageLoad: true,
    });
  });
}
// ====================== ANIMATION ======================
const animUpwards = [...document.querySelectorAll("._anim-upwards")];
if (animUpwards) {
  animUpwards.forEach((animEl) => {
    const upWardsAnimation = new Observer({
      element: animEl,
      playOnce: true,
      rootMargin: "-20%",
    });
  });
}
// ====================== POPUPS ======================

const calcPopup = new Popups({
  popupClass: "calc-popup",
  closeButtonClass: "popup-close-calc",
  openButtons: document.querySelectorAll("[data-popup-open='calc']"),
});
const callPopup = new Popups({
  popupClass: "call-popup",
  closeButtonClass: "popup-close-call",
  openButtons: document.querySelectorAll("[data-popup-open='call']"),
});
const donePopup = new Popups({
  popupClass: "done-popup",
  closeButtonClass: "popup-close-done",
  openButtons: document.querySelectorAll("[data-popup-open='done']"),
});
const payPopupDirected = new Popups({
  popupClass: "payment-intro__popup_one-time-payment",
  closeButtonClass: "popup-close-one-time-payment",
  openButtons: document.querySelectorAll("[data-popup-open='one-time-payment']"),
});
const installmentsPopupDirected = new Popups({
  popupClass: "payment-intro__popup_installments",
  closeButtonClass: "popup-close-installments",
  openButtons: document.querySelectorAll("[data-popup-open='installments']"),
});

const creditPopupDirected = new Popups({
  popupClass: "payment-intro__popup_credit",
  closeButtonClass: "popup-close-credit",
  openButtons: document.querySelectorAll("[data-popup-open='credit']"),
});
// ====================== FORM ======================
const application = document.forms.application;
const applicationFrom = new Form(application, {
  errorClass: "input__error",
  popupNext: donePopup,
});
const designer = document.forms.designer;
const designerFrom = new Form(designer, {
  errorClass: "input__error",
  popupNext: donePopup,
});
const calc = document.forms.calc;
const calcFrom = new Form(calc, {
  errorClass: "input__error",
  popupCurrent: calcPopup,
  popupNext: donePopup,
});
const call = document.forms.call;
const callFrom = new Form(call, {
  errorClass: "input__error",
  popupCurrent: callPopup,
  popupNext: donePopup,
});

callPopup.form = callFrom; // передаем форму для использование методов
calcPopup.form = calcFrom; // передаем форму для использование методов

const payment = document.forms.payment;
const paymentFrom = new Form(payment, {
  errorClass: "input__error",
  popupNext: donePopup,
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

if (document.querySelector(".benefits__body")) {
  const benefitsAccordion = new Accordion(".benefits__body", {
    collapse: true,
  });
}
if (document.querySelector(".filter-selector")) {
  const filterAccordion = new Accordion(".filter-selector", {});
}

if (document.querySelector(".stages__accordion")) {
  const stagesAccordions = [...document.querySelectorAll(".stages__accordion")];
  const filterAccordion = new Accordion(stagesAccordions, {});
}
