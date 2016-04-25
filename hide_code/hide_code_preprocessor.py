from nbconvert.preprocessors import *
from traitlets.log import get_logger

class HideCodePreprocessor(Preprocessor):

    # def __init__(self, *args, **kwargs):
    # 	get_logger().debug(
    #             "Initiated HideCodePreprocessor"
    #     	)
    # 	super(HideCodePreprocessor, self).__init__(*args, **kwargs)

    # def preprocess(self, nb, resources):
    # 	get_logger().debug(
    #             "Preprocess triggered."
    #     	)
    # 	return super(HideCodePreprocessor, self).preprocess(nb, resources)

	def preprocess_cell(self, cell, resources, index):

        # cell.source = 'It works! ' + cell.source
		# try:
		# 	if cell.metadata['hideCode'] and cell.cell_type != 'markdown':
		# 		cell.source = ''
		# except:
		# 	pass

		# try:	
		# 	if cell.metadata['hidePrompt']:
		# 		cell.execution_count = None
		# 		cell.output.execution_count = None
		# except:
		# 	pass

		return cell, resources
