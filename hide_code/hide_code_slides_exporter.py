import os
import os.path
from nbconvert.exporters.slides import SlidesExporter


class HideCodeSlidesExporter(SlidesExporter):

    def __init__(self, config=None, **kw):
        super(HideCodeSlidesExporter, self).__init__(config, **kw)
        self.preprocessors = ['hide_code.HideCodePreprocessor']
        self._init_preprocessors()

    export_from_notebook = 'Hide Code Slides'

    def _template_file_default(self):
        return 'hide_code_slides.tpl'

    @property
    def template_path(self):
        """
        We want to inherit from HTML template, and have template under
        `./templates/` so append it to the search path. (see next section)
        """
        return super(HideCodeSlidesExporter, self).template_path + [os.path.join(os.path.dirname(__file__), "Templates")]

    @property
    def template_paths(self):
        """
        We want to inherit from HTML template, and have template under
        ``./templates/`` so append it to the search path. (see next section)
        Note: nbconvert 6.0 changed ``template_path`` to ``template_paths``
        """
        return super()._template_paths() + [os.path.join(os.path.dirname(__file__), "Templates")]