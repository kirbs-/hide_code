import json
from os import path, remove
import shutil
from .utils import Utils
class HideCodeConfig(object):

	config_file =  path.join(Utils.get_module_dir(),'hide_code_config.json')

	@classmethod
	def set(cls, key, value):
		with open(cls.config_file, 'r') as f:
			try:
				config = json.loads(f.read())
			except:
				config = {}
			config[key] = value

		remove(cls.config_file)

		with open(cls.config_file, 'a') as f:
			f.write(json.dumps(config))

	@classmethod
	def get(cls, key):
		try:
			with open(cls.config_file, 'r') as f:
				config = json.loads(f.read())
				return config[key]
		except:
			return None

	@classmethod
	def print_config(cls):
		with open(cls.config_file, 'r') as f:
			return json.loads(f.read())
