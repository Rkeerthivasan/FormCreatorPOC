import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import the DiagramMOdule for the Diagram component
import { DiagramModule,DiagramAllModule, SymbolPaletteAllModule, } from '@syncfusion/ej2-angular-diagrams';
import { RouterModule } from '@angular/router';
import { DropDownButtonModule,SplitButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { ButtonAllModule  } from '@syncfusion/ej2-angular-buttons';
import { ToolbarModule,TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { NumericTextBoxModule, ColorPickerModule, UploaderModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DiagramModule,
    ButtonAllModule,
    DiagramAllModule,
    RouterModule,
    DropDownButtonModule,
    ToolbarModule,
    TreeViewModule,
    SplitButtonModule,
    SymbolPaletteAllModule,
    NumericTextBoxModule, 
    ColorPickerModule,
     UploaderModule, 
     TextBoxModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
