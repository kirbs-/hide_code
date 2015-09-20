import os
from os import path
import shutil


def __main__():
	install()


def install(nb_path=None, DEBUG=False):
	print 'Starting hide_code.js install'
	current_dir = path.abspath(path.dirname(__file__))
	site_packages_path = os.__file__[:-6] + "site-packages"

	#check notebook path

	install_path = site_packages_path + "/notebook/static/custom"

	if nb_path != None:
		install_path = np_path
		print "Using " + install_path

	if DEBUG:
		print install_path

	# copy js into static/custom directory in Jupyter/iPython directory
	if(path.isdir(install_path)):
		shutil.copyfile(current_dir + "/hide_code.js", install_path + "/hide_code.js")
		print 'Copying hide_code.js to ' + install_path 

		# add require to end of custom.js to auto-load on notebook startup
		with open(install_path + "/custom.js", 'a') as customJS:
			with open(current_dir + "/auto-load.txt") as auto:
				customJS.write(auto.read())
				print "Configured custom.js to auto-load hide_code.js"
	else:
		print 'Unable to install into ' + install_path
		print 'Directory doesn\' exist.'
		print 'Make sure Jupyter is installed.'