import os
import inspect
import notebook

class Utils(object):

	@classmethod
	def get_notebook_module_dir(cls):
		"""
		Returns path to jupter notebook module.
		"""
		return os.path.dirname(inspect.getfile(notebook))

	@classmethod
	def get_module_dir(cls):
		"""
		Returns path to hide_code module.
		"""
		return os.path.dirname(inspect.getfile(cls))