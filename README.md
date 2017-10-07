# Hide_code
![PyPI version](https://badge.fury.io/py/hide_code.svg) ![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg) 
Release: ![Travis release build](https://travis-ci.org/kirbs-/hide_code.svg?branch=master) Dev: ![Dev Build Status](https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

hide_code is a Jupyter notebook extension to selectively hide code, prompts and outputs with PDF and HTML exporting support. 

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

## New in 0.5.0
* Export Reveal.js slides or latex templates.
* Support for nbconvert 5.x+ and notebook 5.x+.

## Documentation
Visit the [Wiki](https://github.com/kirbs-/hide_code/wiki).

## Requirements
* Jupyter notebook ~>5.1
* Jupyter nbconvert ~>5.0.
* pdfkit & [wkhtmltopdf](http://wkhtmltopdf.org/)
* Python 2.7 or 3.3+
