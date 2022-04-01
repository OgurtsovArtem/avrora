import * as accordion from "./accordion";
import * as circleText from "./circleText";
import * as swipers from "./swipers";

import header from "./header";

import Observer from "./observer";
import Popups from "./popups";
import Form from "./form";
import PopupDirected from "./PopupDirected";

// ====================== LAZY-LOADING ======================
const lazyImages = [...document.querySelectorAll("img[data-lazy]")];
if (lazyImages) {
  lazyImages.forEach((image) => {
    const imageObserve = new Observer({
      element: image,
      imageLoad: true,
      playOnce: true,
    });
  });
}
// ====================== POPUPS ======================

const calcPopup = new Popups({
  popup: document.querySelector(".calc-popup"),
  closeButtons: document.querySelectorAll(".calc-popup__close"),
  openButtons: document.querySelectorAll("[data-popup-open='calc']"),
});
const callPopup = new Popups({
  popup: document.querySelector(".call-popup"),
  closeButtons: document.querySelectorAll(".call-popup__close"),
  openButtons: document.querySelectorAll("[data-popup-open='call']"),
});
const donePopup = new Popups({
  popup: document.querySelector(".done-popup"),
  closeButtons: document.querySelectorAll(".done-popup__button"),
  openButtons: document.querySelectorAll("[data-popup-open='done']"),
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

const payment = document.forms.payment;
const paymentFrom = new Form(payment, {
  errorClass: "input__error",
  popupNext: donePopup,
});
// ====================== POPUP DIRECTED ======================
if (document.querySelector(".payment-intro__cards")) {
  const payPopupDirected = new PopupDirected({
    description: document.querySelector("[data-poup-direct-desc='pay']"),
    card: document.querySelector("[data-poup-direct-card='pay']"),
    close: document.querySelector("[data-poup-direct-close='pay']"),
  });

  const installmentsPopupDirected = new PopupDirected({
    description: document.querySelector(
      "[data-poup-direct-desc='installments']"
    ),
    card: document.querySelector("[data-poup-direct-card='installments']"),
    close: document.querySelector("[data-poup-direct-close='installments']"),
  });

  const creditPopupDirected = new PopupDirected({
    description: document.querySelector("[data-poup-direct-desc='credit']"),
    card: document.querySelector("[data-poup-direct-card='credit']"),
    close: document.querySelector("[data-poup-direct-close='credit']"),
  });
}

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
    openOnInit: [0],
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
