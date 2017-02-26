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
	const CODE = 1;
	const PROMPT = 0;
	const OUTPUT = 2;

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

	function toggleAllPromptsAndCode(){
		var all_hidden = Jupyter.notebook.metadata.hide_code_all_hidden;

        if ( all_hidden == undefined ) { 
        	all_hidden = false; 
        };
    	if ( all_hidden == false ) {
        	Jupyter.notebook.metadata.hide_code_all_hidden = true;
        	hideEach(CODE, Jupyter.notebook.get_cells(), true);
        	hideEach(PROMPT, Jupyter.notebook.get_cells(), true);
        } else {
        	Jupyter.notebook.metadata.hide_code_all_hidden = false;
        	hideEach(CODE, Jupyter.notebook.get_cells(), false);
        	hideEach(PROMPT, Jupyter.notebook.get_cells(), false);

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
		     'callback' : toggleAllPromptsAndCode
		    },
		    {
		    	'label' : 'Export to HTML',
		    	'icon' : 'fa-file-text-o',
		    	'callback' : function (){
		    		window.location = exportLink("html");
		    		Jupyter.notebook.kernel.reconnect();
		    	}
		    },
		    {
		    	'label' : 'Export to PDF via HTML',
		    	'icon' : 'fa-file-pdf-o',
		    	'callback' : function (){
		    		window.location = exportLink("pdf");
		    		Jupyter.notebook.kernel.reconnect();
		    	}
		    },
		    {
		    	'label' : 'Export to PDF via Latex',
		    	'icon' : 'fa-file-o',
		    	'callback' : function (){
		    		window.location = exportLink("latexpdf");
		    		Jupyter.notebook.kernel.reconnect();
		    	}
		    }
		  ]);
	}

	function exportLink(path){
		return window.location.origin + window.location.pathname + "/export/" + path;
	}

	var hideCodeCallback = ctb.utils.checkbox_ui_generator(	'Hide Code ', hideCodeSetter, hideCodeGetter);

	var hidePromptCallback = ctb.utils.checkbox_ui_generator('Hide Prompts ', hidePromptSetter,	hidePromptGetter);

	var hideOutputCallback = ctb.utils.checkbox_ui_generator('Hide Outputs ', hideOutputSetter,	hideOutputGetter);

	function hideEach(type, cells, hidden){
		$.each(cells, function(index, value){
			switch(type){
				case PROMPT:
					hidePromptSetter(cells[index], hidden);
					break;
				case CODE:
					hideCodeSetter(cells[index], hidden);
					break;
				case OUTPUT:
					hideOutputSetter(cells[index], hidden);
					break;
			}
			try{
				$($(Jupyter.notebook.get_selected_cell().celltoolbar.inner_element[0]).find('input')[type]).prop('checked', hidden);
			} catch(err){
				//do nothing
			}
		});
	}

	/*
	Keyboard shortcut handlers.
	*/

	var hideCodeKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Hides selected cell\'s code',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		hideEach(CODE, env.notebook.get_selected_cells(), true);
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
    		hideEach(CODE, env.notebook.get_selected_cells(), false);
    	},
    }, 'show_code_action','hide_code');

    var hidePromptKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Hides selected cell\'s prompts.',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		hideEach(PROMPT, env.notebook.get_selected_cells(), true);
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
    		hideEach(PROMPT, env.notebook.get_selected_cells(), false);
    	},
    }, 'show_prompt_action','hide_code');

    var hideOutputKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Hides selected cell\'s prompts.',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		hideEach(OUTPUT, env.notebook.get_selected_cells(), true);
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
    		hideEach(OUTPUT, env.notebook.get_selected_cells(), false);
    	},
    }, 'show_output_action','hide_code');

    var hidePromptsAndCodeKeyboardAction = Jupyter.keyboard_manager.actions.register({
    	help: 'Hides selected cell\'s prompts and code.',
    	icon: 'fa-code',
    	help_index: '',
    	handler: function(env){
    		toggleAllPromptsAndCode()
    	},
    }, 'toggle_prompt_and_code_action','hide_code');


    function addKeyboardShortcutBindings(){
    	Jupyter.keyboard_manager.command_shortcuts.add_shortcut('e', 'hide_code:hide_code_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('shift-e', 'hide_code:show_code_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('w', 'hide_code:hide_prompt_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('shift-w', 'hide_code:show_prompt_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('r', 'hide_code:hide_output_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('shift-r', 'hide_code:show_output_action', 'hide_code');
        Jupyter.keyboard_manager.command_shortcuts.add_shortcut('t', 'hide_code:toggle_prompt_and_code_action', 'hide_code');
    }

    function addHideCodeMenuItem(){
        var menu = getMenuBar()
        menu.append(menuItem('Hide Code','#'));

        getHideCodeMenu().append(dropdownMenuItem('PDF Export (HTML)', exportLink('pdf'), 'HTML PDF exporter.'));
        getHideCodeMenu().append(dropdownMenuItem('PDF Export (Latex)', exportLink('latexpdf'), 'Latex PDF exporter.'));
        getHideCodeMenu().append(dropdownMenuItem('HTML Export', exportLink('html'), 'HTML exporter.'));
    }

    function getMenuBar(){
    	return $('#menus').find('.navbar-nav')
    }

    function getHideCodeMenu(){
    	return $('#hide_code_menu_list')
    }

    function dropdownMenuItem(text, url, tooltip){
    	var item = $('<li>', {title: tooltip, });
    	var link = $('<a>', {href: url, text: text});
    	item.append(link);
    	return item
    }

    function menuItem(text, url){
    	var menu_item = $('<li>', {class: 'dropdown', id: 'hide_code_menu_item'});
    	var link = $('<a>', {class: 'dropdown-toggle', href: url, text: text, 'data-toggle': 'dropdown'});
    	var dropdown_menu = $('<ul>', {id: 'hide_code_menu_list', class: 'dropdown-menu'});
    	menu_item.append(link);
    	menu_item.append(dropdown_menu);
    	return menu_item
    }

	function load_ipython_extension(){
		ctb.register_callback('hide_code.hideCode', hideCodeCallback);
        ctb.register_callback('hide_code.hidePrompts', hidePromptCallback);
        ctb.register_callback('hide_code.hideOutputs', hideOutputCallback);
        ctb.register_preset('Hide code',['hide_code.hidePrompts','hide_code.hideCode','hide_code.hideOutputs']);
        addHideCodeButtonToToolbar();
        addKeyboardShortcutBindings();
        addHideCodeMenuItem();

        $.each(Jupyter.notebook.get_cells(), function(index, cell){
        	toggleHidePrompt(cell);
        	toggleHideCode(cell);
        	toggleHideOutput(cell);
        });
        console.log('hide_code setup complete');
	}
	
	// setup();
	

	return {
        load_ipython_extension: load_ipython_extension
};
});
