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
            loop: true,
            center: true,
            autoplay: 1000,
            activeClass: 'active'
        }, o);
        return this.each(function(){
            var $slider = $(this),
                $slides = $slider.children();
            if (!$slider.data('lemmon-slider')) {
                $slides.first().addClass(o.activeClass);
                $slider.css({position: 'relative'});
                $slides.css({position: 'relative'}).css(o.direction, 0);
                $slides.each(function(i){
                    var $this = $(this);
                    $this.on('slide.slider', function(){
                        $slides.css(o.direction, $slides.first().position().left - $this.position().left);
                        $this.addClass(o.activeClass).siblings().removeClass(o.activeClass);
                    });
                })
                // next slide
                $slider.on('next.slider', function(){
                    var $slide = $slides.filter('.active').next();
                    if (0 == $slide.length) $slide = o.loop ? $slides.first() : $slides.last();
                    $slide.trigger('slide.slider');
                });
                // prev slide
                $slider.on('prev.slider', function(){
                    var $slide = $slides.filter('.active').prev();
                    if (0 == $slide.length) $slide = o.loop ? $slides.last() : $slides.first();
                    $slide.trigger('slide.slider');
                });
                $slider.data('lemmon-slider', this);
            }
        });
    };
}(jQuery));
