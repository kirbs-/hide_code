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

import {
    CodeCell
} from '@jupyterlab/cells';

import {
    Widget,
    PanelLayout
} from '@lumino/widgets';

// import { PanelLayout } from '@lumino/widgets';

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

    // panel.content.widgets.forEach(cell => {
    //     console.log(cell.model.metadata);
    // });

    console.log(panel.content.model.cells);

    panel.content.widgets.forEach(cell => (
        console.log(cell.model.metadata)
    ));

    const toggleInput = () => {      
      panel.content.widgets.filter(cell => panel.content.isSelectedOrActive(cell)).forEach(cell => {
        if (cell.model.type === 'code') {
            if (cell.inputArea.isHidden) {
                cell.inputArea.show()
            } else {
                cell.inputArea.hide()
            };
          }
      });
    };

    const toggleOutput = () => {      
        panel.content.widgets.filter(cell => panel.content.isSelectedOrActive(cell)).forEach(cell => {
          if (cell.model.type === 'code') {
              const codeCell = cell as CodeCell;
              if (codeCell.outputArea.isHidden) {
                  codeCell.outputArea.show()
              } else {
                codeCell.outputArea.hide()
              };
            }
        });
  
      };

      const togglePrompts = () => {      
        panel.content.widgets.filter(cell => panel.content.isSelectedOrActive(cell)).forEach(cell => {
          if (cell.model.type === 'code') {
            const codeCell = cell as CodeCell;
            let prompt = codeCell.outputArea.widgets[0] as Widget;
            let l = prompt.layout as PanelLayout;
            l.widgets[0].node.classList.toggle('hidden');
            cell.promptNode.classList.toggle('hidden');
            cell.model.metadata.set('hide_code.hide_prompt', true);
            }
        });
  
      };

    const hideInputButton = new ToolbarButton({
      className: 'hcButton',
      iconClass: 'fa fa-sm fa-terminal fontawesome-colors',
      onClick: toggleInput,
      tooltip: 'Hide Input'
    });

    const hideOutputButton = new ToolbarButton({
      className: 'hcButton',
      iconClass: 'fa fa-sm fa-code fontawesome-colors',
      onClick: toggleOutput,
      tooltip: 'Show Output'
    });

    const hideOPromptsButton = new ToolbarButton({
        className: 'hcButton',
        iconClass: 'fa fa-sm fc-output fontawesome-colors',
        onClick: togglePrompts,
        tooltip: 'Show Prompts'
      });

    panel.toolbar.insertItem(11, 'hideInput', hideInputButton);
    panel.toolbar.insertItem(12, 'hideOutput', hideOutputButton);
    panel.toolbar.insertItem(13, 'hidePrompt', hideOPromptsButton);
    console.log('Hide code JupyterLab extension is activated!');

    return new DisposableDelegate(() => {
        hideInputButton.dispose();
        hideOutputButton.dispose();
    });
  }
}

function activate(app: JupyterFrontEnd) {
  app.docRegistry.addWidgetExtension('Notebook', new HideCodeLabExtension());
}

export default plugin;
