$(document).ready(() => {
  /*Инициализация слайдера*/
  const swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,

    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    scrollbar: {
      el: '.swiper-scrollbar'
    }
  });

  const header = $('.js-header:last');
  const header_phones = $('.js-header-phones:last');
  const header_request = $('.js-header-request:last');

  let scrollState = 'top';
  let menuIsOpen = false;

  /*Добавление/удаление классов в headerЕ в зависимости от скролла*/
  function headerStyle(scrollPos) {
    if (scrollPos != 0 && scrollState === 'top') {
      header.addClass('header--scrolled');
      header_phones.addClass('header__action--hidden');
      header_request.removeClass('header__action--hidden');

      scrollState = 'scrolled';
    } else if (scrollPos === 0 && scrollState === 'scrolled') {
      header.removeClass('header--scrolled');
      header_phones.removeClass('header__action--hidden');
      header_request.addClass('header__action--hidden');

      scrollState = 'top';
    }
  }

  /*Автоматическое закрытие адаптивного меню при скролле*/
  function closeAdaptiveMenu() {
    if (menuIsOpen) {
      $('.js-nav').removeAttr('style');
      menuIsOpen = !menuIsOpen;
    }
  }

  /*Отображение бокового слайдера в зависимости от скролла*/
  function showSlider(scrollPos) {
    if (scrollPos > 869) $('.js-g-nav').css('display', 'flex');
    else $('.js-g-nav').removeAttr('style');
  }

  $(window).scroll(function() {
    let scrollPos = $(this).scrollTop();

    headerStyle(scrollPos);
    closeAdaptiveMenu();
    showSlider(scrollPos);
    anchorStyleChange.call(this);
  });

  /*Добавление/удаление классов у nav и его дочерних элементов, в зависимости от ширины экрана*/
  $(window).resize(() => {
    if ($(window).width() <= 750) {
      $('.js-nav').addClass('header__nav-container--vertical');
      $('.js-nav-link').addClass('header__link--vertical');

      /*Скрытие бокового скролла*/
      $('.js-g-nav').addClass('g-nav--disable');
    } else {
      $('.js-nav').removeClass('header__nav-container--vertical');
      $('.js-nav-link').removeClass('header__link--vertical');

      /*Отмена скрытия бокового скролла*/
      $('.js-g-nav').removeClass('g-nav--disable');
    }
  });

  /*Добавление атрибутов у nav при нажатии кнопку меню*/
  $('.js-menu').click(event => {
    if (menuIsOpen) {
      $('.js-nav').removeAttr('style');
    } else {
      if (scrollState === 'top') {
        $('.js-nav').css({
          display: 'flex',
          marginTop: '120px'
        });
      } else if (scrollState === 'scrolled') {
        $('.js-nav').css({
          display: 'flex',
          marginTop: '80px'
        });
      }
    }

    menuIsOpen = !menuIsOpen;

    event.preventDefault();
  });

  /*Плавный переход между якорями*/
  let lastId,
    topMenu = $('.js-anchor'),
    topMenuHeight = topMenu.outerHeight() - 40,
    menuItems = topMenu.find('a'),
    scrollItems = menuItems.map(function() {
      let item = $($(this).attr('href'));
      if (item.length) {
        return item;
      }
    });

  menuItems.click(function(e) {
    let href = $(this).attr('href'),
      offsetTop = href === '#' ? 0 : $(href).offset().top - topMenuHeight + 1;
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: offsetTop
        },
        300
      );
    e.preventDefault();
  });

  /*Функция изменения стилей у якорей*/
  function anchorStyleChange() {
    let fromTop = $(this).scrollTop() + topMenuHeight;

    let cur = scrollItems.map(function() {
      if ($(this).offset().top < fromTop) return this;
    });

    cur = cur[cur.length - 1];
    let id = cur && cur.length ? cur[0].id : '';

    if (lastId !== id) {
      lastId = id;

      let a = menuItems
        .removeClass((index, className) => {
          return (className.match(/(\S+)--active()/g) || []).join(' ');
        })
        .filter(`[href='#${id}']`);

      $('.js-link-border').removeClass('header__link-border--active');

      a.each(function() {
        if ($(this).hasClass('header__link')) $(this).addClass('header__link--active');
        else if ($(this).hasClass('g-nav__el')) $(this).addClass('g-nav__el--active');

        $(this)
          .children('.js-link-border')
          .addClass('header__link-border--active');
      });
    }
  }

  /*Модальное окно*/
  const modal = $('.js-modal');

  $('.js-open-modal').click(event => {
    modal.css('display', 'block');
  });

  $('.js-modal-close').click(event => {
    modal.removeAttr('style');
  });

  $(window).click(event => {
    if (event.target == modal[0]) {
      modal.removeAttr('style');
    }
  });

  $('.js-modal-submit').click(event => {
    console.warn('Clicked');
  });
});
