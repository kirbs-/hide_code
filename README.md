# Hide_code
![PyPI version](https://badge.fury.io/py/hide_code.svg) ![MIT license](https://img.shields.io/github/license/mashape/apistatus.svg) 

Release: ![Travis release build](https://travis-ci.org/kirbs-/hide_code.svg?branch=master) Dev: ![Dev Build Status](https://travis-ci.org/kirbs-/hide_code.svg?branch=dev)

### hide_code now supports HTML & PDF exporting!

## Introduction
hide_code is an extension for Jupyter/IPython notebooks to selectively hide code and prompts. Make a notebook a code free document for presenting with a single click by pressing ![hide_code toggle](/images/button.png)

###### Normal
![image1.1](/images/1.1.png)

###### Hide code enabled
![image1.2](/images/1.2.png)

Or customize each cell by selecting "Hide code" from the Cell Toolbar dropdown. Then use "Hide Code" and "Hide Prompts" checkboxes to hide the specific cell's code or cell's input/output prompts.

![image2](/images/2.png)

###### Normal
![image3.1](/images/3.1.png)

###### Hide code enabled
![image3.2](/images/3.2.png)

## Exporting
Exporting respects hide code/prmpt cell selections only. Output is saved in Jupyter's current working directory with the notebook's file name + '.html' or '.pdf'. **Exporting to PDF via notebook requires [wkhtmltopdf](http://wkhtmltopdf.org/)!** 

This feature continues to evolve. Items on the road map incude:
* saving to a different file loaction.
* saving as a different file name.
* support for custom CSS.
* single click exporting with all code and prompts hidden (similar to how the toolbar button).

### Via notebook
To export via HTML or PDF simply click on the respective button.
![image4.1](/images/4.1.png)

### Via nbconvert command line
To export via nbconvert command line, nbconvert 4.2 or later is required. Hide_code adds two export options to nbconvert, hide_code_html and hide_code_pdf. 

Note: PDF exporting via command line uses nbconvert's built in PDF exporter.

`jupyter nbconvert --to hide_code_html notebook_to_convert.ipynb`

`jupyter nbconvert --to hide_code_pdf notebook_to_convert.ipynb`

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
