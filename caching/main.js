(function() {
  'use strict';

  var nav   = document.querySelector('.fixed-nav');
  if(!nav) return true;

  var navHeight   = 0,
      navTop      = 0,
      scrollCurr  = 0,
      scrollPrev  = 0,
      scrollDiff  = 0;

  window.addEventListener('scroll', function() {
    navHeight = nav.offsetHeight;
    scrollCurr = window.pageYOffset;
    scrollDiff = scrollPrev - scrollCurr;
    navTop = parseInt(window.getComputedStyle(nav).getPropertyValue('top')) + scrollDiff;

    // Scroll to top: fix navbar to top
    if(scrollCurr <= 0) 
      nav.style.top = '0px';

    // Scroll up: show navbar
    else if(scrollDiff > 0) 
      nav.style.top = (navTop > 0 ? 0 : navTop) + 'px';

    // Scroll down: hide navbar
    else if(scrollDiff < 0) {
      nav.style.top = (Math.abs(navTop) > navHeight ? - navHeight : navTop) + 'px';
    }

    // Note last scroll position
    scrollPrev = scrollCurr;
  });

}());