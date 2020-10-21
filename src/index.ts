import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ToolbarButton } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  NotebookPanel,
  INotebookModel
} from '@jupyterlab/notebook';

import { PanelLayout } from '@lumino/widgets';

// import '../style/index.css';

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'hide_code_lab:',
  autoStart: true,
  activate
};

export class HideCodeLabExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const hideInputCode = () => {
    //   NotebookActions.runAll(panel.content, context.sessionContext);

    //   panel.content.widgets.forEach(cell => {
    //     if (cell.model.type === 'code') {
    //       const layout = cell.layout as PanelLayout;
    //       layout.widgets[1].hide();
    //     }
    //   });
      

      panel.content.widgets.filter(cell => panel.content.isSelectedOrActive(cell)).forEach(cell => {
        if (cell.model.type === 'code') {
            const layout = cell.layout as PanelLayout;
            layout.widgets[1].hide();
          }
      });

      buttonHideInput.hide();
      buttonShowInput.show();
    };
    const showInputCode = () => {
    //   panel.content.widgets.forEach(cell => {
    //     if (cell.model.type === 'code') {
    //       const layout = cell.layout as PanelLayout;
    //       layout.widgets[1].show(); // 1 is code part of code cell, 2 is output part
    //     }
    //   });

      panel.content.widgets.filter(cell => panel.content.isSelectedOrActive(cell)).forEach(cell => {
        if (cell.model.type === 'code') {
            const layout = cell.layout as PanelLayout;
            layout.widgets[1].show();
          }
      });

      buttonHideInput.show();
      buttonShowInput.hide();
    };

    const buttonHideInput = new ToolbarButton({
      className: 'hcButton',
      iconClass: 'fa fa-sm fa-code fontawesome-colors',
      onClick: hideInputCode,
      tooltip: 'Hide Input'
    });

    const buttonShowInput = new ToolbarButton({
      className: 'hcButton',
      iconClass: 'fa fa-sm fa-file-code fontawesome-colors',
      onClick: showInputCode,
      tooltip: 'Show Input'
    });

    buttonShowInput.hide();

    panel.toolbar.insertItem(11, 'hideInput', buttonHideInput);
    panel.toolbar.insertItem(11, 'showInput', buttonShowInput);
    console.log('Hide code JupyterLab extension is activated!');

    return new DisposableDelegate(() => {
      buttonHideInput.dispose();
      buttonShowInput.dispose();
    });
  }
}

function activate(app: JupyterFrontEnd) {
  app.docRegistry.addWidgetExtension('Notebook', new HideCodeLabExtension());
}

export default plugin;
