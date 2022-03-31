import Swiper, { Navigation, Lazy } from "swiper";
Swiper.use([Navigation, Lazy]);
import "swiper/css";

export const kitchenSmallSwiper = new Swiper(".kitchen-large__swiper", {
  loop: true,
  observer: true,
  observerParents: true,
  slidesPerView: 1,
  spaceBetween: 32,
  speed: 800,
  loop: true,
  loopAdditionalSlides: 5,
  preloadImages: false,
  lazy: true,
  observer: true,
  observeParents: true,
  // Navigation arrows
  navigation: {
    nextEl: ".kitchen-large__controls_right",
    prevEl: ".kitchen-large__controls_left",
  },
});
export const kitchenLargeSwiper = new Swiper(".kitchen-small__swiper", {
  slidesPerView: 1,
  spaceBetween: 32,
  speed: 800,
  loop: true,
  preloadImages: false,
  lazy: true,

  // Navigation arrows
  navigation: {
    nextEl: ".kitchen-small__controls_right",
    prevEl: ".kitchen-small__controls_left",
  },
});
export const kitchenFullSwiper = new Swiper(".kitchen-full__swiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 32,
  speed: 800,
  preloadImages: false,
  lazy: true,

  // Navigation arrows
  navigation: {
    nextEl: ".kitchen-full__controls_right",
    prevEl: ".kitchen-full__controls_left",
  },
});
export const gallaryDetailSwiper = new Swiper(".detail-gallary__swiper", {
  loop: true,
  slidesPerView: "auto",
  spaceBetween: 20,
  freeMode: true,
});
export const popularKitSwiper = new Swiper(".popular-kit__swiper", {
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
export const rewievsCardSwiper = new Swiper(".reviews-card__swiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  speed: 800,
  loop: true,
  lazy: true,
  navigation: {
    nextEl: ".reviews-card__swiper-controls_right",
    prevEl: ".reviews-card__swiper-controls_left",
  },
});

export const materialsSwiper = new Swiper(".materials__swiper", {
  slidesPerView: 1,
  spaceBetween: -10,
  parallax: true,
  enabled: false,
  // loop: true,
  speed: 800,
  navigation: {
    nextEl: ".materials__control-button",
  },
  breakpoints: {
    770.5: {
      enabled: true,
    },
  },
});
