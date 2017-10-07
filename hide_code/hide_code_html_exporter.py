import os
import os.path

# import traitlets.config import Config
from traitlets import default, Unicode
from nbconvert.exporters.html import HTMLExporter
from traitlets.log import get_logger


class HideCodeHTMLExporter(HTMLExporter):
    def __init__(self, config=None, **kw):
        # self.register_preprocessor('hide_code.HideCodePreprocessor', True)
        super(HideCodeHTMLExporter, self).__init__(config, **kw)
        # self.preprocessors = ['hide_code.HideCodePreprocessor']
        # self._init_preprocessors()

    @default('template_file')
    def _template_file_default(self):
        return 'hide_code_full.tpl'

    @property
    def template_path(self):
        """
        We want to inherit from HTML template, and have template under
        `./templates/` so append it to the search path. (see next section)
        """
        return super(HideCodeHTMLExporter, self).template_path + [os.path.join(os.path.dirname(__file__), "Templates")]

    # @default('default_template_path')
    # def _default_template_path_default(self):
    #     return os.path.join(os.path.dirname(__file__), "Templates")
