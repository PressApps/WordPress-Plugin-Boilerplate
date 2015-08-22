(function( $ ) {
	'use strict';

var PA_FULLSCREEN_LOGIN = {
    common: {
        init: function(){

        	var overlay 	= document.querySelector( 'div.pafl-overlay' ),
				triggerBttn = $( '#pafl-trigger-overlay, a[title=pafl-trigger-overlay]' ),
        		closeBttn 	= $( 'button.pafl-overlay-close' );
		
			triggerBttn.on( 'click', function(){
				PA_FULLSCREEN_LOGIN.common.show_screen( $(this) );
				PA_FULLSCREEN_LOGIN.common.toggleOverlay( overlay );
				return false;
			});

			closeBttn.on( 'click', function(){ 
				PA_FULLSCREEN_LOGIN.common.toggleOverlay( overlay );
				return false; 
			});

			$(".pafl-modal-content .form-links a.create-account").click(function(){
				PA_FULLSCREEN_LOGIN.common.show_screen( $(this) );
				return false; 
			});

			$(".pafl-modal-content .form-links a.forgot-password").click(function(){
				PA_FULLSCREEN_LOGIN.common.show_screen( $(this) );
				return false; 
			});

			$(".pafl-modal-content .form-links a.btn-login").click(function(){
				PA_FULLSCREEN_LOGIN.common.show_screen( $(this) );
				return false; 
			});

			// Run our login ajax
			$('.pafl-modal-content #form').on('submit', function(e) {

				// Stop the form from submitting so we can use ajax.
				e.preventDefault();

				// Check what form is currently being submitted so we can return the right values for the ajax request.
				var form_id = $(this).parent().attr('id');

				// Remove any messages that currently exist.
				$('.modal-login-content > p.message').remove();

				// Check if we are trying to login. If so, process all the needed form fields and return a faild or success message.
				if ( form_id === 'login' ) {
					$.ajax({
						type: 'GET',
						dataType: 'json',
						url: pafl_modal_login_script.ajax,
						data: {
							'action'     : 'ajaxlogin', // Calls our wp_ajax_nopriv_ajaxlogin
							'username'   : $('#form #login_user').val(),
							'password'   : $('#form #login_pass').val(),
							'rememberme' : ($('#form #rememberme').is(':checked'))?"TRUE":"FALSE",
							'login'      : $('#form input[name="login"]').val(),
							'security'   : $('#form #security').val()
						},
						success: function(results) {

							// Check the returned data message. If we logged in successfully, then let our users know and remove the modal window.
							if(results.loggedin === true) {
								$('.modal-login-content > h2').after('<p class="message success"></p>');
								$('.modal-login-content > p.message').text(results.message).show();

								$('#overlay, .login-popup').delay(5000).fadeOut('300m', function() {
									$('#overlay').remove();
								});
								window.location.href = updateQueryStringParameter( pafl_modal_login_script.redirecturl, 'nocache', ( new Date() ).getTime() );
							} else {
								$('.modal-login-content > h2').after('<p class="message error"></p>');
								$('.modal-login-content > p.message').text(results.message).show();
							}
						}
					});
				} else if ( form_id === 'register' ) {
					$.ajax({
						type: 'GET',
						dataType: 'json',
						url: pafl_modal_login_script.ajax,
						data: {
							'action'   : 'ajaxlogin', // Calls our wp_ajax_nopriv_ajaxlogin
							'username' : $('#form #reg_user').val(),
							'email'    : $('#form #reg_email').val(),
							'register' : $('#form input[name="register"]').val(),
							'security' : $('#form #security').val(),
							'password' : $('#form #reg_password').val(),
						},
						success: function(results) {
							if(results.registerd === true) {
								$('.modal-login-content > h2').after('<p class="message success"></p>');
								$('.modal-login-content > p.message').text(results.message).show();
								$('#register #form input:not(#user-submit)').val('');
								if(results.redirect === true) {
									$('#overlay, .login-popup').delay(5000).fadeOut('300m', function() {
										$('#overlay').remove();
									});
									window.location.href = updateQueryStringParameter( pafl_modal_login_script.redirecturl, 'nocache', ( new Date() ).getTime() );
								}
							} else {
								$('.modal-login-content > h2').after('<p class="message error"></p>');
								$('.modal-login-content > p.message').text(results.message).show();
							}
						},
						error: function(e){
							console.log(e);
						}
					});
				} else if ( form_id === 'forgotten' ) {
					$.ajax({
						type: 'GET',
						dataType: 'json',
						url: pafl_modal_login_script.ajax,
						data: {
							'action'    : 'ajaxlogin', // Calls our wp_ajax_nopriv_ajaxlogin
							'username'  : $('#form #forgot_login').val(),
							'forgotten' : $('#form input[name="forgotten"]').val(),
							'security'  : $('#form #security').val()
						},
						success: function(results) {
							if(results.reset === true) {
								$('.modal-login-content > h2').after('<p class="message success"></p>');
								$('.modal-login-content > p.message').text(results.message).show();
								$('#forgotten #form input:not(#user-submit)').val('');
							} else {
								$('.modal-login-content > h2').after('<p class="message error"></p>');
								$('.modal-login-content > p.message').text(results.message).show();
							}
						},
						error: function(e){
							console.log(e);
						}
					});
				} else {
					// if all else fails and we've hit here... something strange happen and notify the user.
					$('.modal-login-content > h2').after('<p class="message error"></p>');
					$('.modal-login-content > p.message').text('Something  Please refresh your window and try again.');
				}
			});

        },
        show_screen: function( me ){
        	var get_screen; 
        	if( typeof me.data("form") !== 'undefined' ){
        		get_screen = me.data("form")
        	}else if( typeof me.attr('href') !== 'undefined' ){
        		get_screen = me.attr('href')
        	}
        	$("div.pafl-overlay div[class*=pafl-modal-content]").hide();

        	if( get_screen == 'login' || get_screen == '#pafl_modal_login' ){
        		$("div.pafl-overlay div#login").show();
        	}else if( get_screen == 'register' || get_screen == '#pafl_modal_register' ){
        		$("div.pafl-overlay div#register").show();
        	}else if( get_screen == 'forgot' || get_screen == '#pafl_modal_forgot' ){
        		$("div.pafl-overlay div#forgotten").show();
        	}

        },
        toggleOverlay: function( overlay ) {
        		
        		var container = document.querySelector( 'body.pafl-container' );
				
				var transEndEventNames = {
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'msTransition': 'MSTransitionEnd',
					'transition': 'transitionend'
				};

				var transEndEventName;

				if( typeof  Modernizr.prefixed !== 'undefined' ){
				 	transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ];
				}else{
					transEndEventName = transEndEventNames[  'transition'  ];
				}
				
				var support = { transitions : Modernizr.csstransitions };

				if( classie.has( overlay, 'open' ) ) {
					classie.remove( overlay, 'open' );
					classie.add( overlay, 'close' );
					if( container != null){
						classie.remove( container, 'pafl-overlay-open' );
					}

					var onEndTransitionFn = function( ev ) {
						if( support.transitions ) {
							if( ev.propertyName !== 'visibility' ) return;
							this.removeEventListener( transEndEventName, onEndTransitionFn );
						}
						classie.remove( overlay, 'close' );
					};
					if( support.transitions ) {
						overlay.addEventListener( transEndEventName, onEndTransitionFn );
					}
					else {
						onEndTransitionFn();
					}
				}
				else if( !classie.has( overlay, 'close' ) ) {
					classie.add( overlay, 'open' );
					if( container != null ){
						classie.add( container, 'pafl-overlay-open' );
					}
				}
		}
    }
}

// The routing fires all common scripts, followed by the page specific scripts.
// Add additional events for more control over timing e.g. a finalize event
var UTIL = {
  fire: function(func, funcname, args) {
    var namespace = PA_FULLSCREEN_LOGIN;
    funcname = (funcname === undefined) ? 'init' : funcname;
    if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
      namespace[func][funcname](args);
    }
  },
  loadEvents: function() {
    UTIL.fire('common');

    $.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
      UTIL.fire(classnm);
    });
  }
};
	
// Shuffle Array
$.fn.shuffle = function() {
    return this.each(function(){
        var items = $(this).children().clone(true);
        return (items.length) ? $(this).html($.shuffle(items)) : this;
    });
}
 
$.shuffle = function(arr) {
    for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
}

$(document).ready(UTIL.loadEvents);

})( jQuery );