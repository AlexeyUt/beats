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
  var errorFields = form.find$(".input-error");
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
}); //Отправка на сервер

var form = document.querySelector('#form');
var send = document.querySelector('#send');
send.addEventListener('click', function (event) {
  event.preventDefault();

  if (validateForm(myForm)) {
    var data = {
      name: form.elements.name.value,
      phone: form.elements.phone.value,
      comment: form.elements.comment.value,
      to: form.elements.to.value
    };
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.addEventListener('load', function () {
      if (xhr.response.status) {
        console.log('Всё ок!');
      }
    });
  }
});

function validateForm(form) {
  var valid = true;

  if (!validateField(form.elements.name)) {
    valid = false;
  }

  if (!validateField(form.elements.phone)) {
    valid = false;
  }

  if (!validateField(form.elements.comment)) {
    valid = false;
  }

  if (!validateField(form.elements.to)) {
    valid = false;
  }

  return valid;
}

function validateField(field) {
  field.nextElementSibling.textContent = field.validationMessage;
  return field.checkValidity();
}