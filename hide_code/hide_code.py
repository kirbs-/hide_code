import os
from os import path
import shutil
import jupyter_core.paths as j_path
from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler
import nbformat
from traitlets.config import Config
from .hide_code_html_exporter import HideCodeHTMLExporter
import pdfkit
from notebook.services.config import ConfigManager

notebook_dir = ""
base_url = ""

class HideCodeHTMLExportHandler(IPythonHandler):
	def get(self, nb_name):
		self.log.info("hide_code: Starting HTML export for {}".format(nb_name))
		with open(path.join(notebook_dir, nb_name)) as f:
			nb = nbformat.reads(f.read(), as_version=4)
			exporter = HideCodeHTMLExporter()
			output_html, resources = exporter.from_notebook_node(nb)
		self.set_header('Content-Type', 'text/html')
		self.set_header('Content-Disposition', 'attachment; filename=' + notebook_name(nb_name) + '.html')
		self.flush()
		self.write(output_html)
		self.log.info("hide_code: Finished HTML export for {}".format(nb_name))
		self.finish()

class HideCodePDFExportHandler(IPythonHandler):
	def get(self, nb_name):
		self.log.info("hide_code: Starting PDF export for {}".format(nb_name))
		with open(path.join(notebook_dir, nb_name)) as f:
			nb = nbformat.reads(f.read(), as_version=4)
			exporter = HideCodeHTMLExporter()
			output_html, resources = exporter.from_notebook_node(nb)
			output = pdfkit.from_string(output_html, False)
		self.set_header('Content-Type', 'application/pdf')
		self.set_header('Content-Disposition', 'attachment; filename=' + notebook_name(nb_name) + '.pdf')
		self.flush()
		self.write(output)
		self.log.info("hide_code: Finished PDF export for {}".format(nb_name))
		self.finish()


def __main__():
	install()

def load_jupyter_server_extension(nb_app):
	nb_app.log.info("hide_code: Attempting to load hid_code export handler extensions.")
	web_app = nb_app.web_app
	notebook_dir = nb_app.notebook_dir
	host_pattern = '.*$'
	route_pattern = url_path_join(web_app.settings['base_url'], 'notebooks/([^/]+)/export/html')
	route_pattern2 = url_path_join(web_app.settings['base_url'], 'notebooks/([^/]+)/export/pdf')

	base_url = web_app.settings['base_url']
	web_app.add_handlers(host_pattern, [(route_pattern, HideCodeHTMLExportHandler), (route_pattern2, HideCodePDFExportHandler)])
	nb_app.log.info("hide_code: Hide_code export handler extensions loaded.")


def install(nb_path=None, server_config=True, DEBUG=False):
	install_path = None
	print('Starting hide_code.js install...')
	current_dir = path.abspath(path.dirname(__file__))
	config_dirs = j_path.jupyter_config_path()
	site_packages_path = get_site_package_dir()

	# check for config directory with a "custom" folder
	# TODO update this logic to check if custom.js file exists
	for dir in config_dirs:
		custom_dir = path.join(dir, "custom")
		if path.isdir(custom_dir):
			install_path = custom_dir
			break

	# last ditch effort in case jupyter config directories don't contain custom/custom.js		
	if install_path == None:	
		print("No config directories contain \"custom\" folder. Trying site-packages...")	
		install_path = path.join(site_packages_path, "notebook", "static", "custom")
	

	if nb_path != None:
		install_path = nb_path
		print("Using argument supplied path: " + install_path)

	if DEBUG:
		print(install_path)

	# copy js into static/custom directory in Jupyter/iPython directory
	if path.isdir(install_path):
		shutil.copyfile(path.join(current_dir, "hide_code.js"), path.join(install_path, "hide_code.js"))
		print('Copying hide_code.js to ' + install_path) 

		# add require to end of custom.js to auto-load on notebook startup
		print("Attempting to configure custom.js to auto-load hide__code.js...")
		try:
			with open(path.join(current_dir, "auto-load.txt")) as auto:
				auto_load_txt = auto.read();
				auto_loaded = False

				# check if auto-load.txt is already in custom.js
				with open(path.join(install_path, "custom.js"), 'r') as customJS:
					if auto_load_txt in customJS.read():
						auto_loaded = True
						print("Custom.js already configured to auto-load hide_code.js.")


				if not auto_loaded:  # append auto load require to end of custom.js
					with open(path.join(install_path, "custom.js"), 'a') as customJS:
						customJS.write(auto_load_txt)
						print("Configured custom.js to auto-load hide_code.js.")
		except:
			print("Custom.js not in custom directory.")
	else:
		print('Unable to install into ' + install_path)
		print('Directory doesn\'t exist.')
		print('Make sure Jupyter is installed.')

	if server_config:
		print("Attempting to configure auto-loading for hide_code export handlers.")
		try:
			# Activate the Python server extension
			server_cm = ConfigManager(config_dir=j_path.jupyter_config_dir())
			cfg = server_cm.get('jupyter_notebook_config')
			server_extensions = (cfg.setdefault('NotebookApp', {})
				.setdefault('server_extensions', [])
				)
			extension = 'hide_code.hide_code'
			if extension not in server_extensions:
				cfg['NotebookApp']['server_extensions'] += [extension]
				server_cm.update('jupyter_notebook_config', cfg)
				print('Configured jupyter to auto-load hide_code export handlers.')
			else:
				print("Jupyter already configured to auto-load export handlers.")
		except:
			print('Unable to install server extension.') 

def notebook_name(nb_name):
	return nb_name[:-6]

def get_site_package_dir():
	os_file = os.__file__
	if os_file.endswith('c'):
		return path.join(os_file[:-7], "site-packages")
	else:
		return path.join(os_file[:-6], "site-packages")

def setup_info():
	server_cm = ConfigManager(config_dir=j_path.jupyter_config_dir())
	cfg = server_cm.get('jupyter_notebook_config')
	server_extensions = (cfg.setdefault('NotebookApp', {})
				.setdefault('server_extensions', [])
				)
	extension = 'hide_code.hide_code'
	if extension not in server_extensions:
		ext = 'Not loaded'
	else:
		ext = 'Loaded'

	files = []
	for (dirpath, dirnames, filenames) in os.walk(path.join(get_site_package_dir(), 'hide_code')):
		files.extend(filenames)
		break	

	custom_js = ''
	with open(path.join(get_site_package_dir(), 'notebook','static','custom','custom.js'), 'r') as f:
		for line in iter(f):
			if not line.startswith(' *') and not line.startswith('/'):
				custom_js = custom_js + line + ' '


	return ("Installation dir: {0}\nConfiguration dir: {1}\nExport handler extensions: {2}\nHide Code files: {3}\nCustom JS contents: {4}"
		.format(get_site_package_dir(), j_path.jupyter_config_dir(), ext, files, custom_js))






