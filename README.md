# Hide_code
![PyPI version](https://badge.fury.io/py/hide_code.svg) ![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg) 
Release: ![Travis release build](https://travis-ci.org/kirbs-/hide_code.svg?branch=master) Dev: ![Dev Build Status](https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

hide_code is an extension for Jupyter/IPython notebooks to selectively hide code, prompts and outputs. Multiple export formats are supported. 

## Installation
1. `pip install hide_code`
2. `jupyter nbextensions install hide_code`
3. `jupyter nbextensions enable hide_code`


## Requirements
* Jupyter notebook 4.x+
* Jupyter nbconvert 4.2+ if using nbconvert command line exporting
* pdfkit & [wkhtmltopdf](http://wkhtmltopdf.org/)
* Python 2.7 or 3.3+
