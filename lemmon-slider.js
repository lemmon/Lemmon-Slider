/*
 * Lemmon Slider - jQuery Plugin
 * Simple and lightweight slider/carousel supporting variable elements/images dimensions.
 *
 * Examples and documentation at: http://jquery.lemmonjuice.com/plugins/slider-variable-widths.php
 *
 * Copyright (c) 2011 Jakub Pel‡k <jpelak@gmail.com>
 *
 * Version: 0.2.1 (1/8/2012)
 * Requires: jQuery v1.4+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Modified By: William O'Dell <william.s.odell@gmail.com>
 */
(function( $ ){
	function Func(obj, method, parameters) {
		return obj[method].apply(obj, parameters);
	}

	function Prop(obj, property, value) {
		if (value == undefined) {
			return obj[property];
		} else {
			return obj[property] = value;
		}
	}

	var _css = {};

	var methods = {
		//
		// Initialzie plugin
		//
		init : function( options ){
			options = $.extend( {}, $.fn.lemmonSlider.defaults, options );
			
			return this.each(function(){
				
				var $slider = $( this ),
					data = $slider.data( 'slider' );
				
				if ( ! data ){
					var $sliderContainer = $slider.find( options.slider ),
						$sliderControls = $( options.controls ),
						$items = $sliderContainer.find( options.items ),
						originalDimension = 1;

					var dimensionData = {
						outer: "outerWidth",
						dimension: "width",
						position: "left",
						padding: "padding-right",
						scroll: "scrollLeft"
					};
					
					if (options.vertical) {
						dimensionData = {
							outer: "outerHeight",
							dimension: "height",
							position: "top",
							padding: "padding-bottom",
							scroll: "scrollTop"
						};
					}

					$items.each(function(){
						originalDimension += Func($( this ), dimensionData['outer'], [true]);
					});

					Func($sliderContainer, dimensionData['dimension'], [originalDimension]);

					// slide to last item
					if ( options.slideToLast ) $sliderContainer.css( dimensionData['padding'], Func($slider, dimensionData['dimension']) );

					// infinite carousel
					if ( options.infinite ){
						originalDimension = originalDimension * 3;
						
						Func($sliderContainer, dimensionData['dimension'], [originalDimension]);

						$items.clone().addClass( '-after' ).insertAfter( $items.filter(':last') );
						$items.filter( ':first' ).before( $items.clone().addClass('-before') );

						$items = $sliderContainer.find( options.items );
					}
					
					$slider.items = $items;
					$slider.options = options;
					
					// first item
					//$items.filter( ':first' ).addClass( 'active' );

					// attach events
					$slider.bind( 'nextSlide', function( e, t ){
						var scroll = Func($slider, dimensionData['scroll']);
						var loc = 0;
						var slide = 0;

						$items.each(function( i ){
							if ( loc == 0 && Prop($( this ).position(), dimensionData['position']) > 1 ){
								loc = Prop($( this ).position(), dimensionData['position']);
								slide = i;
							}
						});

						if ( loc > 0 && Func($sliderContainer, dimensionData['outer']) - scroll - Func($slider, dimensionData['dimension']) > 0 ){
							slideTo( e, $slider, scroll + loc, slide, 'fast' );
						} else if ( options.loop ){
							// return to first
							slideTo( e, $slider, 0, 0, 'slow' );
						}
					});

					$slider.bind( 'prevSlide', function( e, t ){
						var scroll = Func($slider, dimensionData['scroll']);
						var loc = 0;
						var slide = 0;

						$items.each(function( i ){
							if ( Prop($( this ).position(), dimensionData['position']) < 0 ){
								loc = Prop($( this ).position(), dimensionData['position']);
								slide = i;
							}
						});

						if ( loc ){
							slideTo( e, $slider, scroll + loc, slide, 'fast' )
						} else if ( options.loop ){
							// return to last
							var a = Func($sliderContainer, dimensionData['outer']) - Func($slider, dimensionData['dimension']);
							var b = Prop($items.filter( ':last' ).position(), dimensionData['position']);
							slide = $items.size() - 1;
							if ( a > b ){
								slideTo( e, $slider, b, slide, 'fast' );
							} else {
								slideTo( e, $slider, a, slide, 'fast' );
							}
						}
					});

					$slider.bind( 'nextPage', function( e, t ){

						var scroll = Func($slider, dimensionData['scroll']);
						var dimension = Func($slider, dimensionData['dimension']);
						var loc = 0;
						var slide = 0;

						$items.each(function( i ){
							if ( Prop($( this ).position(), dimensionData['position']) < dimension ){
								loc = Prop($( this ).position(), dimensionData['position']);
								slide = i;
							}
						});

						if ( loc > 0 && scroll + dimension < originalDimension ){
							slideTo( e, $slider, scroll + loc, slide, 'slow' );
						} else if ( options.loop ){
							// return to first
							slideTo( e, $slider, 0, 0, 'slow' );
						}
					});
					
					$slider.bind( 'prevPage', function( e, t ){
						var scroll = Func($slider, dimensionData['scroll']);
						var dimension = Func($slider, dimensionData['dimension']);
						var loc = 0;

						$items.each(function( i ){
							if ( Prop($( this ).position(), dimensionData['position']) < 1 - dimension ){
								loc = Prop($( this ).next().position(), dimensionData['position']);
								slide = i;
							}
						});

						if ( scroll ){
							if ( loc == 0 ){
								//$slider.animate({ 'scrollLeft' : 0 }, 'slow' );
								slideTo( e, $slider, 0, 0, 'slow' );
							} else {
								//$slider.animate({ 'scrollLeft' : scroll + loc }, 'slow' );
								slideTo( e, $slider, scroll + loc, slide, 'slow' );
							}
						} else if ( options.loop ) {
							// return to last
							var a = Func($sliderContainer, dimensionData['outer']) - Func($slider, dimensionData['dimension']);
							var b = Prop($items.filter( ':last' ).position(), dimensionData['position']);

							var animConfig = {};

							if ( a > b ){
								animConfig[dimensionData['scroll']] = b;
							} else {
								animConfig[dimensionData['scroll']] = a;
							}
							$slider.animate(animConfig, 'slow');
						}
					});

					$slider.bind( 'slideTo', function( e, i, t ){
						slideTo(
							e, $slider,
							Func($slider, dimensionData['scroll']) + Prop($items.filter( 'li:eq(' + i +')' ).position(), dimensionData['position']),
							i, t );
					});

					// controls
					$sliderControls.find( '.next-slide' ).click(function(){
						$slider.trigger( 'nextSlide' );
						return false;
					});

					$sliderControls.find( '.prev-slide' ).click(function(){
						$slider.trigger( 'prevSlide' );
						return false;
					});

					$sliderControls.find( '.next-page' ).click(function(){
						$slider.trigger( 'nextPage' );
						return false;
					});
					
					$sliderControls.find( '.prev-page' ).click(function(){
						$slider.trigger( 'prevPage' );
						return false;
					});

					$slider.data( 'slider', {
						'target'  : $slider,
						'options' : options,
						'dimensionData' : dimensionData
					});
				}
			});
		},
		//
		// Destroy plugin
		//
		destroy : function(){
			return this.each(function(){
				var $slider = $( this ),
				$sliderControls = $( options.controls ),
				data = $slider.data( 'slider' );
				
				$slider.unbind( 'nextSlide' );
				$slider.unbind( 'prevSlide' );
				$slider.unbind( 'nextPage' );
				$slider.unbind( 'prevPage' );
				$slider.unbind( 'slideTo' );
				
				$sliderControls.find( '.next-slide' ).unbind( 'click' );
				$sliderControls.find( '.prev-slide' ).unbind( 'click' );
				$sliderControls.find( '.next-page' ).unbind( 'click' );
				$sliderControls.find( '.next-page' ).unbind( 'click' );
				
				$slider.removeData( 'slider' );
			});
		}
	}
	//
	// Private functions
	//
	function slideTo( e, $slider, loc, i, t ){
		var data = $slider.data( 'slider' );
		
		$slider.items.filter( 'li:eq(' + i + ')' ).addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
		
		if ( typeof t == 'undefined' ){
			t = 'fast';
		}
		if ( t ){
			var animConfig = {};

			animConfig[data['dimensionData']['scroll']] = loc;

			$slider.animate(animConfig, t, function(){
				checkInfinite( $slider );
			});
		} else {
			Func($slider, data['dimensionData']['scroll'],[loc]);
			checkInfinite( $slider );
		}
	}
	function checkInfinite( $slider ){
		var data = $slider.data( 'slider' ), i;
		
		var $active = $slider.items.filter( '.active' );
		if ( $active.hasClass( '-before' ) ){

			i = $active.prevAll().size();
			$active.removeClass( 'active' );
			$active = $slider.items.filter( ':not(.-before):eq(' + i + ')' ).addClass( 'active' );
			Func($slider, data['dimensionData']['scroll'], [Func($slider, data['dimensionData']['scroll']) + Prop($active.position(), data['dimensionData']['position'])] );

		} else if ( $active.hasClass( '-after' ) ){

			i = $active.prevAll( '.-after' ).size();
			$active.removeClass( 'active' );
			$active = $slider.items.filter( ':not(.-before):eq(' + i + ')' ).addClass( 'active' );
			Func($slider, data['dimensionData']['scroll'], [Func($slider, data['dimensionData']['scroll']) + Prop($active.position(), data['dimensionData']['position'])] );
			
		}
		
	}
	//
	// Debug
	//
	function debug( text ){
		$( '#debug span' ).text( text );
	}
	//
	//
	//
	$.fn.lemmonSlider = function( method ){  

		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || !method ){
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.lemmonSlider' );
		}

	};
	//
	//
	//
	$.fn.lemmonSlider.defaults = {
		
		'items'       : '> *',
		'loop'        : true,
		'slideToLast' : false,
		'slider'      : '> *:first',
		// since 0.2
		'infinite'    : false,
		'controls' : '.controls',
		'vertical' : false
	}
})( jQuery );
