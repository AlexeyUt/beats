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

  const errorFields = form.find$(".input-error");

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

//Отправка на сервер
const form = document.querySelector('#form');
const send = document.querySelector('#send');

send.addEventListener('click', event => {
  event.preventDefault();

  if (validateForm(myForm)) {
    const data = {
      name: form.elements.name.value,
      phone: form.elements.phone.value,
      comment: form.elements.comment.value,
      to: form.elements.to.value
    }

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', 'https://webdev-api.loftschool.com/sendmail');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(data));
    xhr.addEventListener('load', () => {
      if (xhr.response.status) {
          console.log('Всё ок!');
      }
    });
  }
});

function validateForm(form) {
  let valid = true;

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