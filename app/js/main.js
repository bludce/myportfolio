  $(function() {
    $('.mobile-menu__icon').on('click', function() {
      $(".nav").addClass('nav_block')
      $(".close").addClass("close-display")
      $("body").css("overflow","hidden")
    });
    $('.close').on('click', function() {
      $(".nav").removeClass('nav_block')
      $(".close").removeClass("close-display")
      $("body").css("overflow","auto")
    });
    $('.nav__link').on('click', function() {
      $(".nav").removeClass('nav_block')
      $(".close").removeClass("close-display")
      $("body").css("overflow","auto")
    });
  });
