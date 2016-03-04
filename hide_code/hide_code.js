/* -*- coding: utf-8 -*-
* ----------------------------------------------------------------------------
* Copyright (c) 2015 - Chris Kirby
*
* Distributed under the terms of the Modified BSD License.
*
* An IPython notebook extension to hide code inputs and prompts for presentation.
* -----------------------------------------------------------------------------
*/

define([
'jquery',
'notebook/js/celltoolbar'
], 
function ($, celltoolbar){
	"use strict";

	var ctb = celltoolbar.CellToolbar;

	function hideCodeSetter(cell, value){
		if (cell.metadata.hideCode == undefined){ cell.metadata.hideCode = false }
        cell.metadata.hideCode = value;
   		toggleHideCode(cell);
	}

	function hideCodeGetter(cell){
		var isHidden = cell.metadata.hideCode;
		toggleHideCode(cell);
		return (isHidden == undefined) ? undefined : isHidden
	}

	function hidePromptSetter(cell, value){
		if (cell.metadata.hidePrompt == undefined){ cell.metadata.hidePrompt = false }
        cell.metadata.hidePrompt = value;
   		toggleHidePrompt(cell);
	}

	function hidePromptGetter(cell){
		var isHidden = cell.metadata.hidePrompt;
		toggleHidePrompt(cell);
		return (isHidden == undefined) ? undefined : isHidden
	}

	function toggleHideCode(cell){
		var c = $(cell.element);
		if (cell.metadata.hideCode && cell.class_config.classname != 'MarkdownCell'){
			c.find('.input_area').hide(); 
		} else if(cell.class_config.classname != 'MarkdownCell') {
			c.find('.input_area').show(); 
		}
	}

	function toggleHidePrompt(cell){
		var c = $(cell.element);
		if (cell.metadata.hidePrompt && cell.class_config.classname != 'MarkdownCell'){
			c.find('.prompt').css('visibility','hidden');
		} else if(cell.class_config.classname != 'MarkdownCell') {
			c.find('.prompt').css('visibility','visible'); 
		}
	}

	/**
	* Add a toolbar button to toggle visibility of all code cells, input/output prompts, and remove any highlighting for the selected cell.
	**/
	function addHideCodeButtonToToolbar(){
		IPython.toolbar.add_buttons_group([
		    {
		     'label' : 'Hide/show code',
		     'icon' : 'fa-code',
		     'callback' : function() { // toggling visibility is adding display: blcok to the element. Causing celltoolbar = None not work.
		        $('.input').toggle(); 
		        $('.prompt').toggle(); 
		        var ctb = $('.ctb_hideshow');
		        if(ctb.hasClass('ctb_show')) {
		        	ctb.removeClass('ctb_show');
		        } else {
		        	ctb.addClass('ctb_show');
		        }

		        var ctb = $('.celltoolbar');
		        if(ctb.hasClass('invisible')){
		        	console.log('visible');
		        	ctb.removeClass('invisible');
		        } else {
		        	console.log('invisible');
		        	ctb.addClass('invisible');
		        }
		        // $('.celltoolbar').toggle();
		        $('.selected').removeClass('selected').addClass('unselected');
		      } 
		    }
		  ]);
	}

	var hideCodeCallback = ctb.utils.checkbox_ui_generator(	'Hide Code ', hideCodeSetter, hideCodeGetter);

	var hidePromptCallback = ctb.utils.checkbox_ui_generator('Hide Prompts ', hidePromptSetter,	hidePromptGetter);

	function setup(){
		ctb.register_callback('hide_code.hideCode', hideCodeCallback);
        ctb.register_callback('hide_code.hidePrompts', hidePromptCallback);
        ctb.register_preset('Hide code',['hide_code.hidePrompts','hide_code.hideCode']);
        addHideCodeButtonToToolbar();
	}
	
	setup();
	console.log('hide_code setup complete');
});