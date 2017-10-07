import nbformat
from hide_code import HideCodeHTMLExporter
from nose.tools import *
from nbconvert import HTMLExporter


class TestHideCode(object):

    def test_html_exporter(self):
        with open('hide_code_test_notebook.ipynb') as f:
            nb = nbformat.reads(f.read(), as_version=4)

        exporter = HideCodeHTMLExporter()
        output_html, resources = exporter.from_notebook_node(nb)
        with open('test.html', 'w') as f:
            f.write(output_html)
        assert_true(output_html)

    def test_nbconvert_html_exporter(self):
        with open('hide_code_test_notebook.ipynb') as f:
            nb = nbformat.reads(f.read(), as_version=4)

        exporter = HTMLExporter()
        output_html, resources = exporter.from_notebook_node(nb)
        assert_true(output_html)