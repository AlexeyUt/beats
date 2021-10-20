let hamburger = document.querySelector('.hamburger');
let overlay = document.querySelector('.overlay');
let body = document.querySelector('body');

let links = document.querySelectorAll('.menu__link');

links.forEach(function(element) {
  element.addEventListener('click', toggleMenu);
});

function toggleMenu() {
  hamburger.classList.toggle('hamburger__active');
  overlay.classList.toggle('overlay__active');
  body.classList.toggle('body__active-menu');
}