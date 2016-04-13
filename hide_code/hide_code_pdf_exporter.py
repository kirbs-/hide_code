import os
import os.path

from traitlets.config import Config
from nbconvert.exporters.pdf import PDFExporter
from traitlets.log import get_logger

class HideCodePDFExporter(PDFExporter):

	def __init__(self, config=None, **kw):
		# self.register_preprocessor('hide_code.HideCodePreprocessor', True)
		super(HideCodePDFExporter, self).__init__(config, **kw)
		self.preprocessors = ['hide_code.HideCodePreprocessor']
		self._init_preprocessors()

		# def _default_template_path_default(self):
		# 	return  "/Users/ckirby/.virtualenvs/hide_code/lib/python2.7/site-packages/hide_code/Templates"

	def _template_file_default(self):
		return 'hide_code_article'

	@property
	def template_path(self):
		"""
		We want to inherit from HTML template, and have template under
		`./templates/` so append it to the search path. (see next section)
		"""
		return super(HideCodePDFExporter, self).template_path+[os.path.join(os.path.dirname(__file__), "Templates")]