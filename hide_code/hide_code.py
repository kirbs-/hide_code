import os
from os import path
import shutil
import jupyter_core.paths as j_path


def __main__():
	install()


def install(nb_path=None, DEBUG=False):
	install_path = None
	print('Starting hide_code.js install')
	current_dir = path.abspath(path.dirname(__file__))
	config_dirs = j_path.jupyter_config_path()
	site_packages_path = path.join(os.__file__[:-7], "site-packages")

	# check for config directory with a "custom" folder
	for dir in config_dirs:
		if path.isdir(path.join(dir, "custom")):
			install_path = path.join(dir, "custom")
			break

	# last ditch effort incase jupyter config isn't 		
	if install_path == None:	
		print("No config directories contain \"custom\" folder. Trying site-packages...")	
		install_path = path.join(site_packages_path, "notebook/static/custom")
	

	if nb_path != None:
		install_path = nb_path
		print("Using " + install_path)

	if DEBUG:
		print(install_path)

	# copy js into static/custom directory in Jupyter/iPython directory
	if(path.isdir(install_path)):
		shutil.copyfile(path.join(current_dir, "hide_code.js"), path.join(install_path, "hide_code.js"))
		print('Copying hide_code.js to ' + install_path) 

		# add require to end of custom.js to auto-load on notebook startup
		with open(path.join(install_path, "custom.js"), 'a') as customJS:
			with open(path.join(current_dir, "auto-load.txt")) as auto:
				customJS.write(auto.read())
				print("Configured custom.js to auto-load hide_code.js")
	else:
		print('Unable to install into ' + install_path)
		print('Directory doesn\'t exist.')
		print('Make sure Jupyter is installed.')