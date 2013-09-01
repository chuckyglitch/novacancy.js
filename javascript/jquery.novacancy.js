/**
* Novacancy
* jQuery Text Blink Neon Golden effect Plugin
*
* @author Chuck Chang <eurt23@gmail.com>
* @github <https://github.com/chuckyglitch>
* @twitter <https://twitter.com/chuckyglitch>
*
* @repo https://github.com/chuckyglitch/novacancy.js
* @version 0.4.3
* @license MIT http://opensource.org/licenses/MIT
* @date 09-02-2013
*/

;(function($){
  "use strict";

  var Novacancy = function(me, settings) {
    this._el = $(me);

    if (this.repeat()) return true; /* avoid repeat */

    this._settings = settings;
    this._powerOn = false;
    this._loopTimeout = 0;
    this._el.html(this.buildHTML());
    this._items = this._el.find('span.novacancy');
    this._blinkArr = this.arrayMake();
    this.bindEvent();
    this.writeCSS();

    if (this._settings.autoOn) this.blinkOn();
  };

  Novacancy.prototype.repeat = function() {
    var el = this._el;

    if (el[0].novacancy) {
      return true;
    } else {
      el[0].novacancy = true;
      return false;
    }
  }

  Novacancy.prototype.writeCSS = function() {
    var cssBuilder = this.css();
    var style = $('<style>'+cssBuilder+'</style>');
    $('body').append(style);
  }

  Novacancy.prototype.selector = function() {
    var el = this._el;

    var selector = el[0].tagName;
    if (el[0].id) selector += ("#" + el[0].id);
    if (el[0].className) selector += ("." + el[0].className);

    return selector;
  };

  Novacancy.prototype.css = function() {
    var selector = this.selector();
    var settings = this._settings;

    var textShadow = 'text-shadow: '+settings.glow.toString()+';';
    var colorOn = 'color: '+settings.color+';'+textShadow;
    var colorOff = 'color: '+settings.color+'; opacity: 0.3;';

    var css = '';
    css += (selector+' .novacancy.on { '+colorOn+' }'+'\n');
    css += (selector+' .novacancy.off { '+colorOff+' }'+'\n');

    return css;
  };

  Novacancy.prototype.rand = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  };

  Novacancy.prototype.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  Novacancy.prototype.blink = function(item) {
    /* blink 1 time */
    var settings = this._settings;

    var that = this;
    this.off(item);
    item[0].blinking = true;
    setTimeout(function() {
      that.on(item);
      item[0].blinking = false;
      that.reblink(item);
    }, this.rand(settings.blinkMin, settings.blinkMax) );
  };

  Novacancy.prototype.reblink = function (item) {
    var settings = this._settings;

    var that = this;
    setTimeout(function() {
      /* continue blink check */
      if (that.rand(1,100) <= settings.reblinkProbability) {
        that.blink(item);      
      }
    }, this.rand(settings.blinkMin, settings.blinkMax) );
  };

  Novacancy.prototype.on = function(item) {
    item.removeClass('off').addClass('on');
  };

  Novacancy.prototype.off = function(item) {
    item.removeClass('on').addClass('off');
  };

  Novacancy.prototype.buildHTML = function() {
    var el = this._el;
    var htmlBuilder = '';

    $.each(el.contents(), function(index, value) {
      if (value.nodeType == 3) { /* text */
        var txts = value.nodeValue.split('');
        $.each(txts, function(index, value) {
          htmlBuilder += ( '<span class="novacancy on">'+value+'</span>' );
        });
      } else {
        htmlBuilder += value.outerHTML;
      }
    });

    return htmlBuilder;
  };

  Novacancy.prototype.arrayMake = function() {
    var el = this._el;
    var settings = this._settings;

    var items = this._items;
    var len = items.length;
    var randomArray = this.randomArray(len);
    var blinkArr;
    var offArr;
    var off = settings.off;
    var blink = settings.blink;
    var that = this;

    /* off make */

    off = Math.min(off, len);
    off = Math.max(0, off);

    offArr = randomArray.splice(0, off);

    $.each(offArr, function(index, value) {
      that.off($(items[value]));
    });

    /* blink array make */

    blink = (blink===0) ? len : blink;
    blink = Math.min(blink, len - off);
    blink = Math.max(0, blink);

    blinkArr = randomArray.splice(0, blink);

    return blinkArr;
  }

  Novacancy.prototype.randomArray = function(n) {
    var ary = [];
    var i;
    var r;
    var t;

    for (i = 0 ; i < n ; ++i) {
      ary[i] = i;
    }
    for (i = 0 ; i < n ; ++i) {
      r = parseInt((Math.random() * n), 10);
      t = ary[r];
      ary[r] = ary[i];
      ary[i] = t;
    }
    return ary;
  }

  Novacancy.prototype.loop = function() {
    if (!this._powerOn) return;

    var el = this._el;
    var settings = this._settings;
    var blinkArr = this._blinkArr;
    var items = this._items;

    if (blinkArr.length===0) return;

    var num;
    var item;
    var that = this;

    num = blinkArr[this.rand(0, blinkArr.length-1)];
    item = $(items[num]);   

    if (!item[0].blinking) this.blink(item);

    this._loopTimeout = setTimeout(function() {
      that.loop();
    }, this.rand(settings.loopMin, settings.loopMax));
  };

  Novacancy.prototype.blinkOn = function() {
    if (!this._powerOn) {
      var settings = this._settings;

      var that = this;

      this._powerOn = true;
      this._loopTimeout = setTimeout(function() {
        that.loop();
      }, this.rand(settings.loopMin, settings.loopMax));
    }
  };

  Novacancy.prototype.blinkOff = function() {
    if (this._powerOn) {
      this._powerOn = false;
      clearTimeout(this._loopTimeout);
    }
  };

  Novacancy.prototype.bindEvent = function() {
    var el = this._el;
    var that = this;

    el.on('blinkOn', function(e) {
      that.blinkOn();
    });

    el.on('blinkOff', function(e) {
      that.blinkOff();
    });
  };

  /*  */

  var settings = function(options){
    var settings = $.extend({
      'reblinkProbability': (1/3),
      'blinkMin': 0.01,
      'blinkMax': 0.5,
      'loopMin': 0.5,
      'loopMax': 2,
      'color': 'ORANGE',
      'glow': ['0 0 80px Orange', '0 0 30px Red', '0 0 6px Yellow'],
      'off': 0,
      'blink': 0,
      'autoOn': true
    }, options);

    settings.reblinkProbability *= 100;
    settings.blinkMin *= 1000;
    settings.blinkMax *= 1000;
    settings.loopMin *= 1000;
    settings.loopMax *= 1000;

    return settings;
  };

  $.fn.novacancy = function(options) {
    return $.each(this, function(index, value) {
      new Novacancy(this, settings(options));
    });
  };

})(jQuery);
