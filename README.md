# Hide_code
![PyPI version](https://badge.fury.io/py/hide_code.svg) ![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg) 
Release: ![Travis release build](https://travis-ci.org/kirbs-/hide_code.svg?branch=master) Dev: ![Dev Build Status](https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

hide_code is a Jupyter notebook extension to selectively hide code, prompts and outputs with PDF and HTML exporting support. Check out the demo with [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/kirbs-/hide_code/master?filepath=demo.ipynb)

![demo](/images/demo.gif)

## Jupyter Notebook Installation
1. `pip install hide_code`
2. `jupyter nbextension install --py hide_code`
3. `jupyter nbextension enable --py hide_code`
4. `jupyter serverextension enable --py hide_code`

## Jupyter Lab Installation
1. `pip install hide_code[lab]`
2. `jupyter lab build`

## Upgrading with nbextension
1. `pip install hide_code --upgrade`
2. `jupyter nbextension install --py hide_code`

Note: add `--sys-prefix` to `jupyter nbextension` to install into virtualenv or conda environment.

## Changes in 0.6.0
#### Improvements
* Added experiemental Jupyter Lab support. See [Lab usage](https://github.com/kirbs-/hide_code/wiki/Lab%20Usage) for details and limitations.
* Added Binder demo [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/kirbs-/hide_code/master?filepath=demo.ipynb)
* Simplified extension installation. No longer need to use nbextension/serverextension commands after pip install.
* No longer supporting Python 2.7. Install hide_code==0.5.2 for Python 2.7.
* 0.5.6 is the last version to support Python 3.6 and older.
* Added extras_install [all] to install hide_code and all dependencies. Use `pip install hide_code[all]` to install. Resolves #85. 




## Documentation
Visit the [Wiki](https://github.com/kirbs-/hide_code/wiki).

## Requirements
* Jupyter notebook >6.0
* Jupyter nbconvert >6.x
* pdfkit & [wkhtmltopdf](http://wkhtmltopdf.org/)
* Python 3.7+

![hide_code-hits](https://caspersci.uk.to/cgi-bin/hits.cgi?q=hide_code&style=social&r=https://github.com/kirbs-/hide_code&l=https://caspersci.uk.to/images/tqdm.png&f=https://raw.githubusercontent.com/tqdm/tqdm/master/images/logo.gif)

