/**
* Novacancy jQuery plug-in
* Text Blink Neon Golden effect
*
* @author Chuck Chang <eurt23@gmail.com>
* @version 0.2
* @license MIT http://opensource.org/licenses/MIT
* @date 07-24-2013
*/

(function($){

	var COLORS = {
		'WHITE': {
			'ON': 'color: White; text-shadow: 0 0 80px White, 0 0 30px Green, 0 0 6px Blue;',
			'OFF': 'color: White; opacity: 0.3;'
		},
		'RED': {
			'ON': 'color: Red; text-shadow: 0 0 80px Red, 0 0 30px FireBrick, 0 0 6px DarkRed;',
			'OFF': 'color: Red; opacity: 0.3;'
		},
		'ORANGE': {
			'ON': 'color: Orange; text-shadow: 0 0 80px Orange, 0 0 30px Red, 0 0 6px Yellow;',
			'OFF': 'color: Orange; opacity: 0.3;'
		}
	}

    $.fn.novacancy = function(options){

        var opts = $.extend({}, $.fn.novacancy.defaults, options);

        return novacancy($(this), opts);
    };

	function rand(min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	function blink(item, blinkMin, blinkMax, reblinkProbability) {
	    /* blink 1 time */
	    off(item);
	    item.blinking = true;
	    setTimeout(function() {
	        on(item);
	        item.blinking = false;
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

	function novacancy(items, options) {


		/* parameters */

		var _reblinkProbability = (options.reblinkProbability) ? options.reblinkProbability : (1/3);
		_reblinkProbability *= 100;

		var _blinkMin = (options.blinkMin) ? options.blinkMin : 0.01;
		_blinkMin *= 1000;

		var _blinkMax = (options.blinkMax) ? options.blinkMax : 0.5;
		_blinkMax *= 1000;

		var _loopMin = (options.loopMin) ? options.loopMin : 0.5;
		_loopMin *= 1000;

		var _loopMax = (options.loopMax) ? options.loopMax : 2;
		_loopMax *= 1000;

		var _color = (options.color) ? COLORS[options.color] : COLORS['ORANGE'];
		var _blink = (options.blink===false) ? false : true;

		/* */

		var cssBuilder = '';
		var cssBuildChecker = {};

		$.each(items, function(index, value) {

			/* css string combine */

			if (!cssBuildChecker[items.selector]) {
				cssBuildChecker[items.selector] = 1;
				cssBuilder += (items.selector+' .novacancy.on { '+_color['ON']+' }'+'\n');
				cssBuilder += (items.selector+' .novacancy.off { '+_color['OFF']+' }'+'\n');
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

		    var that = $(this);
		    that.html(htmlBuilder);


		    /* blink loop */

		    var len = that.find('span.novacancy').length-1;

		    function loop() {
		        var num = rand(0, len);
		        var item = that.find('span.novacancy:eq('+num+')');
		        if (!item.blinking) blink(item, _blinkMin, _blinkMax, _reblinkProbability);
		        setTimeout(loop, rand(_loopMin, _loopMax) );
		    }

		    if (_blink) setTimeout(loop, rand(_loopMin, _loopMax) );


		});


		/* css string append */
		var style = $('<style>'+cssBuilder+'</style>');
		$('body').append(style);


		return items;
	}

})(jQuery);
