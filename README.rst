Hide_code
=========

.. image:: https://img.shields.io/github/license/mashape/apistatus.svg

Release build

.. image:: https://travis-ci.org/kirbs-/hide_code.svg?branch=master

Development build

.. image:: https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

Introduction
============
hide_code is an extension for Jupyter/IPython notebooks to selectively hide code and prompts. Make a notebook a code free document for exporting or presenting with a single click by pressing 

.. image:: https://raw.githubusercontent.com/kirbs-/hide_code/dev/images/button.png

Normal
------
.. image:: https://raw.githubusercontent.com/kirbs-/hide_code/dev/images/1.1.png
   :width: 918
   :height: 322
   :scale: 70 

Hide code enabled
-----------------
.. image:: https://raw.githubusercontent.com/kirbs-/hide_code/dev/images/1.2.png
   :width: 1227
   :height: 322
   :scale: 60 

Or customize each cell by selecting "Hide code" from the Cell Toolbar dropdown. Then use "Hide Code" and "Hide Prompts" checkboxes to hide the specific cell's code or cell's input/output prompts.

.. image:: https://raw.githubusercontent.com/kirbs-/hide_code/dev/images/2.png
   :width: 408
   :height: 242
   :scale: 60 

Normal
------
.. image:: https://raw.githubusercontent.com/kirbs-/hide_code/dev/images/3.1.png
   :width: 696   
   :height: 322
   :scale: 90 

Hide code enabled
-----------------
.. image:: https://raw.githubusercontent.com/kirbs-/hide_code/dev/images/3.2.png
   :width: 764
   :height: 322
   :scale: 80 

Installation
============
Via pip
-------
`pip install hide_code`

Via setuptools
--------------
1. Download and unzip this repository. 
2. Change to unzipped directory.
3. Execute `python setup.py install`

Installation Troubleshooting
============================
If installation complains the directory doesn't exist, you're Jupyter/IPython installation probably isn't in one of the usual places. Locate Jupyter's configuration directory, then use code below to install in a non-standard directory.
`
import hide_code.hide_code as hc
dir = "<full path to Jupyter config directory>"
hc.install(dir)
`

Requirements
============
* Jupyter notebook 4+
* Python 2.7+ if installing with pip
