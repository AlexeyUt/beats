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
};

links.forEach(function(element) {
  element.addEventListener('click', toggleMenu);
});

//Слайдер-карусель

const slider = $('.offers').bxSlider({
  pager: false,
  controls: false
});

$('.offers-slider__arrow--left').click(e => {
  e.preventDefault();

  slider.goToPrevSlide();
});

$('.offers-slider__arrow--right').click(e => {
  e.preventDefault();

  slider.goToNextSlide();
});

//Слайдшоу - переключение
const findBlockByAlias = (alias) => {
  return $(".reviews__item").filter((ndx, item) => {
    return $(item).attr("data-chain") === alias;
  });
};

$(".reviews-switcher__link").click((e) => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-open");
  const itemToShow = findBlockByAlias(target);
  const curItem = $this.closest(".reviews-switcher__item");

  itemToShow.addClass("active").siblings().removeClass("active");
  curItem.addClass("active").siblings().removeClass("active");
});

//Вертикальный аккордеон
const openItem = (item) => {
  const container = item.closest(".team__item");
  const contentBlock = container.find(".team__content");
  const textBlock = contentBlock.find(".team__content-block");
  const reqHeight = textBlock.height();

  container.addClass("active");
  contentBlock.height(reqHeight);
};

const closeEveryItem = (container) => {
  const items = container.find(".team__content");
  const itemContainer = container.find(".team__item");

  itemContainer.removeClass("active");
  items.height(0);
};

$('.team__title').click((e) => {
  const $this = $(e.currentTarget);
  const container = $this.closest('.team');
  const elemContainer = $this.closest(".team__item");
  
  if (elemContainer.hasClass("active")) {
    closeEveryItem(container);
  } else {
    closeEveryItem(container);
    openItem($this);
  }
}); 

//Форма
const validateFields = (form, fieldsArray) => {
  fieldsArray.forEach((field) => {
    field.removeClass("input-error");
    if (field.val().trim() === "") {
      field.addClass("input-error");
    }
  });

  const errorFields = form.find(".input-error");

  return errorFields.length === 0;
}

$(".form").submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      }
    });
    request.done((data) => {
      content.text(data.message);
    });
    request.fail((data) => {
      const message = data.responseJSON.message;
      content.text(message);
      modal.addClass("error-modal");
    });
    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline"
      });
    });
  }
});

$(".app-submit-btn").click(e => {
  e.preventDefault();

  $.fancybox.close();
});

//Горизонтальный аккордеон
const mesureWidth = (unit) => {
  let reqUnitWidth = 0;
  const screenWidth = $(window).width();
  const container = unit.closest(".products__list");
  const titlesBlocks = container.find(".product__title");
  const titlesWidth = titlesBlocks.width() * titlesBlocks.length;

  const textContainer = unit.find(".product__container");
  const paddingLeft = parseInt(textContainer.css("padding-left"));
  const paddingRight = parseInt(textContainer.css("padding-right"));

  const isTablet = window.matchMedia("(max-width: 768px)").matches;
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  
  if (isTablet) {
    reqUnitWidth = screenWidth - titlesWidth;
  } 
  if (isMobile) {
    reqUnitWidth = screenWidth - titlesBlocks.width();
  } 
  
  if (!isTablet && !isMobile) {
    reqUnitWidth = 524;
  }

  return {
    container: reqUnitWidth,
    textContainer: reqUnitWidth - paddingRight - paddingLeft
  }
};

//Смена заголовка в секции "Цвета" по клику на плашку
/*$('.product__title').click(function() {
  if (!$(this).data('status')) {
    $('.products__title').text('меню');
    $(this).data('status', true);
  } else {
    $('.products__title').text('цвета');
    $(this).data('status', false);
  }  
});*/

const closeEveryUnitInContainer = container => {
  const units = container.find(".products__item");
  const content = container.find(".product__content");

  units.removeClass("active");
  content.width(0);
};

const openUnit = (unit) => {
  const hiddenContent = unit.find(".product__content");
  const reqWidth = mesureWidth(unit);
  const textBlock = unit.find(".product__container");

  unit.addClass("active");
  hiddenContent.width(reqWidth.container);
  textBlock.width(reqWidth.textContainer);
};

$(".product__title").on("click", e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const unit = $this.closest(".product");
  const unitOpened = unit.hasClass("active");
  const container = $this.closest(".products__list");

  if (unitOpened) {
    closeEveryUnitInContainer(container);
  } else {
    closeEveryUnitInContainer(container);
    openUnit(unit);
  }
});

//Видеоплеер
let video;
let durationControl;
let soundControl;
let intervalId;

// кнопки
const playBtn = document.querySelector(".video__player-img");
const soundBtn = document.querySelector(".sound");
const playerPlayBtn = document.querySelector(".duration__img");


video = document.getElementById("player");

// как только плеер загрузится
// video.addEventListener('loadeddata', function() {
    // вешаем обработчик события onclick на тег video
    video.addEventListener('click', playStop);

    // обработчики событий для кнопок play
    let playButtons = document.querySelectorAll(".play");
    for (let i = 0; i < playButtons.length; i++) {
        playButtons[i].addEventListener('click', playStop);
    }

    // обработчик событий для кнопки динамик
    let micControl = document.getElementById("mic");
    micControl.addEventListener('click', soundOf);

    // обработчики событий для ползунка продолжительности видео
    durationControl = document.getElementById("durationLevel");
    durationControl.addEventListener('input', setVideoDuration);

    durationControl.min = 0;
    durationControl.value = 0;
    // присваиваем ползунку продолжительности максимальное значение равное продолжительности нашего видео (в секундах)
    durationControl.max = video.duration;

    // обработчики событий для ползунка громокости
    soundControl = document.getElementById("micLevel");
    soundControl.addEventListener('input', changeSoundVolume);
    // soundControl.addEventListener('onmousemove', changeSoundVolume);

    // задаем максимальные и минимальные значения громокости
    soundControl.min = 0;
    soundControl.max = 10;
    // soundControl.step = 1;
    // присваиваем ползунку максимальное значение
    soundControl.value = soundControl.max;


    //обрабатываем окончание видео
    video.addEventListener('ended', function() {
        playBtn.classList.toggle("video__player-img--active");
        video.currentTime = 0;
        playerPlayBtn.classList.remove('active');
    });
// });



/*
 Воспроизведение видео
*/
function playStop() {
    // показывает или скрывает белую кнопку play
    playBtn.classList.toggle("video__player-img--active");

    // проверим стоит ли видео на паузе, если да то продолжим воспроизведение.

    if (video.paused) {
        // запускаем видео
        video.play();
        // Включаем функцию обновления прогресса
        intervalId = setInterval(updateDuration, 1000 / 60);
        // превращаем маленькую кнопку play в pause
        playerPlayBtn.classList.add('active');
        // Если, наоборот, проигрыавыется, то остановим.
    } else {
        // останавливаем видео
        video.pause();
        // останавливаем обновление прогресса
        clearInterval(intervalId);
        // превращаем маленькую кнопку pause в play
        playerPlayBtn.classList.remove('active');
    }
}

/*
    Реализует возможность перемотки нашего видео
*/
function setVideoDuration() {
    // установить значение ползунка в текущее время
    video.currentTime = durationControl.value;
    updateDuration();
    // intervalId = setInterval(updateDuration, 1000 / 60);
}


/*
  Функция для обновления позиции ползунка продолжительности видео.   
*/
function updateDuration() {
    // устанавливаем в наш инпут текущее время
    durationControl.value = video.currentTime;
    // рассчитываем процент для закраски прогресса
    let step = video.duration / 100;
    let percent = video.currentTime / step;
    // устанавливаем стили
    durationControl.style.background = `linear-gradient(90deg, #E01F3D 0%, #E01F3D ${percent}%, #626262 ${percent}%)`;

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
}

//Карта
let myMap;
const init = () => {
 myMap = new ymaps.Map("map", {
   center: [55.752132, 37.622807],
   zoom: 13,
   controls: [],
 });
 
 let coords = [
     [55.759211, 37.582637],
     [55.749662, 37.603889],
     [55.743069, 37.580987],
     [55.756917, 37.620619],
   ],
   myCollection = new ymaps.GeoObjectCollection({}, {
     draggable: false,
     iconLayout: 'default#image',
     iconImageHref: './img/icons/marker.svg',
     iconImageSize: [58, 73],
     iconImageOffset: [-35, -52]
   });
 
 for (let i = 0; i < coords.length; i++) {
   myCollection.add(new ymaps.Placemark(coords[i]));
 }
 
 myMap.geoObjects.add(myCollection);
 
 myMap.behaviors.disable('scrollZoom');
};
 
ymaps.ready(init);

//One page scroll
const sections = $("section");
const display = $(".maincontent");
const sideMenu = $(".fixed-menu");
const menuItems = sideMenu.find(".fixed-menu__item");

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

let inScroll = false;

sections.first().addClass("active");

const countSectionPosition = (sectionEq) => {
  const position = sectionEq * -100;

  if (isNaN(position)) {
    console.error("передано неверное значение в countSectionPosition");
    return 0;
  }
  
  return position;
};

const changeMenuThemeForSection = sectionEq => {
  const currentSection = sections.eq(sectionEq);
  const menuTheme = currentSection.attr("data-sidemenu-theme");
  const activeClass = "fixed-menu--shadowed";

  if (menuTheme === "white") {
    sideMenu.addClass(activeClass);
  } else {
    sideMenu.removeClass("fixed-menu--shadowed");
  }
};

const resetActiveClassForItem = (items, itemEq, activeClass) => {
  items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
}

const performTransition = (sectionEq) => {
  if (inScroll) return;

  const transitionOver = 1000;
  const mouseInertiaOver = 300;

  inScroll = true;

  const position = countSectionPosition(sectionEq);

  changeMenuThemeForSection(sectionEq);

  display.css({
    transform: `translateY(${position}%)`
  });

  resetActiveClassForItem(sections, sectionEq, "active");

  setTimeout(() => {
    inScroll = false;

    resetActiveClassForItem(menuItems, sectionEq, "fixed-menu__item--active");
  }, transitionOver + mouseInertiaOver);
};

const viewportScroller = () => {
  const activeSection = sections.filter(".active");
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index())
      }
    },
    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index())
      }
    },
  };
};

$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;
  const scroller = viewportScroller();

  if (deltaY > 0) {
    scroller.next();
  }

  if (deltaY < 0) {
    scroller.prev();
  }
});

$(window).on("keydown", e => {
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName === "input" || tagName === "textarea";
  const scroller = viewportScroller();

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38: //prev
    scroller.prev();
      break;
  
    case 40: //next
      scroller.next();
      break;
  }
});

$(".wrapper").on("touchmove", e => e.preventDefault());

$("[data-scroll-to]").click(e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${target}]`);

  performTransition(reqSection.index());
})

if (isMobile) {
  $("body").swipe({
    swipe: function (event, direction) {
      const scroller = viewportScroller();
      let scrollDirection = "";
  
      if (direction === "up") scrollDirection = "next";
      if (direction === "down") scrollDirection = "prev";

      if (scrollDirection == "next" || scrollDirection == "prev") {
        scroller[scrollDirection]();  
      }
    }
  });
}