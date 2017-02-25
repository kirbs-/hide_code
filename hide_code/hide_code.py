import os
from os import path
import shutil
import jupyter_core.paths as j_path
from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler
import nbformat
from traitlets.config import Config
from .hide_code_html_exporter import HideCodeHTMLExporter
from .hide_code_pdf_exporter import HideCodePDFExporter
import pdfkit
from notebook.services.config import ConfigManager
from .hide_code_config import HideCodeConfig as hc_config
from .utils import Utils

notebook_dir = ""
base_url = ""

class HideCodeHTMLExportHandler(IPythonHandler):
	def get(self, *args):
		self.log.info("hide_code: Starting HTML export for {}".format(args[-1]))
		with open(ipynb_file_name(args)) as f:
			nb = nbformat.reads(f.read(), as_version=4)
			exporter = HideCodeHTMLExporter()
			output_html, resources = exporter.from_notebook_node(nb)
		self.set_header('Content-Type', 'text/html')
		self.set_header('Content-Disposition', 'attachment; filename=' + notebook_name(args) + '.html')
		self.flush()
		self.write(output_html)
		self.log.info("hide_code: Finished HTML export for {}".format(args[-1]))
		self.finish()

class HideCodePDFExportHandler(IPythonHandler):
	def get(self, *args):
		self.log.info("hide_code: Starting PDF export for {}".format(args[-1]))
		with open(ipynb_file_name(args)) as f:
			nb = nbformat.reads(f.read(), as_version=4)
			exporter = HideCodeHTMLExporter()
			output_html, resources = exporter.from_notebook_node(nb)
			output = pdfkit.from_string(output_html, False)
		self.set_header('Content-Type', 'application/pdf')
		self.set_header('Content-Disposition', 'attachment; filename=' + notebook_name(args) + '.pdf')
		self.flush()
		self.write(output)
		self.log.info("hide_code: Finished PDF export for {}".format(args[-1]))
		self.finish()

class HideCodeLatexPDFExportHandler(IPythonHandler):
	def get(self, *args):
		self.log.info("hide_code: Starting Latex PDF export for {}".format(args[-1]))
		with open(ipynb_file_name(args)) as f:
			nb = nbformat.reads(f.read(), as_version=4)
			exporter = HideCodePDFExporter()
			output, resources = exporter.from_notebook_node(nb, resources={"metadata": {"name": notebook_name(args)}})
		self.set_header('Content-Disposition', 'attachment; filename=' + notebook_name(args) + '.pdf')
		self.flush()
		self.write(output)
		self.log.info("hide_code: Finished Latex PDF export for {}".format(args[-1]))
		self.finish()


def __main__():
	install()

def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        # the path is relative to the `my_fancy_module` directory
        src="",
        # directory in the `nbextension/` namespace
        dest="hide_code",
        # _also_ in the `nbextension/` namespace
        require="hide_code/hide_code")]

def _jupyter_server_extension_paths():
    return [{
        "module": "hide_code"
    }]

def load_jupyter_server_extension(nb_app):
	nb_app.log.info("hide_code: Attempting to load hid_code export handler extensions.")
	web_app = nb_app.web_app
	notebook_dir = nb_app.notebook_dir
	host_pattern = '.*$'
	global base_url 
	base_url = web_app.settings['base_url']

	base_url = web_app.settings['base_url']
	web_app.add_handlers(host_pattern, [
		(route_pattern_for('html'), HideCodeHTMLExportHandler),
		(route_pattern_for('pdf'), HideCodePDFExportHandler),
		(route_pattern_for('latexpdf'), HideCodeLatexPDFExportHandler)
	])
	nb_app.log.info("hide_code: Hide_code export handler extensions loaded.")


def uninstall_bootstrapped_files(nb_path=None, server_config=True, DEBUG=False):
	install_path = None
	print('Starting hide_code.js removal...')
	current_dir = path.abspath(path.dirname(__file__))
	config_dirs = j_path.jupyter_config_path()
	notebook_module_path = Utils.get_notebook_module_dir()

	# check for config directory with a "custom" folder
	# TODO update this logic to check if custom.js file exists
	for dir in config_dirs:
		custom_dir = path.join(dir, "custom")
		if path.isdir(custom_dir):
			install_path = custom_dir
			break

	# last ditch effort in case jupyter config directories don't contain custom/custom.js		
	if install_path == None:	
		print("No config directories contain \"custom\" folder. Trying Jupyter notebook module path...")	
		install_path = path.join(notebook_module_path, "static", "custom")
	

	if nb_path != None:
		install_path = nb_path
		print("Using argument supplied path: " + install_path)

	if DEBUG:
		print(install_path)

	# copy js into static/custom directory in Jupyter/iPython directory
	if path.isdir(install_path):
		custom_js = path.join(install_path, 'custom.js')
		hide_code_js = path.join(install_path, 'hide_code.js')

		try:
			if path.exists(custom_js):
				with open(path.join(current_dir, "auto-load.txt")) as auto:
					auto_load_txt = auto.read();
					auto_loaded = False
					text = None

					# check if auto-load.txt is already in custom.js
					with open(custom_js, 'r') as customJS:
						text = customJS.read()
						if auto_load_txt in text:
							text = text.replace(auto_load_txt, '')
							auto_loaded = True

					if auto_loaded:
						with open(custom_js, 'w') as customJS:
							customJS.write(text)
							print("Successfully removed auto-loaded javascript.")

			if path.exists(hide_code_js):
				os.remove(hide_code_js)
				print("Successfully removed hide_code.js")

		except:
			pass

	if server_config:
		print("Attempting to remove auto-loading for hide_code export handlers.")
		try:
			# Activate the Python server extension
			server_cm = ConfigManager(config_dir=j_path.jupyter_config_dir())
			cfg = server_cm.get('jupyter_notebook_config')
			server_extensions = (cfg.setdefault('NotebookApp', {})
				.setdefault('server_extensions', [])
				)
			extension = 'hide_code.hide_code'
			if extension in server_extensions:
				cfg['NotebookApp']['server_extensions'] = None
				server_cm.update('jupyter_notebook_config', cfg)
				print('Successfully removed auto-loaded hide_code export handlers.')
			else:
				print("No hide_code server extensions to remove.")
		except:
			print("No hide_code server extensions to remove.")


def install_bootstrapped_files(nb_path=None, server_config=True, DEBUG=False):
	"""
	Installs javascript and exporting server extensions in Jupyter notebook.

	Args:
		nb_path (string): Path to notebook module.
		server_config (boolean): Install exporting server extensions.
		DEBUG (boolean): Verbose mode.
	"""

	install_path = None
	print('Starting hide_code.js install...')
	current_dir = path.abspath(path.dirname(__file__))
	config_dirs = j_path.jupyter_config_path()
	notebook_module_path = Utils.get_notebook_module_dir()

	# check for config directory with a "custom" folder
	# TODO update this logic to check if custom.js file exists
	for dir in config_dirs:
		custom_dir = path.join(dir, "custom")
		if path.isdir(custom_dir):
			install_path = custom_dir
			break

	# last ditch effort in case jupyter config directories don't contain custom/custom.js		
	if install_path == None:	
		print("No config directories contain \"custom\" folder. Trying Jupyter notebook module path...")	
		install_path = path.join(notebook_module_path, "static", "custom")
	

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
		print("Attempting to configure custom.js to auto-load hide_code.js...")
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

def route_pattern_for(exporter):
	pattern = ''
	for i in range(1, hc_config.get('nested_params_depth')):
		pattern += '(/[^/]*)?'

	return url_path_join(base_url, 'notebooks/([^/]+)' + pattern, 'export', exporter)

def notebook_name(params):
	"""
	Returns notebook name without .ipynb extension.
	"""
	args = [param.replace('/','') for param in params if param is not None]
	return args[-1][:-6]

def ipynb_file_name(params):
	"""
	Returns OS path to notebook based on route parameters. 
	"""
	p = [param.replace('/','') for param in params if param is not None]
	return path.join(*p)

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
	for (dirpath, dirnames, filenames) in os.walk(path.join(Utils.get_module_dir())):
		files.extend(filenames)
		break	

	custom_js = ''
	with open(path.join(Utils.get_notebook_module_dir(), 'static','custom','custom.js'), 'r') as f:
		for line in iter(f):
			if not line.startswith(' *') and not line.startswith('/'):
				custom_js = custom_js + line + ' '


	return ("Installation dir: {0}\nConfiguration dir: {1}\nExport handler extensions: {2}\nHide Code files: {3}\nCustom JS contents: {4}"
		.format(Utils.get_module_dir(), j_path.jupyter_config_dir(), ext, files, custom_js))

