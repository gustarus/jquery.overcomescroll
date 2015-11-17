/**
 * Плагин позволяет изменить класс блока при скролле страницы.
 * Также учитывается направление скролла и скорость скролла.
 * Часть этого плагина заимствована из $.fn.overcomeScroll().
 * @autor Pavel Kondratenko (p.kondratenko)
 * @copyrights Rambler & Co
 * @created_at 22.09.15 16:14
 */

'use strict';

var $ = require('jquery');

var $window = $(window);
var $document = $(document);

var defaults = {
  thresholdEl: null,
  thresholdOffset: 0,
  sensitivity: 20,
  overcomeClass: 'overcomeScroll',
  headsUpClass: 'overcomeScrollHeadsUp'
};

$.fn.overcomeScrollHeadsUp = function(options) {
  return this.each(function() {
    var $node = $(this);
    var custom = $.extend({}, defaults, options);

    // предопределение используемых переменных
    var scrollOld;

    function onScrollHandler() {
      // получаем текущее значение скрола страницы
      var scrollNew = $window.scrollTop();

      // проверяем, прокручена ли страница до определенного значения
      var isThresholdOvercome = scrollNew >= ((custom.thresholdEl ? custom.thresholdEl.offset().top : 0) + custom.thresholdOffset);

      // проверяем, прокручивается ли страница сверху вниз
      var isGoingDown = scrollNew > scrollOld;

      // проверяем, достаточно ли быстро прокручивается страница
      var isFastEnough = scrollNew < scrollOld - custom.sensitivity;

      // проверяем, не была ли прокручена страница до конца
      var isRockBottom = scrollNew <= 0 || scrollNew + $window.height() >= $document.height();

      // проверяем, нужно ли показать блок
      if (isThresholdOvercome) {
        if (isThresholdOvercome && isGoingDown) {
          $node.addClass(custom.headsUpClass);
        } else if (!isGoingDown && isFastEnough && !isRockBottom || !isThresholdOvercome) {
          $node.removeClass(custom.headsUpClass);
        }

        $node.addClass(custom.overcomeClass);
      } else {
        $node.removeClass(custom.overcomeClass);
      }

      // сохраняем значение скролла
      scrollOld = scrollNew;
    }

    // событие - скролл страницы
    onScrollHandler();
    $window.on('scroll', $.throttle(onScrollHandler, 100));
  });
};
