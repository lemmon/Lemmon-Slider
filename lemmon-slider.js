/*
 * Lemmon Slider - jQuery Plugin
 * Simple and lightweight slider/carousel supporting variable elements/images widths.
 *
 * Examples and documentation at: http://www.lemmonjuice.com/slider
 *
 * Copyright (c) 2011 Jakub Pelák <jpelak@gmail.com>
 *
 * Version: 0.5-alpha1 (4/8/2015)
 * Requires: jQuery v1.4+
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($){
    $.fn.lemmonSlider = function(o){
        o = $.extend({}, {
            // defaults
            direction: 'left',
            activeClass: 'active'
        }, o);
        return this.each(function(){
            var $slider = $(this),
                $sliderContainer = $slider.find('.container'),
                $slides = $sliderContainer.children(),
                $sliderControls = $slider.find('.controls');
            if (!$slider.data('lemmon-slider')) {
                $slides.first().addClass(o.activeClass);
                $sliderContainer.css(o.direction, 0);
                // next slide
                $slider.on('next.slider', function(){
                    var $n = $slides.filter('.active').removeClass('active').next().addClass('active');
                    if (0 == $n.length) {
                        $n = $slides.first().addClass('active');
                    }
                    $sliderContainer.css(o.direction, 0 - $n.position().left);
                });
                // prev slide
                $slider.on('prev.slider', function(){
                    var $n = $slides.filter('.active').removeClass('active').prev().addClass('active');
                    if (0 == $n.length) {
                        $n = $slides.last().addClass('active');
                    }
                    $sliderContainer.css(o.direction, 0 - $n.position().left);
                });
            }
        });
    };
}(jQuery));
