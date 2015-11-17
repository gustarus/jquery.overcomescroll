/**
 * Плагин позволяет добавить класс блоку при достаточном скролле страницы.
 * @author Pavel Kondratenko (p.kondratenko)
 * @copyrights Rambler & Co
 * @created_at 22.09.15 16:14
 */

'use strict';

(function(factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    factory(require("jquery"), window, document);
  } else {
    factory(jQuery, window, document);
  }
}(function($, window, document, undefined) {
  var $window = $(window);

  var defaults = {
    thresholdEl: null,
    thresholdOffset: 0,
    throttleInterval: 100,
    overcomeClass: 'overcomeScroll'
  };

  $.fn.overcomeScroll = function(options) {
    return this.each(function() {
      var $node = $(this);
      var custom = $.extend({}, defaults, options);

      // приводим элемент к объекту jquery
      if(custom.thresholdEl && typeof custom.thresholdEl !== $) {
        custom.thresholdEl = $(custom.thresholdEl)
      }

      function onScrollHandler() {
        // проверяем, проскроллена ли страница до нужной границы
        if ($window.scrollTop() >= ((custom.thresholdEl ? custom.thresholdEl.offset().top : 0) + custom.thresholdOffset)) {
          $node.addClass(custom.overcomeClass);
        } else {
          $node.removeClass(custom.overcomeClass);
        }
      }

      // событие - скролл страницы
      onScrollHandler();
      $window.on('scroll', throttle(onScrollHandler, custom.throttleInterval));
    });
  };

  function throttle(fn, threshold, scope) {
    var previous;
    var deferTimer;
    var limit = threshold || 250;

    return function() {
      var context = scope || this;
      var now = Date.now();
      var args = arguments;

      if (previous && now < previous + limit) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          previous = now;
          fn.apply(context, args);
        }, limit);
      } else {
        previous = now;
        fn.apply(context, args);
      }
    };
  }
}));
