import Swiper, { Navigation, Lazy, FreeMode, Autoplay } from "swiper";
Swiper.use([Navigation, Lazy, FreeMode, Autoplay]);

export const kitchenSmallSwiper = new Swiper(".kitchen-large__swiper", {
  slidesPerView: 1,
  spaceBetween: 32,
  speed: 800,
  loop: true,
  loadPrevNext: true,
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
  loadPrevNext: true,

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
  loadPrevNext: true,

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
  loadPrevNext: true,
  speed: 800,
  navigation: {
    nextEl: ".detail-gallary__button",
  },
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
  loadPrevNext: true,
  navigation: {
    nextEl: ".reviews-card__swiper-controls_right",
    prevEl: ".reviews-card__swiper-controls_left",
  },
});

export const materialsSwiper = new Swiper(".materials__swiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  parallax: true,
  enabled: false,
  // loop: true,
  speed: 800,
  loadPrevNext: true,
  navigation: {
    nextEl: ".materials__control-button",
  },
  breakpoints: {
    770.5: {
      enabled: true,
    },
  },
});

export const teamMediumSwiper = new Swiper(".team__image-box_medium", {
  loop: true,
  slidesPerView: "auto",
  spaceBetween: 20,
  freeMode: true,
  loadPrevNext: true,
  speed: 800,
});

export const teamLargeSwiper = new Swiper(".team__image-box_large", {
  loop: true,
  slidesPerView: "auto",
  spaceBetween: 20,
  freeMode: true,
  loadPrevNext: true,
  speed: 800,
});
