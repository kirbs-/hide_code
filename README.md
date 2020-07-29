# Hide_code
![PyPI version](https://badge.fury.io/py/hide_code.svg) ![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg) 
Release: ![Travis release build](https://travis-ci.org/kirbs-/hide_code.svg?branch=master) Dev: ![Dev Build Status](https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

hide_code is a Jupyter notebook extension to selectively hide code, prompts and outputs with PDF and HTML exporting support. Check out the demo with [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/kirbs-/hide_code/master?filepath=demo.ipynb)

![demo](/images/demo.gif)

## Installation
1. `pip install hide_code`
2. `jupyter nbextension install --py hide_code`
3. `jupyter nbextension enable --py hide_code`
4. `jupyter serverextension enable --py hide_code`

## Upgrading with nbextension
1. `pip install hide_code --upgrade`
2. `jupyter nbextension install --py hide_code`

Note: add `--sys-prefix` to `jupyter nbextension` to install into virtualenv or conda environment.

## New in 0.5.3 & 0.5.5
#### Improvements
* Simplified extension installation. No longer need to use nbextension/serverextension commands after pip install.
* No longer supporting Python 2.7. Install hide_code==0.5.2 for Python 2.7.
#### Bug Fixes
* Fixed latexpdf exporting.
* Changed nbconvert --to hide_code_pdf to use pdfkit.
* Fixed issue exporting notebooks after renaming a notebook.
* Resolved issue exporting notebooks with spaces in notebook name.
* Updated reading file to always use utf-8 encoding. This should resolve non-latin character issues.
* Renamed license file.



## Documentation
Visit the [Wiki](https://github.com/kirbs-/hide_code/wiki).

## Requirements
* Jupyter notebook ~>5.1
* Jupyter nbconvert ~>5.0.
* pdfkit & [wkhtmltopdf](http://wkhtmltopdf.org/)
* Python 3.4+

![hide_code-hits](https://caspersci.uk.to/cgi-bin/hits.cgi?q=hide_code&style=social&r=https://github.com/kirbs-/hide_code&l=https://caspersci.uk.to/images/tqdm.png&f=https://raw.githubusercontent.com/tqdm/tqdm/master/images/logo.gif)