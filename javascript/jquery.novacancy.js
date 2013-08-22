/**
* Novacancy
* jQuery Text Blink Neon Golden effect Plugin
*
* @author Chuck Chang <eurt23@gmail.com>
* @github   <https://github.com/chuckyglitch>
* @twitter  <https://twitter.com/chuckyglitch>
*
* @repo https://github.com/chuckyglitch/novacancy.js
* @version 0.3.1
* @license MIT http://opensource.org/licenses/MIT
* @date 08-22-2013
*/

;(function($){
    "use strict";

    $.fn.novacancy = function(options){

        /* parameters */

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

        /* */

        return novacancy($(this), settings);
    };

    function rand(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function blink(item, blinkMin, blinkMax, reblinkProbability) {
        /* blink 1 time */
        off(item);
        item[0].blinking = true;
        setTimeout(function() {
            on(item);
            item[0].blinking = false;
            reblink(item, blinkMin, blinkMax, reblinkProbability);
        }, rand(blinkMin, blinkMax) );
    }

    function reblink(item, blinkMin, blinkMax, reblinkProbability) {
        setTimeout(function() {
            /* continue blink check */
            if (rand(1,100) <= reblinkProbability) {
                blink(item, blinkMin, blinkMax, reblinkProbability);      
            }
        }, rand(blinkMin, blinkMax) );
    }

    function on(item) {
        item.removeClass('off').addClass('on');
    }

    function off(item) {
        item.removeClass('on').addClass('off');
    }

    function novacancy(items, settings) {

        items = $(items);

        /* */

        var cssBuilder = '';
        var cssBuildChecker = {};

        $.each(items, function(index, value) {

            var that = $(this);
            var powerOn = false;

            /* avoid repeat */

            if (that[0].novacancy) {
                return true;
            }
            that[0].novacancy = true;

            /* css string combine */

            var textShadow = 'text-shadow: '+settings.glow.toString()+';';
            var colorOn = 'color: '+settings.color+';'+textShadow;
            var colorOff = 'color: '+settings.color+'; opacity: 0.3;';

            if (!cssBuildChecker[items.selector]) {
                cssBuildChecker[items.selector] = 1;
                cssBuilder += (items.selector+' .novacancy.on { '+colorOn+' }'+'\n');
                cssBuilder += (items.selector+' .novacancy.off { '+colorOff+' }'+'\n');
            }

            /* html string combine & rebuild to html */

            var htmlBuilder = '';

            $.each($(this).contents(), function(index, value) {
                
                if (value.nodeType == 3) {
                    var txts = value.nodeValue.split('');
                    $.each(txts, function(index, value) {
                        htmlBuilder += ( '<span class="novacancy on">'+value+'</span>' );
                    });
                } else {
                    htmlBuilder += value.outerHTML;
                }

            });

            that.html(htmlBuilder);

            /* */

            var len = that.find('span.novacancy').length;
            var blinkArr = [];
            var offArr = [];
            var blinkArrLen;
            var loopTimeout;
            var arrLimit;

            /* off make */

            if (settings.off > 0) {
                if (settings.off > len) settings.off = len;
                for (var i = 1; i <= settings.off; i++) {
                    var num;
                    var item;

                    do {
                        num = rand(0, len-1);
                    } while ($.inArray(num, offArr) != -1);

                    offArr.push(num);
                    item = that.find('span.novacancy:eq('+num+')');
                    off(item);
                }
            } else {
                settings.off = 0;
            }

            /* blink array make */

            if (settings.blink > 0) {
                if (settings.blink > len) settings.blink = len;

                if ((settings.blink + settings.off) > len) {
                    settings.blink = settings.blink - settings.off;
                    if (settings.blink < 0) settings.blink = 0;
                }

                arrLimit = settings.blink;
            } else {
                arrLimit = len - settings.off;
            }

            for (i = 1; i<= arrLimit; i++) {
                do {
                    num = rand(0, len-1);
                } while ( ($.inArray(num, offArr) != -1) || ($.inArray(num, blinkArr) != -1) );
                blinkArr.push(num);
            }

            blinkArrLen = blinkArr.length;


            /* blink loop */

            function loop() {
                if (!powerOn) return;

                var num;
                var item;

                num = blinkArr[rand(0, blinkArrLen-1)];
                item = that.find('span.novacancy:eq('+num+')');                     
                if (!item[0].blinking) blink(item, settings.blinkMin, settings.blinkMax, settings.reblinkProbability);

                loopTimeout = setTimeout(loop, rand(settings.loopMin, settings.loopMax) );
            }

            function blinkOn() {
                if (!powerOn) {
                    powerOn = true;
                    loopTimeout = setTimeout(loop, rand(settings.loopMin, settings.loopMax) );
                }
            }

            function blinkOff() {
                if (powerOn) {
                    powerOn = false;
                    clearTimeout(loopTimeout);
                }
            }

            if (settings.autoOn) blinkOn();

            /* events bind */

            $(this).on('blinkOn', function(e) {
                blinkOn();
            });

            $(this).on('blinkOff', function(e) {
                blinkOff();
            });

        });


        /* css string append */

        var style = $('<style>'+cssBuilder+'</style>');
        $('body').append(style);

        /* */

        return items;
    }

})(jQuery);
