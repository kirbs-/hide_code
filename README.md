# Hide_code
![PyPI version](https://badge.fury.io/py/hide_code.svg) ![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg) 
Release: ![Travis release build](https://travis-ci.org/kirbs-/hide_code.svg?branch=master) Dev: ![Dev Build Status](https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

hide_code is an extension for Jupyter/IPython notebooks to selectively hide code, prompts and outputs. PDF and HTML export formats are fully supported. 

![](/images/demo.gif)

## Installation
1. `pip install hide_code`
2. `jupyter nbextension install --py hide_code`
3. `jupyter nbextension enable --py hide_code`
4. `jupyter server_extension enable --py hide_code`

## Upgrading from 0.3.1?
Versions prior to 0.4 were installed by bootstrapping custom.js and jupyter configuration files. Pip uninstall does not remove these files. Upgrade to 0.4, then run `python -c "import hide_code; hide_code.uninstall_bootrapped_files()"`.


## Requirements
* Jupyter notebook 4.x+
* Jupyter nbconvert 4.2+ if using nbconvert command line exporting
* pdfkit & [wkhtmltopdf](http://wkhtmltopdf.org/)
* Python 2.7 or 3.3+
