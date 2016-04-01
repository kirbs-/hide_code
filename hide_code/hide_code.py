import os
from os import path
import shutil
import jupyter_core.paths as j_path
from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler
import nbformat
from traitlets.config import Config
from .hide_code_html_exporter import HideCodeHTMLExporter

notebook_dir = ""

class HideCodeHTMLExportHandler(IPythonHandler):
    def get(self, nb_name):
    	with open(path.join(notebook_dir, nb_name)) as f:
    		nb = nbformat.reads(f.read(), as_version=4)
    		exporter = HideCodeHTMLExporter()
    		output_html, resources = exporter.from_notebook_node(nb)
        self.finish(output_html)


def __main__():
	install()

def load_jupyter_server_extension(nb_app):
    web_app = nb_app.web_app
    notebook_dir = nb_app.notebook_dir
    host_pattern = '.*$'
    route_pattern = url_path_join(web_app.settings['base_url'], 'notebooks/([^/]+)/export')
    web_app.add_handlers(host_pattern, [(route_pattern, HideCodeHTMLExportHandler)])


def install(nb_path=None, DEBUG=False):
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
		install_path = path.join(site_packages_path, "notebook/static/custom")
	

	if nb_path != None:
		install_path = nb_path
		print("Using argument supplied path: " + install_path)

	if DEBUG:
		print(install_path)

	# copy js into static/custom directory in Jupyter/iPython directory
	if(path.isdir(install_path)):
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

def get_site_package_dir():
	os_file = os.__file__
	if os_file.endswith('c'):
		return path.join(os_file[:-7], "site-packages")
	else:
		return path.join(os_file[:-6], "site-packages")