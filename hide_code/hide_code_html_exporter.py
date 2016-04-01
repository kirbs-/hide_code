import os
import os.path

from traitlets.config import Config
from nbconvert.exporters.html import HTMLExporter
from traitlets.log import get_logger

class HideCodeHTMLExporter(HTMLExporter):

	def __init__(self, config=None, **kw):
		# self.register_preprocessor('hide_code.HideCodePreprocessor', True)
		super(HideCodeHTMLExporter, self).__init__(config, **kw)
		self.preprocessors = ['hide_code.HideCodePreprocessor']
		self._init_preprocessors()

	def _default_template_path_default(self):
		return  "/Users/ckirby/.virtualenvs/hide_code/lib/python2.7/site-packages/hide_code/Templates"

	def _template_file_default(self):
		return 'hide_code'


	# @property
	# def default_config(self):
	# 	c = Config(
	# 		{
	# 		'hide_code.HideCodePreprocessor': {
	# 			'enabled':True
	# 		},
	# 	}
	# 	)

	# 	c.merge(super(SimpleExporter,self).default_config)
	# 	get_logger().debug(
 #                "SimpleExporter: default config loaded."
 #            )
	# 	get_logger().debug(
 #                "Config: %s", c
 #            )
	# 	self.register_preprocessor('hide_code.HideCodePreprocessor', True)
	# 	return c

	# def register_preprocessor(self, preprocessor, enabled):
	# 	super(SimpleExporter, self).register_preprocessor('hide_code.HideCodePreprocessor', True)