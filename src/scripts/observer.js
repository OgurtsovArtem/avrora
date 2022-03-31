// ====================== LAZY-LOADING ======================
export default class Observer {
  constructor({
    element,
    activationRangeTop,
    activationRangeBottom,
    playOnce,
    updateFrequency,
    activeClass,
    top,
    bottom,
    imageLoad,
  }) {
    this.element = element;
    this.top = activationRangeTop ? top || 0 : null;
    this.bottom = activationRangeBottom ? bottom || 0 : null;
    this.activationRangeTop = activationRangeTop || false;
    this.activationRangeBottom = activationRangeBottom || false;
    this.playOnce = playOnce || false;
    this.updateFrequency = updateFrequency || 20;
    this.activeClass = activeClass || "_scroll";
    this.imageLoad = imageLoad;
    // Внутренние переменные
    this.entries = null;
    this.observer = null;
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
    this.element.classList.remove(this.activeClass);
  }

  removeClass() {
    this.element.classList.add(this.activeClass);
  }

  scrollHandler() {
    if (this.activationRangeTop || this.activationRangeBottom) {
      this.determiningDirection();
    } else {
      this.inObject();
    }
  }

  determiningDirection() {
    if (this.activationRangeTop) {
      this.atDistanceOnTop();
    } else if (this.activationRangeBottom) {
      this.atDistanceOnBottom();
    }
  }

  atDistanceOnTop() {
    return this.entries.boundingClientRect.top >= this.top
      ? this.addClass()
      : this.removeClass();
  }

  atDistanceOnBottom() {
    return this.entries.boundingClientRect.bottom <= this.bottom
      ? this.addClass()
      : this.removeClass();
  }
  setImageSrc() {
    const src = this.element.dataset.src;

    this.element.setAttribute("src", src);

    this.element.onload = () => {
      this.observer.unobserve(this.element);
      this.element.removeAttribute("data-src");
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
      this.removeClass();
    }
  }
}
