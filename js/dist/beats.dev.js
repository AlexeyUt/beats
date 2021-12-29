"use strict";

// поиск кнопки по идентификатору
var hamburgerButton = document.querySelector('#hamburger'); // поиск меню по идентификатору

var hamburgerMenu = document.querySelector('#hamburgerMenu');
var links = document.querySelectorAll('.menu__link'); // слушаем события на кнопке
// при клике снимаем и возвращаем активный класс на кнопку и меню

hamburgerButton.addEventListener('click', toggleMenu);

function toggleMenu(event) {
  event.preventDefault();
  hamburgerButton.classList.toggle('hamburger--active');
  hamburgerMenu.classList.toggle('menu--active');
}

;
links.forEach(function (element) {
  element.addEventListener('click', toggleMenu);
}); //Слайдер-карусель

var slider = $('.offers').bxSlider({
  pager: false,
  controls: false
});
$('.offers-slider__arrow--left').click(function (e) {
  e.preventDefault();
  slider.goToPrevSlide();
});
$('.offers-slider__arrow--right').click(function (e) {
  e.preventDefault();
  slider.goToNextSlide();
}); //Слайдшоу - переключение

var findBlockByAlias = function findBlockByAlias(alias) {
  return $(".reviews__item").filter(function (ndx, item) {
    return $(item).attr("data-chain") === alias;
  });
};

$(".reviews-switcher__link").click(function (e) {
  e.preventDefault();
  var $this = $(e.currentTarget);
  var target = $this.attr("data-open");
  var itemToShow = findBlockByAlias(target);
  var curItem = $this.closest(".reviews-switcher__item");
  itemToShow.addClass("active").siblings().removeClass("active");
  curItem.addClass("active").siblings().removeClass("active");
}); //Вертикальный аккордеон

var openItem = function openItem(item) {
  var container = item.closest(".team__item");
  var contentBlock = container.find(".team__content");
  var textBlock = contentBlock.find(".team__content-block");
  var reqHeight = textBlock.height();
  container.addClass("active");
  contentBlock.height(reqHeight);
};

var closeEveryItem = function closeEveryItem(container) {
  var items = container.find(".team__content");
  var itemContainer = container.find(".team__item");
  itemContainer.removeClass("active");
  items.height(0);
};

$('.team__title').click(function (e) {
  var $this = $(e.currentTarget);
  var container = $this.closest('.team');
  var elemContainer = $this.closest(".team__item");

  if (elemContainer.hasClass("active")) {
    closeEveryItem(container);
  } else {
    closeEveryItem(container);
    openItem($this);
  }
}); //Форма

var validateFields = function validateFields(form, fieldsArray) {
  fieldsArray.forEach(function (field) {
    field.removeClass("input-error");

    if (field.val().trim() === "") {
      field.addClass("input-error");
    }
  });
  var errorFields = form.find(".input-error");
  return errorFields.length === 0;
};

$(".form").submit(function (e) {
  e.preventDefault();
  var form = $(e.currentTarget);
  var name = form.find("[name='name']");
  var phone = form.find("[name='phone']");
  var comment = form.find("[name='comment']");
  var to = form.find("[name='to']");
  var modal = $("#modal");
  var content = modal.find(".modal__content");
  modal.removeClass("error-modal");
  var isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    var request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val()
      }
    });
    request.done(function (data) {
      content.text(data.message);
    });
    request.fail(function (data) {
      var message = data.responseJSON.message;
      content.text(message);
      modal.addClass("error-modal");
    });
    request.always(function () {
      $.fancybox.open({
        src: "#modal",
        type: "inline"
      });
    });
  }
});
$(".app-submit-btn").click(function (e) {
  e.preventDefault();
  $.fancybox.close();
});
/*Горизонтальный аккордеон
const mesureWidth = () => {
  return 500;
}

const openItem = item => {
  const hiddenContent = item.find(".product__content");
  const reqWidth = mesureWidth();

  hiddenContent.width(reqWidth);
}

$(".product__title").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const item = $this.closest(".product");

  openItem(item);
});*/
//Видеоплеер

var video;
var durationControl;
var soundControl;
var intervalId; // кнопки

var playBtn = document.querySelector(".video__player-img");
var soundBtn = document.querySelector(".sound");
var playerPlayBtn = document.querySelector(".duration__img");
video = document.getElementById("player"); // как только плеер загрузится

video.addEventListener('loadeddata', function () {
  // вешаем обработчик события onclick на тег video
  video.addEventListener('click', playStop); // обработчики событий для кнопок play

  var playButtons = document.querySelectorAll(".play");

  for (var i = 0; i < playButtons.length; i++) {
    playButtons[i].addEventListener('click', playStop);
  } // обработчик событий для кнопки динамик


  var micControl = document.getElementById("mic");
  micControl.addEventListener('click', soundOf); // обработчики событий для ползунка продолжительности видео

  durationControl = document.getElementById("durationLevel");
  durationControl.addEventListener('input', setVideoDuration);
  durationControl.min = 0;
  durationControl.value = 0; // присваиваем ползунку продолжительности максимальное значение равное продолжительности нашего видео (в секундах)

  durationControl.max = video.duration; // обработчики событий для ползунка громокости

  soundControl = document.getElementById("micLevel");
  soundControl.addEventListener('input', changeSoundVolume); // soundControl.addEventListener('onmousemove', changeSoundVolume);
  // задаем максимальные и минимальные значения громокости

  soundControl.min = 0;
  soundControl.max = 10; // soundControl.step = 1;
  // присваиваем ползунку максимальное значение

  soundControl.value = soundControl.max; //обрабатываем окончание видео

  video.addEventListener('ended', function () {
    playBtn.classList.toggle("video__player-img--active");
    video.currentTime = 0;
    playerPlayBtn.classList.remove('active');
  });
});
/*
 Воспроизведение видео
*/

function playStop() {
  // показывает или скрывает белую кнопку play
  playBtn.classList.toggle("video__player-img--active"); // проверим стоит ли видео на паузе, если да то продолжим воспроизведение.

  if (video.paused) {
    // запускаем видео
    video.play(); // Включаем функцию обновления прогресса

    intervalId = setInterval(updateDuration, 1000 / 60); // превращаем маленькую кнопку play в pause

    playerPlayBtn.classList.add('active'); // Если, наоборот, проигрыавыется, то остановим.
  } else {
    // останавливаем видео
    video.pause(); // останавливаем обновление прогресса

    clearInterval(intervalId); // превращаем маленькую кнопку pause в play

    playerPlayBtn.classList.remove('active');
  }
}
/*
    Реализует возможность перемотки нашего видео
*/


function setVideoDuration() {
  // установить значение ползунка в текущее время
  video.currentTime = durationControl.value;
  updateDuration(); // intervalId = setInterval(updateDuration, 1000 / 60);
}
/*
  Функция для обновления позиции ползунка продолжительности видео.   
*/


function updateDuration() {
  // устанавливаем в наш инпут текущее время
  durationControl.value = video.currentTime; // рассчитываем процент для закраски прогресса

  var step = video.duration / 100;
  var percent = video.currentTime / step; // устанавливаем стили

  durationControl.style.background = "linear-gradient(90deg, #FEDB3F 0%, #FEDB3F ".concat(percent, "%, #626262 ").concat(percent, "%)");
}
/*
    Управление звуком
*/


function soundOf() {
  /*
      Делаем проверку уровня громкости. 
      Если у нас нашего видео есть звук, то мы его выключаем. 
      Предварительно запомнив текущую позицию громкости в переменную soundLevel
  */
  if (video.volume === 0) {
    video.volume = soundLevel;
    soundControl.value = soundLevel * 10;
    soundBtn.classList.remove('active');
  } else {
    /*
        Если у нашего видео нет звука, то выставляем уровень громкости на прежний уровень.
        Хранится в перменной soundLevel
    */
    soundLevel = video.volume;
    video.volume = 0;
    soundControl.value = 0;
    soundBtn.classList.add('active');
  }
}
/*
    Управление звуком видео
*/


function changeSoundVolume() {
  /*
      Св-во volume может принимать значения от 0 до 1
      Делим на 10 для того что бы, была возможность более точной регулировки видео. 
  video.volume 0 .... 1 
  soundControl 0 .... 10
      */
  video.volume = soundControl.value / 10;

  if (video.volume == 0) {
    soundBtn.classList.add('active');
  } else {
    soundBtn.classList.remove('active');
  }

  console.log('значение volume у видео ' + video.volume);
  console.log('значение value у micLevel ' + soundControl.value / 10);
  /**У ползунка изначально задано минимальное значение 0 и максимальное 10 чтоб дать нам 10 положений
   * регулировки
   */
} //Карта


var myMap;

var init = function init() {
  myMap = new ymaps.Map("map", {
    center: [55.752132, 37.622807],
    zoom: 11,
    controls: []
  });
  var coords = [[55.759211, 37.582637], [55.749662, 37.603889], [55.743069, 37.580987], [55.756917, 37.620619]],
      myCollection = new ymaps.GeoObjectCollection({}, {
    draggable: false,
    iconLayout: 'default#image',
    iconImageHref: './img/icons/marker.svg',
    iconImageSize: [58, 73],
    iconImageOffset: [-35, -52]
  });

  for (var i = 0; i < coords.length; i++) {
    myCollection.add(new ymaps.Placemark(coords[i]));
  }

  myMap.geoObjects.add(myCollection);
  myMap.behaviors.disable('scrollZoom');
};

ymaps.ready(init);