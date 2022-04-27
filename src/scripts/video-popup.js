import Popups from "./popups";
import throttle from "./throttle";

export default class VideoPopup extends Popups {
  constructor({ popupClass, openButtons, closeButtonClass, activeClass, mobileSize }) {
    super({ popupClass, openButtons, closeButtonClass, activeClass });
    this.openButtons = openButtons;
    this.popupVideo = document.querySelector(`.${this.popupClass} video`);
    this.desctopLink = null;
    this.mobileLink = null;
    this.mobileSize = mobileSize || 1035;

    if (!this.popup) {
      return;
    }
    this.setListener();
    this.statusVideoCheck();
  }
  mobileCheck() {
    return window.matchMedia(`(max-width: ${this.mobileSize}px)`).matches ? true : false;
  }
  addErrorClass() {
    this.popup.classList.add("_error-loading");
  }
  removeErrorClass() {
    this.popup.classList.remove("_error-loading");
  }
  searchVideo(event) {
    const { currentTarget } = event;
    if (currentTarget.getAttribute("data-video-mobile")) {
      this.mobileLink = currentTarget.getAttribute("data-video-mobile");
    }
    if (currentTarget.getAttribute("data-video-desktop")) {
      this.desctopLink = currentTarget.getAttribute("data-video-desktop");
    }
    this.handler();
  }
  statusVideoCheck() {
    this.observer = new MutationObserver((mutationRecords) => {
      if (!mutationRecords[0].target.classList.contains("_active")) {
        this.observer.disconnect();
        this.removeErrorClass();
        this.popupVideo.pause();
      }
    });
  }

  checkLoadVideo(video) {
    video.onerror = () => {
      this.addErrorClass();
      throw Error("The video cannot be uploaded");
    };
    video.play();
  }

  handler() {
    //   Возобновляем слежение за элементом
    this.observer.observe(this.popup, { attributes: true });

    switch (this.mobileCheck()) {
      case true:
        this.popupVideo.setAttribute("src", this.mobileLink ?? this.desctopLink);
        this.popupVideo.dataset.videoStatus = "done";
        this.checkLoadVideo(this.popupVideo);
        break;
      case false:
        this.popupVideo.setAttribute("src", this.desctopLink ?? this.mobileLink);
        this.popupVideo.dataset.videoStatus = "done";
        this.checkLoadVideo(this.popupVideo);
        break;
      default:
        this.popupVideo.dataset.videoStatus = "link not found";
        throw SyntaxError(
          "Не найден один из необходимых атрибутов [data-video-desktop] или [data-video-mobile]"
        );
    }
  }
  setListener() {
    this.openButtons.forEach((button) => {
      button.addEventListener("click", this.searchVideo.bind(this));
    });
  }
}
