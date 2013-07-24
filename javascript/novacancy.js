/**
* Novacancy jQuery plug-in
* Text Neon Golden effect
*
* @author Chuck Chang <eurt23@gmail.com>
* @version 0.1
* @license MIT http://opensource.org/licenses/MIT
* @date 07-24-2013
*/

(function($){

    $.fn.novacancy = function(options){
        var opts = $.extend({}, $.fn.novacancy.defaults, options);

        return novacancy(opts);
    };

	function rand(min,max) {
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	function blink(item) {
	    /* blink 1 time */
	    off(item);
	    setTimeout(function() {
	        on(item);
	        reblink(item);
	    }, rand(10,500) );
	}

	function reblink(item) {
        setTimeout(function() {
        	/* 1/3 chance to continue blink */
            if (rand(0,2)==0) {
                blink(item);      
            }
        }, rand(10,500) );
	}

	function on(item) {
	    item.removeClass('off').addClass('on');
	}

	function off(item) {
	    item.removeClass('on').addClass('off');
	}

	function novacancy(options) {
		$.each($('.novacancy'), function(index, value) {
		    var txts = $(this).text().split('');
		    var alt = '';
		    
		    $.each(txts, function(index, value) {
		        alt += ( '<span class="on">'+value+'</span>' );
		    });
		    
		    var that = $(this);
		    
		    that.html(alt);
		    
		    var len = that.find('span').length-1;
		    
		    function loop() {
		        var num = rand(0, len);
		        var item = that.find('span:eq('+num+')');
		        blink(item);
		        setTimeout(loop, rand(500,2000) );
		    }

		    loop();

		});

		return true;
	}

})(jQuery);
