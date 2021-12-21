// поиск кнопки по идентификатору
var hamburgerButton = document.querySelector('#hamburger');

// поиск меню по идентификатору
var hamburgerMenu = document.querySelector('#hamburgerMenu');
let links = document.querySelectorAll('.menu__link');

// слушаем события на кнопке
// при клике снимаем и возвращаем активный класс на кнопку и меню

hamburgerButton.addEventListener('click', toggleMenu);

function toggleMenu(event) {
  event.preventDefault();
  hamburgerButton.classList.toggle('hamburger--active');
  hamburgerMenu.classList.toggle('menu--active');
}

links.forEach(function(element) {
  element.addEventListener('click', toggleMenu);
});