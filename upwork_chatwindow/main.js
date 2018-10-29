(function($) {
  jQuery.fn.extend({
    slimScroll: function(o) {
      var ops = o;
      this.each(function() {
        var isOverPanel,
          isOverBar,
          isDragg,
          queueHide,
          barHeight,
          divS = '<div></div>',
          minBarHeight = 30,
          wheelStep = 30,
          o = ops || {},
          cwidth = o.width || 'auto',
          cheight = o.height || '250px',
          size = o.size || '7px',
          color = o.color || '#000',
          position = o.position || 'right',
          opacity = o.opacity || .4,
          alwaysVisible = o.alwaysVisible === true;
        var me = $(this);
        var wrapper = $(divS).css({
          position: 'relative',
          overflow: 'hidden',
          width: cwidth,
          height: cheight
        }).attr({
          'class': 'slimScrollDiv'
        });
        me.css({
          overflow: 'hidden',
          width: cwidth,
          height: cheight
        });
        var rail = $(divS).css({
          width: '10px',
          height: '100%',
          position: 'absolute',
          top: 0
        });
        var bar = $(divS).attr({
          'class': 'slimScrollBar ',
          style: 'border-radius: ' + size
        }).css({
          background: color,
          width: size,
          position: 'absolute',
          top: 0,
          opacity: opacity,
          display: alwaysVisible ? 'block' : 'none',
          BorderRadius: size,
          MozBorderRadius: size,
          WebkitBorderRadius: size,
          zIndex: 99
        });
        var posCss = (position == 'right') ? {
          right: '1px'
        } : {
          left: '1px'
        };
        rail.css(posCss);
        bar.css(posCss);
        me.wrap(wrapper);
        me.parent().append(bar);
        me.parent().append(rail);
        bar.draggable({
          axis: 'y',
          containment: 'parent',
          start: function() {
            isDragg = true;
          },
          stop: function() {
            isDragg = false; hideBar();
          },
          drag: function(e) {
            scrollContent(0, $(this).position().top, false);
          }
        });
        rail.hover(function() {
          showBar();
        }, function() {
          hideBar();
        });
        bar.hover(function() {
          isOverBar = true;
        }, function() {
          isOverBar = false;
        });
        me.hover(function() {
          isOverPanel = true;
          showBar();
          hideBar();
        }, function() {
          isOverPanel = false;
          hideBar();
        });

        var _onWheel = function(e) {
          if (!isOverPanel && !isOverBar) {
            return;
          }
          var e = e || window.event;
          var delta = 0;
          if (e.wheelDelta) {
            delta = -e.wheelDelta / 120;
          }
          if (e.detail) {
            delta = e.detail / 3;
          }
          scrollContent(0, delta, true);
          if (e.preventDefault) {
            e.preventDefault();
          }
          e.returnValue = false;
        }
        var scrollContent = function(x, y, isWheel) {
          var delta = y;

          if (isWheel) {
            delta = bar.position().top + y * wheelStep;
            delta = Math.max(delta, 0);
            var maxTop = me.outerHeight() - bar.outerHeight();
            delta = Math.min(delta, maxTop);
            bar.css({
              top: delta + 'px'
            });
          }
          percentScroll = parseInt(bar.position().top) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());
          me.scrollTop(delta);
          showBar();
        }
        var attachWheel = function() {
          if (window.addEventListener) {
            this.addEventListener('DOMMouseScroll', _onWheel, false);
            this.addEventListener('mousewheel', _onWheel, false);
          } else {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }
        attachWheel();
        var getBarHeight = function() {
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({
            height: barHeight + 'px'
          });
        }
        getBarHeight();
        var showBar = function() {
          getBarHeight();
          clearTimeout(queueHide);
          if (barHeight >= me.outerHeight()) {
            return;
          }
          bar.fadeIn('fast');
        }
        var hideBar = function() {
          if (!alwaysVisible) {
            queueHide = setTimeout(function() {
              if (!isOverBar && !isDragg) {
                bar.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });
      return this;
    }
  });
  jQuery.fn.extend({
    slimscroll: jQuery.fn.slimScroll
  });
})(jQuery);

$('.chat-window').slimscroll({
  color: '#0084ff',
  size: '10px',
  width: '500px',
  height: '550px'
});
