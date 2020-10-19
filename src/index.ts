import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './hidecodelab';

/**
 * Initialization data for the hide_code_lab extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'hide-code-lab',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension hide-code-lab is activated!');

    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The hide_code_lab server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default extension;
