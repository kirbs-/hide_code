import os

class Utils(object):

	@classmethod
	def get_site_package_dir(cls):
		"""

		"""
		os_file = os.__file__
		if os_file.endswith('c'):
			return os.path.join(os_file[:-7], "site-packages")
		else:
			return os.path.join(os_file[:-6], "site-packages")