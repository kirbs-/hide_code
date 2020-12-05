import os
import os.path
import pdfkit


# from hide_code.hide_code_html_exporter import HideCodeHTMLExporter


from traitlets.config import Config
from traitlets import default
# from nbconvert.exporters.pdf import PDFExporter
from nbconvert.exporters.html import HTMLExporter
from traitlets.log import get_logger


class HideCodePDFExporter(HTMLExporter):
    def __init__(self, config=None, **kw):
        # self.register_preprocessor('hide_code.HideCodePreprocessor', True)
        super(HideCodePDFExporter, self).__init__(config, **kw)
        # self.preprocessors = ['hide_code.HideCodePreprocessor']
        # self._init_preprocessors()

    @default('file_extension')
    def _file_extension_default(self):
        return '.pdf'

    def from_notebook_node(self, nb, resources=None, **kw):
        output, resources = super(HideCodePDFExporter, self).from_notebook_node(nb, resources, **kw)
        output = pdfkit.from_string(output, False)
        return output, resources

    def _template_file_default(self):
        return 'hide_code_full.tpl'

    @property
    def template_paths(self):
        """
        We want to inherit from HTML template, and have template under
        `./templates/` so append it to the search path. (see next section)
        """
        return super(HideCodePDFExporter, self).template_paths + [os.path.join(os.path.dirname(__file__), "Templates")]
