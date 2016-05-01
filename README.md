# Hide_code
![PyPI version](https://badge.fury.io/py/hide_code.svg) ![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg) 

Release: ![Travis release build](https://travis-ci.org/kirbs-/hide_code.svg?branch=master) Dev: ![Dev Build Status](https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

## New in 0.3.0 Release
HTML & PDF exporting bug fixes.
Cell output hiding (thanks to @acspike).

## Introduction
hide_code is an extension for Jupyter/IPython notebooks to selectively hide code, prompts and outputs. Make a notebook a code free document for presenting with a single click by pressing ![hide_code toggle](/images/button.png)

|Normal|Hide Code Enabled|
|![image1.1](/images/1.1.png)|
![image1.2](/images/1.2.png)|

Or customize each cell by selecting "Hide code" cell Toolbar dropdown. Then use "Hide Code" and "Hide Prompts" checkboxes to hide the specific cell's code or cell's input/output prompts.

![image2](/images/2.png)

|Normal|Hide Code Enabled|
|![image3.1](/images/3.1.png)|![image3.2](/images/3.2.png)|

## Exporting
Hide_code adds HTML, PDF via HTML, and PDF via Latex export options to Jupyter. Exporting respects hide_code's code, prompt, and output selections; these must be saved prior to exporting. 

This feature continues to evolve. Items on the road map incude:
* saving as a different file name.
* support for custom CSS.
* single click exporting with all code and prompts hidden (similar to how the toolbar button).

### Notes
* **Exporting to PDF via HTML requires [wkhtmltopdf](http://wkhtmltopdf.org/)!** 
* **Exporting to PDF via Latex requires a Tex library.**


### Via notebook
To export via HTML or PDF simply click on the respective button.
![image4.1](/images/4.1.png)

### Via nbconvert command line
To export via nbconvert command line, nbconvert 4.2 or later is required. Hide_code adds three export options to nbconvert, hide_code_html, hide_code_pdf, and hide_code_latexpdf. 

Note: PDF exporting via command line uses nbconvert's built in PDF exporter.

`jupyter nbconvert --to hide_code_html notebook_to_convert.ipynb`

`jupyter nbconvert --to hide_code_pdf notebook_to_convert.ipynb`

`jupyter nbconvert --to hide_code_latexpdf notebook_to_convert.ipynb'


## Installation
### Via pip
`pip install hide_code`

### Via setuptools
1. Download and unzip this repository. 
2. Change to unzipped directory.
3. Execute ```python setup.py install```

### Installation Troubleshooting
If installation complains the directory doesn't exist, you're Jupyter/IPython installation probably isn't in one of the usual places. Locate Jupyter's configuration directory, then use code below to install in a non-standard directory.
```python
import hide_code.hide_code as hc
dir = "<full path to Jupyter config directory>"
hc.install(dir)
```

## Requirements
* Jupyter notebook 4.x+
* Jupyter nbconvert 4.2+ if using nbconvert command line exporting
* pdfkit & [wkhtmltopdf](http://wkhtmltopdf.org/)
* Python 2.7 or 3.3+
