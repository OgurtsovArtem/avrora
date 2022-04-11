// ====================== LAZY-LOADING ======================
export default class Observer {
  constructor({
    element,
    rootMargin,
    playOnce,
    updateFrequency,
    activeClass,
    imageLoad,
  }) {
    this.element = element;
    this.rootMargin = rootMargin || "0px";
    this.playOnce = playOnce || false;
    this.updateFrequency = updateFrequency || 20;
    this.activeClass = activeClass || "_active";
    this.imageLoad = imageLoad;
    // Внутренние переменные
    this.entries = null;
    this.observer = null;

    if (!this.element) {
      return;
    }
    this.observe();
  }

  _thresholdArray() {
    return Array(this.updateFrequency + 1)
      .fill(0)
      .map((item, index) => index / this.updateFrequency || 0);
  }

  _handleIntersect(entries) {
    [this.entries] = entries;
    this.scrollHandler();
    if (this.playOnce) {
      this.unobserve();
    }
  }

  observe() {
    this.observer = new IntersectionObserver(this._handleIntersect.bind(this), {
      threshold: this._thresholdArray(),
      rootMargin: this.rootMargin,
    });

    this.observer.observe(this.element);
  }

  unobserve() {
    const destroyWatcher = () => {
      this.observer.unobserve(this.element);
      this.element.removeEventListener("transitionend", destroyWatcher);
    };
    this.element.addEventListener("transitionend", destroyWatcher);
  }

  addClass() {
    this.element.classList.add(this.activeClass);
  }

  removeClass() {
    this.element.classList.remove(this.activeClass);
  }

  scrollHandler() {
    if (this.activationRangeTop || this.activationRangeBottom) {
      this.determiningDirection();
    } else {
      this.inObject();
    }
  }
  setImageSrc() {
    const src = this.element.dataset.src;
    let srcset = null;
    if (this.element.dataset.srcset) {
      srcset = this.element.dataset.srcset;
      this.element.setAttribute("srcset", srcset);
    }

    this.element.setAttribute("src", src);

    this.element.onload = () => {
      this.observer.unobserve(this.element);
      this.element.removeAttribute("data-src");
      if (srcset) {
        this.element.removeAttribute("data-srcset");
      }
      this.element.dataset.lazy = "done";
    };

    this.element.onerror = () => {
      this.element.dataset.lazy = "error-loading";
    };
  }
  inObject() {
    if (this.entries.isIntersecting) {
      this.addClass();
      this.imageLoad ? this.setImageSrc() : null;
    } else {
      if (!this.playOnce) {
        // Убирает баг когда элемент не закночил анимацию но класс убирается (случается если резко провернуть колесико туда-обратно)
        this.removeClass();
      }
    }
  }
}
