# Always prefer setuptools over distutils
from setuptools import setup, find_packages
# from setuptools.command.install import install as _install 
# To use a consistent encoding
from codecs import open
from os import path
import sys
import os

# here = path.abspath(path.dirname(__file__))

# def _post_install(dir):
#     from hide_code import hide_code
#     hide_code.install()


# class install(_install):
#     description = 'Installs hide_code.js, hide_code export handlers and server extension.'
#     # user_options = [{'auto-load=', None, 'Do not auto-load server extensions.'}]

#     # def initialize_options(self):
#     #     self.auto_load = True

#     # def finalize_options(self):
#     #     _install.finalize_options()

#     def run(self):
#         _install.run(self)
#         self.execute(_post_install, (self.install_lib, ), msg="Running post install task...")



# Get the long description from the relevant file
with open('README.rst', encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='hide_code',

    # Versions should comply with PEP440.  For a discussion on single-sourcing
    # the version across setup.py and the project code, see
    # https://packaging.python.org/en/latest/single_source_version.html
    version='0.4.0',

    description='A Jupyter notebook extension to hide code, prompts and outputs.',
    long_description=long_description,

    # The project's main homepage.
    url='https://github.com/kirbs-/hide_code',

    # Author details
    author='Chris Kirby',
    author_email='kirbycm@gmail.com',

    # Choose your license
    license='MIT',

    # See https://pypi.python.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        # How mature is this project? Common values are
        #   3 - Alpha
        #   4 - Beta
        #   5 - Production/Stable
        'Development Status :: 4 - Beta',

        # Indicate who your project is intended for
        'Intended Audience :: Developers',
        'Topic :: Scientific/Engineering',

        # Pick your license as you wish (should match "license" above)
        'License :: OSI Approved :: MIT License',

        # Specify the Python versions you support here. In particular, ensure
        # that you indicate whether you support Python 2, Python 3 or both.
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],

    # What does your project relate to?
    keywords='jupyter notebook presentation',

    # You can just specify the packages manually here if your project is
    # simple. Or you can use find_packages().
    # packages=find_packages(exclude=['contrib', 'docs', 'tests*']),
    packages={'hide_code'},

    # List run-time dependencies here.  These will be installed by pip when
    # your project is installed. For an analysis of "install_requires" vs pip's
    # requirements files see:
    # https://packaging.python.org/en/latest/requirements.html
    install_requires=['jupyter', 'pdfkit', 'nbconvert<5.0'],

    # If there are data files included in your packages that need to be
    # installed, specify them here.  If using Python 2.6 or less, then these
    # have to be included in MANIFEST.in as well.
    package_data={
        'hide_code': ['*.js','*.txt', os.path.join('Templates', '*'), 'hide_code_config.json'],
    },

    # Although 'package_data' is the preferred approach, in some case you may
    # need to place data files outside of your packages. See:
    # http://docs.python.org/3.4/distutils/setupscript.html#installing-additional-files # noqa
    # In this case, 'data_file' will be installed into '<sys.prefix>/my_data'
    # data_files=[('my_data', ['data/data_file'])],

    # To provide executable scripts, use entry points in preference to the
    # "scripts" keyword. Entry points provide cross-platform support and allow
    # pip to create the appropriate form of executable for the target platform.
    # entry_po
    # scripts=['hide_code/hide_code.py'],
    # cmdclass={'install': install},

    entry_points={
        'nbconvert.exporters': [
            'hide_code_html = hide_code:HideCodeHTMLExporter',
            'hide_code_pdf = hide_code:HideCodePDFExporter',
            'hide_code_latexpdf = hide_code.HideCodeLatexPDFExporter',
        ],
    }
)
