/* -*- coding: utf-8 -*-
* ----------------------------------------------------------------------------
* Copyright (c) 2015 - Chris Kirby
*
* Distributed under the terms of the MIT License.
*
* An IPython notebook extension to hide code inputs and prompts for presentation.
* -----------------------------------------------------------------------------
*/

define([
'jquery',
'notebook/js/celltoolbar',
'base/js/namespace'
], 
function ($, celltoolbar, Jupyter){
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

	/*
	* Sets notebook cell's hide code metadata.
	* @param {Notebook Cell} cell
	* @param {Boolean} value
	*/
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

	function hideOutputSetter(cell, value){
		if (cell.metadata.hideOutput == undefined){ cell.metadata.hideOutput = false }
        cell.metadata.hideOutput = value;
   		toggleHideOutput(cell);
	}

	function hideOutputGetter(cell){
		var isHidden = cell.metadata.hideOutput;
		toggleHideOutput(cell);
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

	function toggleHideOutput(cell){
		var c = $(cell.element);
		if (cell.metadata.hideOutput && cell.class_config.classname != 'MarkdownCell'){
			c.find('.output_wrapper .output_subarea').css('display','none');
		} else if(cell.class_config.classname != 'MarkdownCell') {
			c.find('.output_wrapper .output_subarea').css('display','block'); 
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
		     'callback' : function() { // toggling visibility is adding display: block to the element. Causing celltoolbar = None not work.
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
		    },
		    {
		    	'label' : 'Export to HTML',
		    	'icon' : 'fa-file-text-o',
		    	'callback' : function (){
		    		window.location = window.location.origin + window.location.pathname + "/export/html";
		    		Jupyter.notebook.kernel.reconnect();
		    	}
		    },
		    {
		    	'label' : 'Export to PDF via HTML',
		    	'icon' : 'fa-file-pdf-o',
		    	'callback' : function (){
		    		window.location = window.location.origin + window.location.pathname + "/export/pdf";
		    		Jupyter.notebook.kernel.reconnect();
		    	}
		    },
		    {
		    	'label' : 'Export to PDF via Latex',
		    	'icon' : 'fa-file-o',
		    	'callback' : function (){
		    		window.location = window.location.origin + window.location.pathname + "/export/latexpdf";
		    		Jupyter.notebook.kernel.reconnect();
		    	}
		    }
		  ]);
	}

	var hideCodeCallback = ctb.utils.checkbox_ui_generator(	'Hide Code ', hideCodeSetter, hideCodeGetter);

	var hidePromptCallback = ctb.utils.checkbox_ui_generator('Hide Prompts ', hidePromptSetter,	hidePromptGetter);

	var hideOutputCallback = ctb.utils.checkbox_ui_generator('Hide Outputs ', hideOutputSetter,	hideOutputGetter);

	var hideCodeKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Hides selected cell\'s code',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		var cells = env.notebook.get_selected_cells();
    		$.each(cells, function(index, value){
    			hideCodeSetter(cells[index], true);
    			try{
    				$($(Jupyter.notebook.get_selected_cell().celltoolbar.inner_element[0]).find('input')[1]).prop('checked', true);
    			} catch(err){
    				//do nothing
    			}
    		});
    	},
    }, 'hide_code_action','hide_code');

	/**
	* Keyboard short cut action to hide selected cells.
	* Binds to W
	**/
	var showCodeKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Shows selected cell\'s code',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		var cells = env.notebook.get_selected_cells();
    		$.each(cells, function(index, value){
    			hideCodeSetter(cells[index], false);
    			try{
    				$($(Jupyter.notebook.get_selected_cell().celltoolbar.inner_element[0]).find('input')[1]).prop('checked', false);
    			} catch(err){
    				//do nothing
    			}
    		});
    	},
    }, 'show_code_action','hide_code');

    var hidePromptKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Hides selected cell\'s prompts.',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		var cells = env.notebook.get_selected_cells();
    		$.each(cells, function(index, value){
    			hidePromptSetter(cells[index], true);try{
    				$($(Jupyter.notebook.get_selected_cell().celltoolbar.inner_element[0]).find('input')[0]).prop('checked', true);
    			} catch(err){
    				//do nothing
    			}
    		});
    	},
    }, 'hide_prompt_action','hide_code');

	/**
	* Keyboard short cut action to hide selected cells.
	* Binds to W,W
	**/
	var showPromptKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Shows selected cell\'s prompts.',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		var cells = env.notebook.get_selected_cells();
    		$.each(cells, function(index, value){
    			hidePromptSetter(cells[index], false);
    			try{
    				$($(Jupyter.notebook.get_selected_cell().celltoolbar.inner_element[0]).find('input')[0]).prop('checked', false)
    			} catch(err){
    				//do nothing
    			};
    		});
    	},
    }, 'show_prompt_action','hide_code');

    var hideOutputKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Hides selected cell\'s prompts.',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		var cells = env.notebook.get_selected_cells();
    		$.each(cells, function(index, value){
    			hideOutputSetter(cells[index], true);
    			try{
    				$($(Jupyter.notebook.get_selected_cell().celltoolbar.inner_element[0]).find('input')[2]).prop('checked', true);
    			} catch(err){
    				//do nothing
    			}
    		});
    	},
    }, 'hide_output_action','hide_code');

	/**
	* Keyboard short cut action to hide selected cells.
	* Binds to W,W
	**/
	var showOutputKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Shows selected cell\'s prompts.',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		var cells = env.notebook.get_selected_cells();
    		$.each(cells, function(index, value){
    			hideOutputSetter(cells[index], false);
    			try{
    				$($(Jupyter.notebook.get_selected_cell().celltoolbar.inner_element[0]).find('input')[2]).prop('checked', false);
    			} catch(err){
    				//do nothing
    			}
    		});
    	},
    }, 'show_output_action','hide_code');

    function addKeyboardShortcutBindings(){
    	Jupyter.keyboard_manager.command_shortcuts.add_shortcut('e', 'hide_code:hide_code_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('shift-e', 'hide_code:show_code_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('w', 'hide_code:hide_prompt_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('shift-w', 'hide_code:show_prompt_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('r', 'hide_code:hide_output_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('shift-r', 'hide_code:show_output_action', 'hide_code');
    }

	function setup(){
		ctb.register_callback('hide_code.hideCode', hideCodeCallback);
        ctb.register_callback('hide_code.hidePrompts', hidePromptCallback);
        ctb.register_callback('hide_code.hideOutputs', hideOutputCallback);
        ctb.register_preset('Hide code',['hide_code.hidePrompts','hide_code.hideCode','hide_code.hideOutputs']);
        addHideCodeButtonToToolbar();
        addKeyboardShortcutBindings();

        $.each(Jupyter.notebook.get_cells(), function(index, cell){
        	toggleHidePrompt(cell);
        	toggleHideCode(cell);
        	toggleHideOutput(cell);
        });
	}
	
	setup();
	console.log('hide_code setup complete');
});
