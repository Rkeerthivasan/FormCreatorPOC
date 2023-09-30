import { Component, ViewEncapsulation, ViewChild,Inject } from '@angular/core';
import { ConnectorConstraints, DiagramComponent, DiagramTools, IExportOptions, IHistoryChangeArgs, ISelectionChangeEventArgs, NodeConstraints, ZoomOptions } from '@syncfusion/ej2-angular-diagrams';
import { ToolbarComponent } from '@syncfusion/ej2-angular-navigations';
import { ClickEventArgs, ItemModel, MenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import {
  Diagram, NodeModel, UndoRedo, ConnectorModel, PointPortModel, Connector, FlowShapeModel,
  SymbolInfo, IDragEnterEventArgs, SnapSettingsModel, MarginModel, TextStyleModel, StrokeStyleModel,
  OrthogonalSegmentModel, Node, PaletteModel, IDropEventArgs, ICollectionChangeEventArgs, cloneObject
} from '@syncfusion/ej2-diagrams';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { ExpandMode } from '@syncfusion/ej2-navigations';
import { AsyncSettingsModel } from '@syncfusion/ej2-inputs';
import { TextBoxComponent, NumericTextBoxComponent } from '@syncfusion/ej2-angular-inputs';
Diagram.Inject(UndoRedo);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // specifies the template string for the Diagram component
  
  encapsulation: ViewEncapsulation.None
})


export class AppComponent{
  @ViewChild('diagram')
  //Diagram Properties
  public diagram!: DiagramComponent;
  @ViewChild('toolbar')
  public toolbar!: ToolbarComponent;
 ​​​​​​​


  public margin: MarginModel = { left: 25, right: 25 };
  public connAnnotStyle: TextStyleModel = { fill: 'white' };
  public strokeStyle: StrokeStyleModel = { strokeDashArray: '2,2' };

  public segments: OrthogonalSegmentModel = [{ type: 'Orthogonal', direction: 'Top', length: 120 }];
  public segments1: OrthogonalSegmentModel = [
    { type: 'Orthogonal', direction: 'Right', length: 100 }
  ];
  public drawingObject : any;
  public asyncSettings: AsyncSettingsModel = {
    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
};

  public nodeDefaults(node: NodeModel): NodeModel {
    if(node.constraints)
      node.constraints = NodeConstraints.Default | NodeConstraints.ReadOnly;
    return node;
  }
  public connDefaults(obj: Connector): void {
    if (obj.id.indexOf('connector') !== -1) {
      obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
    }
  }
  public onChangeText(args: any): void {
    if(this.diagram.selectedItems.nodes){
      this.diagram.selectedItems.nodes[0].addInfo=args.currentTarget.value;
    }
  }
  public onChangeMaleCheckbox(args: any): void {
    if(this.diagram.selectedItems.nodes){
      this.diagram.selectedItems.nodes[0].addInfo=
      {
        isMaleChecked:args.currentTarget.checked
      };
    }
  }
  public onChangeFemaleCheckbox(args: any): void {
    if(this.diagram.selectedItems.nodes){
      this.diagram.selectedItems.nodes[0].addInfo=
      {
        isFemaleChecked:args.currentTarget.checked
      };
    }
  }
  
  public created(): void {
    //this.diagram.fitToPage();
  }
  public interval: number[] = [
    1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25,
    9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75
  ];
private isDragEnter: boolean = false;
  public snapSettings: SnapSettingsModel = {
    horizontalGridlines: { lineColor: '#e0e0e0', lineIntervals: this.interval },
    verticalGridlines: { lineColor: '#e0e0e0', lineIntervals: this.interval }
  };

  public collectionChangeEvent(args: ICollectionChangeEventArgs): void 
  {
  if(this.isDragEnter && args.type==='Addition' && args.state==='Changing')
  {
    let obj: NodeModel = args.element as NodeModel;
    args.cancel=true;
    this.isDragEnter=false;
    var node:NodeModel=cloneObject(obj);
    node.shape={type:'HTML'};
    this.diagram.add(node);
    
  }
}
  public dragEnter(args: IDragEnterEventArgs): void {
     let obj: NodeModel = args.element as NodeModel;
    if (obj && obj.width && obj.height) {
      this.isDragEnter=true;
      let oWidth: number = obj.width;
      let oHeight: number = obj.height;
      let ratio: number = 70 / obj.width;
      obj.width = 100;
      obj.shape= {type:'HTML'};
      obj.height *= ratio;
      if(obj.offsetX!== undefined)
      obj.offsetX += (obj.width - oWidth) / 2;
      if(obj.offsetY!== undefined)
      obj.offsetY += (obj.height - oHeight) / 2;
      obj.style = { fill: '#357BD2', strokeColor: 'white' };
    }
  }
  public drop(args: IDropEventArgs): void {

  }
  
public textBoxvalue(data:any):string
{
  return data.addInfo? data.addInfo:'';
}
public checkboxMaleValue(data:any):boolean
{
  return data.addInfo? data.addInfo.isMaleChecked:false;
}
public comboboxvalue(data:any):string
{
  return data.addInfo? data.addInfo:'India';
}
public onChangeCombobox(args:any):void
{
  if(this.diagram.selectedItems.nodes){
    this.diagram.selectedItems.nodes[0].addInfo=args.currentTarget.value;
  }
}
public checkboxFemaleValue(data:any):boolean
{
  return data.addInfo? data.addInfo.isFemaleChecked:false;
}
  //SymbolPalette Properties
  public symbolMargin: MarginModel = { left: 15, right: 15, top: 15, bottom: 15 };
  public expandMode: ExpandMode = 'Multiple';
  //Initialize the flowshapes for the symbol palatte
  
  private  htmlShapes:NodeModel[]  = [{
    id: 'button',
    borderColor: 'transparent',
    borderWidth: 1,
    shape: {
        type: 'HTML',
        content: '<div style="height:100%;width:100%;"><button style="height:100%;width:100%;" ejs-button>Submit</button></div>'
    }
},
{
  id: 'textbox',
  borderColor: 'transparent',
  borderWidth: 1,
  shape: {
      type: 'HTML',
      content: '<div style="height:100%;width:100%;"><input style="height:100%;width:100%;" type="textbox" ></input></div>'
  }
},
{
    id: 'checkbox',
    borderColor: 'transparent',
    borderWidth: 1,
    shape: {
        type: 'HTML',
        content: '<div><div style="height:50%;width:100%;"><input type="checkbox" value="Male" style="width:25%">Male</input></div>' +
            '<div style="height:50%;width:100%;"><input type="checkbox" value="Female" style="width:25%">Female</input></div></div>'
    }
},
{
    id: 'combobox',
    borderColor: 'transparent',
    borderWidth: 1,
    shape: {
        type: 'HTML',
        content: '<div style="height:100%;width:100%;"><select style="width:100%"><option>India</option><option>US</option></select></div>'
    }
},
];

 

  public palettes: PaletteModel[] = [
    {
      id: 'flow',
      expanded: true,
      symbols: this.htmlShapes,
      iconCss: 'shapes',
      title: 'Shapes'
    },
    
  ];

  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
    return { fit: true };
  }

  public getSymbolDefaults(symbol: NodeModel): void {
    if(symbol.style!== undefined)
    symbol.style.strokeColor = '#757575';
    symbol.width = 50;
      symbol.height = 50;
  }
  public selectionChange(args: ISelectionChangeEventArgs): void {
    if(args.state === 'Changed'){
      var selectedItems:any = this.diagram.selectedItems.nodes;
          selectedItems =  selectedItems.concat(this.diagram.selectedItems.connectors as any);
      if(selectedItems.length===0){
          this.toolbar.items[6].disabled = true;
          this.toolbar.items[7].disabled = true;
          this.toolbar.items[19].disabled = true;
          this.toolbar.items[20].disabled = true;
          this.toolbar.items[25].disabled = true;
          this.toolbar.items[29].disabled = true;
          this.toolbar.items[31].disabled = true;
          this.disableMultiselectedItems();
      }
      if(selectedItems.length === 1){

          this.enableItems();
          this.disableMultiselectedItems();

          if(selectedItems[0].children !== undefined && selectedItems[0].children.length>0){
              this.toolbar.items[27].disabled = false;
          }
          else{
              this.toolbar.items[27].disabled = true;
          }

      }

      if(selectedItems.length > 1){
         this.enableItems();
          this.toolbar.items[22].disabled = false;
          this.toolbar.items[23].disabled = false;
          this.toolbar.items[27].disabled = false;
          if(selectedItems.length>2){
          this.toolbar.items[23].disabled = false;
          }
          else{
          this.toolbar.items[23].disabled = true;
          }
      }

  }
}
public historyChange(args: IHistoryChangeArgs): void {
  if(this.diagram.historyManager.undoStack!==undefined && this.diagram.historyManager.undoStack.length>0){
    this.toolbar.items[10].disabled = false;
}
else{
    this.toolbar.items[10].disabled = true;
}
if(this.diagram.historyManager.redoStack!==undefined && this.diagram.historyManager.redoStack.length>0){
    this.toolbar.items[11].disabled = false;
}
else{
    this.toolbar.items[11].disabled = true;
}
}
public enableItems()
{
    this.toolbar.items[6].disabled = false;
    this.toolbar.items[7].disabled = false;
    this.toolbar.items[19].disabled = false;
    this.toolbar.items[20].disabled = false;
    this.toolbar.items[25].disabled = false;
    this.toolbar.items[29].disabled = false;
    this.toolbar.items[31].disabled = false;
}
public disableMultiselectedItems()
{
    this.toolbar.items[22].disabled = true;
    this.toolbar.items[23].disabled = true;
    this.toolbar.items[27].disabled = true;
}

public clicked(args : ClickEventArgs){
  var item = (args as any).item.tooltipText;
  switch(item)
  {
      case 'Undo':
          this.diagram.undo();
          break;
      case 'Redo':
          this.diagram.redo();
          break;
      case 'Lock':
         this.lockObject();
          break;
      case 'Cut':
      this.diagram.cut();
          this.toolbar.items[8].disabled = false;
          break;
      case 'Copy':
      this.diagram.copy();
      this.toolbar.items[8].disabled = false;
          break;
      case 'Paste':
      this.diagram.paste();
          break;
      case'Delete':
      this.diagram.remove();
          break;
      case 'Select Tool':
      this.diagram.clearSelection();
      this.diagram.tool = DiagramTools.Default;
          break;
      case 'Text Tool':
      this.diagram.clearSelection();
      this.diagram.selectedItems.userHandles = [];
      this.diagram.drawingObject = { shape: { type: 'Text' }, };
      this.diagram.tool = DiagramTools.ContinuousDraw;
          break;
      case 'Pan Tool':
      this.diagram.clearSelection();
      this.diagram.tool = DiagramTools.ZoomPan;
          break;
      case 'New Diagram':
      this.diagram.clear();
          this.historyChange(args as any);
          break;
      case 'Print Diagram':
          this.printDiagram(args);
          break;
      case 'Save Diagram':
          this.download(this.diagram.saveDiagram());
          break;
      case 'Open Diagram':
        debugger
        document.getElementsByClassName('e-file-select-wrap')[0]?.querySelector('button')?.click();
        break;
  }
  this.diagram.dataBind();
}


public zoomMenuItems = [
  { text: 'Zoom In' },
  { text: 'Zoom Out' },{ text: 'Zoom to Fit' },
  { text: 'Zoom to 50%' },
  { text: 'Zoom to 100%' },
  { text: 'Zoom to 200%' },
]

// To perform zoom operation
public zoomChange(args:any){
      var currentZoom:number = this.diagram.scrollSettings.currentZoom!== undefined ?this.diagram.scrollSettings.currentZoom:1;
      var zoom : ZoomOptions = {};
      switch (args.item.text) {
          case 'Zoom In':
              this.diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
              break;
          case 'Zoom Out':
          this.diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
              break;
          case 'Zoom to Fit':
            zoom.zoomFactor = 1 / currentZoom - 1;
            this.diagram.zoomTo(zoom);
              break;
              case 'Zoom to 50%':
              if(currentZoom === 0.5){
                currentZoom = 0;
                zoom.zoomFactor = (0.5 / currentZoom) - 1;
                this.diagram.zoomTo(zoom);

              }
              else{
                zoom.zoomFactor = (0.5 / currentZoom) - 1;
                this.diagram.zoomTo(zoom);
              }
              break;

          case 'Zoom to 100%':
              if(currentZoom === 1){
                currentZoom = 0;
                zoom.zoomFactor = (1 / currentZoom) - 1;
                this.diagram.zoomTo(zoom);
              }
              else{
                zoom.zoomFactor = (1 / currentZoom) - 1;
                this.diagram.zoomTo(zoom);
              }
              break;
          case 'Zoom to 200%':
              if(currentZoom === 2){
                currentZoom = 0;
                zoom.zoomFactor = (2 / currentZoom) - 1;
                this.diagram.zoomTo(zoom);
              }
              else{
                zoom.zoomFactor = (2 / currentZoom) - 1;
                this.diagram.zoomTo(zoom);
              }
              break;
      }
}

public onConnectorSelect(args : any){
  debugger
  this.diagram.clearSelection();
  this.diagram.drawingObject = {type:args.item.text};
  this.diagram.tool = DiagramTools.ContinuousDraw;
  this.diagram.selectedItems.userHandles = [];
  this.diagram.dataBind();
}
public conTypeItems = [
  {text: 'Straight',iconCss: 'e-icons e-line'},
  {text: 'Orthogonal',iconCss: 'sf-icon-orthogonal'},
  {text: 'Bezier',iconCss: 'sf-icon-bezier'}
 ];

 public shapesItems = [
  {text: 'Rectangle',iconCss: 'e-rectangle e-icons'},
   {text: 'Ellipse',iconCss: ' e-circle e-icons'},
   {text: 'Polygon',iconCss: 'e-line e-icons'}
];

public onShapesSelect(args:any){
  this.diagram.clearSelection();
  this.diagram.drawingObject = {shape:{shape:args.item.text}};
  this.diagram.tool = DiagramTools.ContinuousDraw;
  this.diagram.selectedItems.userHandles = [];
  this.diagram.dataBind();
}
//Export the diagraming object based on the format.

public groupItems = [
  {text:'Group',iconCss:'e-icons e-group-1'},
  {text:'Ungroup',iconCss:'e-icons e-ungroup-1'}
];
public onSelectGroup(args:any){
  if(args.item.text === 'Group'){
    this.diagram.group();
  }
  else if(args.item.text === 'Ungroup'){
    this.diagram.unGroup();
  }
}

public alignItems = [
  {
      iconCss: 'sf-icon-align-left-1', text: 'Align Left',
  },
  {
      iconCss: 'sf-icon-align-center-1', text: 'Align Center',
  },
  {
      iconCss: 'sf-icon-align-right-1', text: 'Align Right',
  },
  {
      iconCss: 'sf-icon-align-top-1', text: 'Align Top',
  },
  {
      iconCss: 'sf-icon-align-middle-1', text: 'Align Middle',
  },
  {
      iconCss: 'sf-icon-align-bottom-1', text: 'Align Bottom',
  },
];

public onSelectAlignObjects(args:any){
  var item = args.item.text;
  var alignType = item.replace('Align', '');
  var alignType1 = alignType.charAt(0).toUpperCase() + alignType.slice(1);
  this.diagram.align(alignType1.trim());
}
public distributeItems = [
  { iconCss: 'sf-icon-distribute-vertical', text: 'Distribute Objects Vertically',},
  { iconCss: 'sf-icon-distribute-horizontal', text: 'Distribute Objects Horizontally',},
];

public onSelectDistributeObjects(args:any){
  if(args.item.text === 'Distribute Objects Vertically'){
    this.diagram.distribute('BottomToTop');
  }
  else{
    this.diagram.distribute('RightToLeft');
  }
}

public orderItems = [
  { iconCss: 'e-icons e-bring-forward', text: 'Bring Forward'},
  { iconCss: 'e-icons e-bring-to-front', text: 'Bring To Front'},
  { iconCss: 'e-icons e-send-backward', text: 'Send Backward'},
  { iconCss: 'e-icons e-send-to-back', text: 'Send To Back'}
];
public onSelectOrder(args:any){
  switch(args.item.text){
      case 'Bring Forward':
          this.diagram.moveForward();
      break;
      case 'Bring To Front':
          this.diagram.bringToFront();
      break;
      case 'Send Backward':
          this.diagram.sendBackward();
      break;
      case 'Send To Back':
         this.diagram.sendToBack();
      break;
  }
}

public rotateItems = [
    {iconCss:'e-icons e-transform-right',text: 'Rotate Clockwise'},
    {iconCss:'e-icons e-transform-left',text: 'Rotate Counter-Clockwise'}
];


public onSelectRotate(args:any){
  if(args.item.text === 'Rotate Clockwise'){
    this.diagram.rotate(this.diagram.selectedItems,90);
  }
  else{
    this.diagram.rotate(this.diagram.selectedItems,-90);
  }
}

public flipItems = [
  {iconCss:'e-icons e-flip-horizontal',text: 'Flip Horizontal'},
  {iconCss:'e-icons e-flip-vertical',text: 'Flip Vertical'}
];
public onSelectFlip(args:any){
  this.flipObjects(args.item.text);
}

// To flip diagram objects
public flipObjects(flipType:any)
{
  var selectedObjects =this.diagram.selectedItems.nodes!==undefined && this.diagram.selectedItems.nodes.concat(this.diagram.selectedItems.connectors as any);
if(selectedObjects)
{
  for( let i : number=0; i< selectedObjects.length;i++)
{
  selectedObjects[i].flip = flipType === 'Flip Horizontal'? 'Horizontal':'Vertical';
}
}
this.diagram.dataBind();
}
public lockObject () {
  if(this.diagram.selectedItems.nodes){
  for (let i : number = 0; i < this.diagram.selectedItems.nodes.length; i++) {
      let node = this.diagram.selectedItems.nodes[i];
      if (node.constraints && node.constraints & NodeConstraints.Drag) {
          node.constraints = NodeConstraints.PointerEvents | NodeConstraints.Select;
      } else {
          node.constraints = NodeConstraints.Default;
      }
  }
}
if(this.diagram.selectedItems.connectors){
  for (let j : number = 0; j < this.diagram.selectedItems.connectors.length; j++) {
      let connector = this.diagram.selectedItems.connectors[j];
      if (connector.constraints && connector.constraints & ConnectorConstraints.Drag) {
          connector.constraints = ConnectorConstraints.PointerEvents | ConnectorConstraints.Select;
      } else {
          connector.constraints = ConnectorConstraints.Default;
      }
  }
}
  this.diagram.dataBind();
}
public zoomContent()
{
  if(this.diagram.scrollSettings.currentZoom)
    return Math.round(this.diagram.scrollSettings.currentZoom*100) + ' %'
    return '100 %';
};
public printDiagram(args:any){
  var options : IExportOptions = {};
  options.mode = 'Download';
  options.region = 'Content';
  options.multiplePage = this.diagram.pageSettings.multiplePage;
  options.pageHeight = this.diagram.pageSettings.height;
  options.pageWidth = this.diagram.pageSettings.width;
  this.diagram.print(options);
  }
  public onselectExport(args:any) {
    var exportOptions : IExportOptions = {};
    exportOptions.format = args.item.text;
    exportOptions.mode = 'Download';
    exportOptions.region = 'PageSettings';
    exportOptions.fileName = 'Export';
    exportOptions.margin = { left: 0, top: 0, bottom: 0, right: 0 };
    this.diagram.exportDiagram(exportOptions);
  }

  public download(data : string) : void{
    if ((window.navigator as any).msSaveBlob) {
      let blob: Blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
     
      //window.navigator.msSaveOrOpenBlob(blob, 'Diagram.json');
  } else {
      let dataStr: string = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
      let a: HTMLAnchorElement = document.createElement('a');
      a.href = dataStr;
      a.download = 'Diagram.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
  }
}
public onUploadSuccess(args: any): void {

  let file1: any = args.file;
  let file: Blob = file1.rawFile as Blob;
  let reader: FileReader = new FileReader();
  reader.readAsText(file);
  reader.onloadend = this.loadDiagram.bind(this);
}

public loadDiagram(event: ProgressEvent): void {
  var target: FileReader = event.target as FileReader;
  if(target && target.result)
  this.diagram.loadDiagram(target.result.toString());
}

public items: ItemModel[] = [
  {text:'JPG'},{text:'PNG'},{text:'SVG'}

];
public addDisabled(args: MenuEventArgs) {
  this.onselectExport(args);
}

  public diagramCreate(args: Object): void {

  }
}
export class CheckboxClass{
  public isMaleChecked:boolean=false;
  public isFemaleChecked:boolean=false;
}
