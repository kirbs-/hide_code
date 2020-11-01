import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
//   ILayoutRestorer
} from '@jupyterlab/application';

import { 
    ToolbarButton, 
    ICommandPalette
    // WidgetTracker 
} from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';

import {
  NotebookPanel,
  INotebookModel,
  INotebookTracker
} from '@jupyterlab/notebook';

import {
    CodeCell
    // Cell
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
  requires:[ICommandPalette, INotebookTracker],
  activate
};

export class HideCodeLabExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

    // _panel: NotebookPanel;
    tracker: INotebookTracker;

    constructor(tracker: INotebookTracker){
        this.tracker = tracker;
    }

  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    // this.tracker.currentChanged.connect(() => { console.log('changed'); this.open() });
    // this.tracker.widgetAdded.connect(() => {console.log('widget added'); this.open() });
    // this._panel = panel;

    const toggleInput = () => {      
      panel.content.widgets.filter(cell => panel.content.isSelectedOrActive(cell)).forEach(cell => {
        if (cell.model.type === 'code') {
            if (cell.inputArea.isHidden) {
                cell.inputArea.show()
                cell.model.metadata.set('hideInput', false);
            } else {
                cell.inputArea.hide()
                cell.model.metadata.set('hideInput', true);
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
                  codeCell.model.metadata.set('hideOutput', false);
              } else {
                codeCell.outputArea.hide()
                codeCell.model.metadata.set('hideOutput', true);
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
            if (l.widgets[0].node.classList.contains('hidden')) {
                l.widgets[0].node.classList.remove('hidden');
                cell.model.metadata.set('hidePrompt', false);
            } else {
                l.widgets[0].node.classList.add('hidden');
                cell.model.metadata.set('hidePrompt', true);
            }
            // l.widgets[0].node.classList.toggle('hidden');
            // cell.promptNode.classList.toggle('hidden');
            
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
        hideOPromptsButton.dispose();
    });
  };

  setInput(cell: any): void {
    if (cell.model.metadata.get('hideInput')) {
        cell.inputArea.hide()
    } else {
        cell.inputArea.show()
    };
  };

  setOutput(cell: any): void {
    const codeCell = cell as CodeCell;
    if (codeCell.model.metadata.get('hideOutput')) {
        codeCell.outputArea.hide();
    } else {
      codeCell.outputArea.show();
    };
  };

  setPrompt(cell: any): void {
    const codeCell = cell as CodeCell;
    let prompt = codeCell.outputArea.widgets[0] as Widget;
    if (prompt != undefined){
      let l = prompt.layout as PanelLayout;
      if (codeCell.model.metadata.get('hidePrompt')) {
          l.widgets[0].node.classList.add('hidden');
      } else {
          l.widgets[0].node.classList.remove('hidden');
      };
    }
  };

  open(): void {
      this.tracker.forEach(notebook => {
        notebook.content.widgets.forEach(cell => {
          this.setInput(cell);
          this.setOutput(cell);
          this.setPrompt(cell);
        });
      });
  };
}

function activate(app: JupyterFrontEnd, palette: ICommandPalette, tracker: INotebookTracker) {
    let hc = new HideCodeLabExtension(tracker);
    app.docRegistry.addWidgetExtension('Notebook', hc);

    const command: string = 'hide_code:open';
    app.commands.addCommand(command, {
        label: 'Hide code open',
        execute: () => {
            hc.open();
        }
    });

    palette.addItem({
        command, 
        category: "Hide Code"
    });

    tracker.activeCellChanged.connect(() => {hc.open()});
}

export default plugin;
