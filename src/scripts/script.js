document.addEventListener('DOMContentLoaded', () => {

  function header() {
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.header__menu-btn');
    let menuIsActive = false;
    
    function toggleMenu() {
      if (menuIsActive) {
        header.classList.remove('open-menu');
        menuIsActive = false;
      } else {
        header.classList.add('open-menu');
        menuIsActive = true;
      }
    }
    
    menuBtn.addEventListener('click', toggleMenu);
  }

  header();

});
