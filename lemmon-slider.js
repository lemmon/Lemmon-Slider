/*
 * Lemmon Slider - jQuery Plugin
 * Simple and lightweight slider/carousel supporting variable elements/images widths.
 *
 * Examples and documentation at: http://jquery.lemmonjuice.com/plugins/slider-variable-widths.php
 *
 * Copyright (c) 2011 Jakub Pelák <jpelak@gmail.com>
 *
 * Version: 0.2 (9/6/2011)
 * Requires: jQuery v1.4+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function( $ ){

  var _css = {};

  var methods = {
    //
    // Initialzie plugin
    //
    init : function( options ){
      
      var options = $.extend( {}, $.fn.lemmonSlider.defaults, options );
      
      return this.each(function(){
        
        var $slider = $( this ),
            data = $slider.data( 'slider' );
        
        if ( ! data ) {
          
          var $sliderContainer = $slider.find( options.slider ),
              $sliderControls = $slider.next().filter( '.controls' ),
              $items = $sliderContainer.find( options.items ),
              originalWidth = 1,
              originalHeight = 1,
              horizontal = !options.vertical;

          if ( horizontal ) {
            $items.each(function(){ originalWidth += $( this ).outerWidth( true ) });
            $sliderContainer.width( originalWidth );
            // slide to last item
            if ( options.slideToLast ) $sliderContainer.css( 'padding-right', $slider.width() );
          } else {
            $items.each(function(){ originalHeight += $( this ).outerHeight( true ) });
            $sliderContainer.width( originalHeight );
            // slide to last item
            if ( options.slideToLast ) $sliderContainer.css( 'padding-bottom', $slider.height() );
          }

          // infinite carousel
          if ( options.infinite ){

            if ( horizontal) {
              originalWidth = originalWidth * 3;
              $sliderContainer.width( originalWidth );
            } else {
              originalHeight = originalHeight * 3;
              $sliderContainer.height( originalHeight );
            }
            
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

            var scroll,
                x = 0,
                y = 0,
                slide = 0;

            if ( horizontal) {
              scroll = $slider.scrollLeft();
              
              $items.each(function( i ){
                if ( x == 0 && $( this ).position().left > 1 ){
                  x = $( this ).position().left;
                  slide = i;
                }
              });

              if ( x > 0 && $sliderContainer.outerWidth() - scroll - $slider.width() > 0 ){
                slideTo( e, $slider, scroll + x, slide, 'fast' );
              } else if ( options.loop ){
                // return to first
                slideTo( e, $slider, 0, 0, 'slow' );
              }
            } else {
              scroll = $slider.scrollTop();
              
              $items.each(function( i ){
                if ( y == 0 && $( this ).position().top > 1 ){
                  y = $( this ).position().top;
                  slide = i;
                }
              });

              if ( y > 0 && $sliderContainer.outerHeight() - scroll - $slider.height() > 0 ){
                slideTo( e, $slider, scroll + y, slide, 'fast' );
              } else if ( options.loop ){
                // return to first
                slideTo( e, $slider, 0, 0, 'slow' );
              }
            }


          });
          $slider.bind( 'prevSlide', function( e, t ){

            var scroll,
                x = 0,
                y = 0,
                slide = 0;

            if ( horizontal) {

              scroll = $slider.scrollLeft();

              $items.each(function( i ){
                if ( $( this ).position().left < 0 ){
                  x = $( this ).position().left;
                  slide = i;
                }
              });

              if ( x ){
                slideTo( e, $slider, scroll + x, slide, 'fast' )
              } else if ( options.loop ){
                // return to last
                var a = $sliderContainer.outerWidth() - $slider.width();
                var b = $items.filter( ':last' ).position().left;
                slide = $items.size() - 1;
                if ( a > b ){
                  slideTo( e, $slider, b, slide, 'fast' );
                } else {
                  slideTo( e, $slider, a, slide, 'fast' );
                }
              }

            } else {

              scroll = $slider.scrollTop();

              $items.each(function( i ){
                if ( $( this ).position().top < 0 ){
                  y = $( this ).position().top;
                  slide = i;
                }
              });

              if ( y ){
                slideTo( e, $slider, scroll + y, slide, 'fast' )
              } else if ( options.loop ){
                // return to last
                var a = $sliderContainer.outerHeight() - $slider.height();
                var b = $items.filter( ':last' ).position().top;
                slide = $items.size() - 1;
                if ( a > b ){
                  slideTo( e, $slider, b, slide, 'fast' );
                } else {
                  slideTo( e, $slider, a, slide, 'fast' );
                }
              }

            }

          });
          $slider.bind( 'nextPage', function( e, t ){

            if ( horizontal) {

              var scroll = $slider.scrollLeft();
              var w = $slider.width();
              var x = 0;
              var slide = 0;

              $items.each(function( i ){
                if ( $( this ).position().left < w ){
                  x = $( this ).position().left;
                  slide = i;
                }
              });

              if ( x > 0 && scroll + w < originalWidth ){
                slideTo( e, $slider, scroll + x, slide, 'slow' );
              } else if ( options.loop ){
                // return to first
                slideTo( e, $slider, 0, 0, 'slow' );
              }

            } else {

              var scroll = $slider.scrollTop();
              var h = $slider.height();
              var y = 0;
              var slide = 0;

              $items.each(function( i ){
                if ( $( this ).position().top < h ){
                  y = $( this ).position().top;
                  slide = i;
                }
              });

              if ( y > 0 && scroll + h < originalHeight ){
                slideTo( e, $slider, scroll + y, slide, 'slow' );
              } else if ( options.loop ){
                // return to first
                slideTo( e, $slider, 0, 0, 'slow' );
              }

            }

          });
          $slider.bind( 'prevPage', function( e, t ){

            if ( horizontal) {

              var scroll = $slider.scrollLeft();
              var w = $slider.width();
              var x = 0;

              $items.each(function( i ){
                if ( $( this ).position().left < 1 - w ){
                  x = $( this ).next().position().left;
                  slide = i;
                }
              });

              if ( scroll ){
                if ( x == 0 ){
                  //$slider.animate({ 'scrollLeft' : 0 }, 'slow' );
                  slideTo( e, $slider, 0, 0, 'slow' );
                } else {
                  //$slider.animate({ 'scrollLeft' : scroll + x }, 'slow' );
                  slideTo( e, $slider, scroll + x, slide, 'slow' );
                }
              } else if ( options.loop ) {
                // return to last
                var a = $sliderContainer.outerWidth() - $slider.width();
                var b = $items.filter( ':last' ).position().left;
                if ( a > b ){
                  $slider.animate({ 'scrollLeft' : b }, 'slow' );
                } else {
                  $slider.animate({ 'scrollLeft' : a }, 'slow' );
                }
              }

            } else {

              var scroll = $slider.scrollTop();
              var h = $slider.height();
              var y = 0;

              $items.each(function( i ){
                if ( $( this ).position().top < 1 - h ){
                  y = $( this ).next().position().top;
                  slide = i;
                }
              });

              if ( scroll ){
                if ( y == 0 ){
                  //$slider.animate({ 'scrollLeft' : 0 }, 'slow' );
                  slideTo( e, $slider, 0, 0, 'slow' );
                } else {
                  //$slider.animate({ 'scrollLeft' : scroll + x }, 'slow' );
                  slideTo( e, $slider, scroll + y, slide, 'slow' );
                }
              } else if ( options.loop ) {
                // return to last
                var a = $sliderContainer.outerHeight() - $slider.height();
                var b = $items.filter( ':last' ).position().top;
                if ( a > b ){
                  $slider.animate({ 'scrollLeft' : b }, 'slow' );
                } else {
                  $slider.animate({ 'scrollLeft' : a }, 'slow' );
                }
              }

            }

          });
          $slider.bind( 'slideTo', function( e, i, t ){

            slideTo(
              e, $slider,
              $slider.scrollLeft() + $items.filter( ':eq(' + i +')' ).position().left,
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

          //if ( typeof $slider.options.create == 'function' ) $slider.options.create();
          
          $slider.data( 'slider', {
            'target'  : $slider,
            'options' : options
          })

        }

      });
      
    },
    //
    // Destroy plugin
    //
    destroy : function(){
      
      return this.each(function(){
        
        var $slider = $( this ),
            $sliderControls = $slider.next().filter( '.controls' ),
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
    //
    //
    //
  }
  //
  // Private functions
  //
  function slideTo( e, $slider, xy, i, t ){
    
    var horizontal = ! $slider.data('slider')['options']['vertical'];
    
    $slider.items.filter( 'li:eq(' + i + ')' ).addClass( 'active' ).siblings( '.active' ).removeClass( 'active' );
    
    if ( typeof t == 'undefined' ){
      t = 'fast';
    }

    if ( horizontal ) {
      if ( t ){
        $slider.animate({ 'scrollLeft' : xy }, t, function(){
          checkInfinite( $slider );
        });
      } else {
        var time = 0;
        $slider.scrollLeft( xy );
        checkInfinite( $slider );
      }
    } else {
      if ( t ){
        $slider.animate({ 'scrollTop' : xy }, t, function(){
          checkInfinite( $slider );
        });
      } else {
        var time = 0;
        $slider.scrollTop( xy );
        checkInfinite( $slider );
      }
    } 
    
    //if ( typeof $slider.options.slide == 'function' ) $slider.options.slide( e, i, time );
    
  }
  function checkInfinite( $slider ){
    
    var horizontal = ! $slider.data('slider')['options']['vertical'];
    
    var $active = $slider.items.filter( '.active' );
    if ( $active.hasClass( '-before' ) ){

      var i = $active.prevAll().size();
      $active.removeClass( 'active' );
      $active = $slider.items.filter( ':not(.-before):eq(' + i + ')' ).addClass( 'active' );
      if ( horizontal ) {
        $slider.scrollLeft( $slider.scrollLeft() + $active.position().left );
      } else {
        $slider.scrollTop( $slider.scrollTop() + $active.position().top );
      }

    } else if ( $active.hasClass( '-after' ) ){

      var i = $active.prevAll( '.-after' ).size();
      $active.removeClass( 'active' );
      $active = $slider.items.filter( ':not(.-before):eq(' + i + ')' ).addClass( 'active' );
      if ( horizontal ) {
        $slider.scrollLeft( $slider.scrollLeft() + $active.position().left );
      } else {
        $slider.scrollTop( $slider.scrollTop() + $active.position().top );
      }
      
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
    // since 0.3
    'vertical'    : false
    
  }

})( jQuery );
