import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette, MainAreaWidget
} from '@jupyterlab/apputils';

import {
  Widget
} from '@lumino/widgets';

// import { requestAPI } from './hidecodelab';

/**
 * Initialization data for the hide_code_lab extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'hide-code-lab',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension jupyterlab_apod is activated!');
    console.log('ICommandPalette:', palette);
    // Create a blank content widget inside of a MainAreaWidget
    const content = new Widget();
    const widget = new MainAreaWidget({content});
    widget.id = 'apod-jupyterlab';
    widget.title.label = 'Astronomy Picture';
    widget.title.closable = true;

    // Add an application command
    const command: string = 'apod:open';
    app.commands.addCommand(command, {
      label: 'Random Astronomy Picture',
      execute: () => {
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({command, category: 'Tutorial'});
    }
  // activate: (app: JupyterFrontEnd) => {
  //   console.log('JupyterLab extension hide-code-lab is activated!');

  //   requestAPI<any>('get_example')
  //     .then(data => {
  //       console.log(data);
  //     })
  //     .catch(reason => {
  //       console.error(
  //         `The hide_code_lab server extension appears to be missing.\n${reason}`
  //       );
  //     });
  // }
};

export default extension;
