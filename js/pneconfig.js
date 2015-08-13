// JavaScript Document
// Copyright Flux editor, Javascript Tech, Inc. http : // plugnedit.com
var PNETOOLS = {
   
   PreInitEditor : function (){ 
   //Any code to be ran after editor is loaded but before it initializes.
   PlugNedit.PrepEnvironment()
   },
   
   EditorReady: function (){ 
   //Any code to be ran after it initializes.
    },
    
    CloseEditor : function (){ 
    //After editor closes the HTML is stored in PlugNedit.CanvasHTML as a string.
    PlugNedit.GetEditorObject.PageHTML().value = PlugNedit.CanvasHTML
    PlugNedit.DisplayEditorMenus(PlugNedit.GetEditorObject.HTMLSubmitWindow());
    },
    
    
   //Menu bar offset scroll, set 0 for fixed top or scroll @ PNEtoolbaroffset scrolltop
   PNEtoolbaroffset : [400, 800, 400, 400, 800, 800, 400, 0, 0, 0, 0, 0],
   EditorMinLeft : 25, //min left position from window
   EditorMinTop  : 25, //Min top position
  
   //Google font API Key for loading fonts.

   
    // CKEditor installed.
   JSCorlor : true,
   CKEditor : false,
   CKEditorInstallPath : "js/ckeditor/ckeditor.js",
   JScolorInstallPath : "js/jscolor/jscolor.js",
   FontFramePath : "googlefonts.html",
   MarginHeight : 1000,
   MarginWidth : 800,
   Rulers : false,
   Debug : false,
   MarginColor : "yellow",
   GuidesColor : "green",
   GuidesSnapColor : "blue",
   DisplayMenu : "none", // hides menu on resize and move blank for display, block, or none.
   NudgeDisplay : "none", // hides nudge display on resize and move. blank for display, block, or none.
   DisplayMiniTools : "", // blank display, block, or none.
   EditorToolbarOffsetTop : 25,
   SaveContent: "body",  //Save content : page, body or editor.   
   TypeAdaptive: false, //Page Type adaptive , true false
 
   CanvasObjects : {"FixedLayoutCanvas" : 800, "MobileLayoutCanvas" : 600},
   
   EditorObjectsIDs : {          
        SnapDisplay : "SnapDisplay", 
        LayerOptionsDialogBox : "LayerOptionsDialogBox", 
        ToolTip : "ToolTip",
        EditorMirrorCanvas : "EditorMirrorCanvas",
        LayerNamesInput :  "LayerNamesInput",
        LayerNameDialogBox :  "LayerNameDialogBox",
        LayerNumberUpdate : "LayerNumberUpdate",
        NewLayerName :"NewLayerName",
        OptionsImageSrc : "OptionsImageSrc" ,
        CustomUrl : "CustomUrl" ,
        OptionsLinkTarget : "OptionsLinkTarget" ,
        PageHTML : "PageHTML" ,
        OverFlowVisible: "OverFlowVisible",
        LayersPallet : "LayersPallet",
        CrossHairs : "CrossHairs",
        MirrorCanvasContainer : "MirrorCanvasContainer",
        MirrorCanvasTools : "MirrorCanvasTools",
        OptionStylesSelect : "OptionStylesSelect",
        OptionMenuStylesSelect : "OptionMenuStylesSelect",
        SideBarButtons : "SideBarButtons",
        LeftSideButtons : "LeftSideButtons",
        MarginsWidthInput : "MarginsWidthInput" ,
        DisplayCanvasToggle : "DisplayCanvasToggle",
        Pencil:"Pencil",
        ResizeMove:"ResizeMove",
        Resize:"Resize",
        Menu:"Menu",
        ImageActual:"ImageActual",
        Constrain:"Constrain",
        WhiteSpace:"WhiteSpace",
        LoadEditor:"LoadEditor",
        Locked:"Locked",
        UnLocked:"UnLocked",
        MenuContainer:"MenuContainer",
        NudgeDisplay:"NudgeDisplay",
        GuidesLeft:"GuidesLeft",
        GuidesTop:"GuidesTop",
        GuidesBottom:"GuidesBottom",
        GuidesRight:"GuidesRight",
        GuidesCenterH:"GuidesCenterH",
        GuidesCenterV:"GuidesCenterV",
        ActualImageChords:"ActualImageChords",
        ImageHeightChord:"ImageHeightChord",
        ImageWidthChord:"ImageWidthChord",
        TopPositionChord:"TopPositionChord",
        LeftPostionChord:"LeftPostionChord",
        HeightChord:"HeightChord",
        WidthChord:"WidthChord",
        SwatchMenu:"SwatchMenu",
        EditableSource:"EditableSource",
        RulersLeft:"RulersLeft",
        RulersRight:"RulersRight",
        EditorGrids:"EditorGrids",
        RightClickMenu:"RightClickMenu",
        GuidesContainer:"GuidesContainer",
        EditorCanvasCover:"EditorCanvasCover",
        InputEmbedMenu:"InputEmbedMenu",
        ColoredCover : "ColoredCover",
        OptionsLayerName : "OptionsLayerName",
        OptionsURLsrc : "OptionsURLsrc",
        OptionsCustomURL : "OptionsCustomURL",
        OptionsHyperLinkSelect : "OptionsHyperLinkSelect",
        OptionsLinkTarget : "OptionsLinkTarget",
        OptionsOffsiteDiv : "OptionsOffsiteDiv",
        HTMLSubmitWindow : "HTMLSubmitWindow",
        EntryPageSelection : "EntryPageSelection",
        MiniToolbar :"MiniToolbar",
        MarginCenter : "MarginCenter",
        CanvasSelection : "CanvasSelection"
   },
   
   
   
   SavePage : function ( a ) {
      // Save Page.
      PlugNedit.SavePage( a );
   }
   ,
   
   
 EditorOptions : function ( a ) {
      PlugNedit.EditorOptions( a );

   }
   ,
   
   
      Swatches : function ( a ) {
      PlugNedit.Swatches( a );

   }
   ,
   
   StyleEditorObject : function ( object,type,style ) {
   PlugNedit.StyleEditorObject( object,type,style )
     } ,
   
   
   ReloadVideo : function ( a ) {
      // Not In Use.
      PlugNedit.ReloadVideo( a )
   }
   ,
   
   HideEditorMenus : function ( a ) {
      // Not In Use.
      PlugNedit.HideEditorMenus( a )
   }
   ,
   
   

   
   
   SubmitEmbed : function( a ) {
   PlugNedit.SubmitEmbed( a )
   },

   SideBar : function ( a ) {
      // Set SideBar Scroll.
        
      PlugNedit.SideBar( a );

   }
   ,

   NewHTMLLayer : function ( a ) {
      // New Div Layer.
      PlugNedit.NewHTMLLayer( a );
 
   }
   ,

   EmbedHTML : function ( a ) {
      // Display Embed Menu.
      PlugNedit.EmbedHTML( a );
   }
   ,

   ToolTip : function ( a ) {
      // Display A Tool Tip
      PlugNedit.ToolTip( a );
   }
   ,

   PNEInt : function ( a ) {
      // Init window listners.
      PlugNedit.initPlugNEdit( a );
   }
   ,

   SortText : function ( a ) {
      // Sort Text Entry.
      PlugNedit.SortDivText( a, "1" );
   }
   ,

   SortDivText : function ( a ) {
      // Sort Text Entry.
      PlugNedit.SortDivText( a, "2" );
   }
   ,

   Onselct : function ( a ) {
      // Allow Selecting Until Next Selecting Cycle.
      PlugNedit.Onselect( a );
   }
   ,


   ONContextMenus : function ( a ) {
      // Allow Context Menu True False
      PlugNedit.ONContextMenus( a )
   }
   ,
  
  DLStylenew : function (a,b,c){
  PlugNedit.DLStylenew(a,b,c)
  },


  DLStyle : function (a,b,c){
  PlugNedit.DLStylenew(a,b,c)
 },
  
  
   LoadInlineEditor : function ( a ) {
      // Load Inline Editor.
      PlugNedit.LoadHTMLEditor( a );
   }
   ,
 
   FontSize : function ( a ) {
      // Change Font Size.
      PlugNedit.changeFontSize( a );
   }
   ,

   TextAlign : function ( a ) {
      // Text Align.
      PlugNedit.TextAlign( a );
   }
   ,

   FontSelect : function ( a ) {
      // Font Select.
      PlugNedit.FontSelect( a );
   }
   ,

   FontWeight : function ( a ) {
      // Font Weight.

      PlugNedit.FontWeight( a )
   }
   ,

   FontStyle : function ( a ) {
      // Set Italic.
      PlugNedit.FontStyle( a )

   }
   ,

   LTRText : function ( a ) {
      // Set Left To Right.
      PlugNedit.LTRText( a )

   }
   ,

   RTLText : function ( a ) {
      // Set Right To left.
      PlugNedit.RTLText( a )
   }
   ,

   StyleInlinediv : function ( e, r, f ) {
      // Set A Inline Style.
  
      PlugNedit.StyleInlinediv( e, r, f );
   }
   ,

   Preview : function ( a ) {
      // Preview.
      PlugNedit.Preview( a );
   }
   ,

   WindowBar : function ( a ) {
      // Hide Move Handles.
      PlugNedit.WindowBar( a )
   }
   ,

   UndoIt : function ( a ) {
      // Undo Last Change / Redo Last Change.
      PlugNedit.UndoIt( a );
   }
   ,

   Guides : function ( a ) {
      // Hide Show Guides and Rules.
      PlugNedit.Guides( a )
   }
   ,

   Qupdate : function ( a, b, c, d, e ) {
      // Bottom Quick Bar Update.
      PlugNedit.Qupdate( a, b, c, d, e )
   }
   ,

   GetHTML : function ( a ) {
      // Get HTML without leaving page.
      PlugNedit.GetHTML( a )
   }
   ,

   BGColor : function ( a ) {
      // Set background color.
      PlugNedit.BGColor( a )
   }
   ,

   ResetMargins : function ( a ) {
      // Set Margin Width
      PlugNedit.ResetMargins( a );
   }
   ,

   DeleteLayers : function ( a ) {
      // Delete Layer.
      PlugNedit.DeleteLayers( a );
   }
   ,

   TransDiv : function ( a ) {
      // Set Transparency.
      PlugNedit.TransDiv( a );
   }
   ,

   loadXMLDoc : function ( a ) {
      // Load XML Doc.
      PlugNedit.loadXMLDoc( a );
   }
   ,

   LayerAdjust : function ( a, b, c ) {
      // Adjust Z - index of layers.
      PlugNedit.LayerAdjust(a,b,c)
 
   }
   ,

   OFFSiteHBlur : function ( a ) {
      // Hide Offsite Hyperlink option.
     PlugNedit.OFFSiteHBlur()
   }
   ,



   DisplayOptionsMenu : function ( a ) {
      // Force Layer Name Menu Update.
      PlugNedit.DisplayOptionsMenu( );
   }
   ,

   OCCUL : function ( a ) {
      // Set HyperLink.
      PlugNedit.OCCUL( a )
   }
   ,

   AutoSaves : function ( a ) {
      // Set Autosaves on.
      PlugNedit.autosaveson( a )
   }
   ,

   PlaceImage : function ( a ) {
      // Place Url Entry Image.
      PlugNedit.PlaceImage( a )
   }
   ,

   CONTROLLayers : function ( a ) {
      // Force update of layers menu.
      PlugNedit.ControlLayers( a );
   }
   ,

   SelectLayerStyle : function ( a ) {
      // Update current layer style.
      PlugNedit.SelectLayerStyle( a );
   }
   ,

   VHC : function ( a, b ) {
      // Validate HEX Color
      PlugNedit.validateHColor( a, b );
   }
   ,

   CheckEmbed : function ( a ) {
      // Check Embed For Duplicate Content
     PlugNedit.CheckEmbed( a )
   }
   ,

   SubmitEmbed : function ( a ) {
      // New Div Layer With Embeded HTML
      PlugNedit.SubmitEmbed( a )
   }
   ,

  SetGradient : function ( a, b ) {
      // Set gradient.
      PlugNedit.SetGradient ( a, b )
   }
   ,

   Grids : function ( a ) {
      // Hide Show Grids
      PlugNedit.Grids( a )
   }
   ,
   
   PadBottom : function (a){
   PlugNedit.PadBottom(a)

    },

   SingleHandle : function ( a ) {
      // Use Single handle for moving layers.
      PlugNedit.SingleHandle( a )
   }
   ,

   CloneLayers : function ( a ) {
      // Clone Layers
      PlugNedit.CloneLayer( a );
   },
   
  
  
   SetTextObjectsToolbars: function (){
       PlugNedit.GetEditorObject.ResizeMove().style.display = "";
       PlugNedit.GetEditorObject.Resize().style.display = "";
       PlugNedit.GetEditorObject.Menu().style.display = "";
       PlugNedit.GetEditorObject.WhiteSpace().style.display = "";
       PlugNedit.GetEditorObject.LoadEditor().style.display = "";
       PlugNedit.GetEditorObject.Pencil().style.display = "";
       if (PlugNedit.isLockedLayer()){PlugNedit.GetEditorObject.Locked().style.display = "";} else {PlugNedit.GetEditorObject.UnLocked().style.display = "";}
     
       },
       
   SetImageObjectsToolbars : function (){
       PlugNedit.GetEditorObject.ResizeMove().style.display = "";
       PlugNedit.GetEditorObject.Resize().style.display = "";
       PlugNedit.GetEditorObject.Menu().style.display = "";
       PlugNedit.GetEditorObject.ImageActual().style.display = "";
       PlugNedit.GetEditorObject.Constrain().style.display = "";
       if (PlugNedit.isLockedLayer()){PlugNedit.GetEditorObject.Locked().style.display = "";} else {PlugNedit.GetEditorObject.UnLocked().style.display = "";}
       },
       
     SetTextToolbarPosition : function (Obj){
            PlugNedit.GetEditorObject.ResizeMove().style.left = parseInt(Obj.style.width) / 2 + parseInt(Obj.style.left) + 0 + "px";
            PlugNedit.GetEditorObject.Resize().style.left = parseInt(Obj.style.width) + parseInt(Obj.style.left) + 0 + "px";
            PlugNedit.GetEditorObject.Resize().style.top = parseInt(Obj.style.height) + parseInt(Obj.style.top) + 0 + "px";
            PlugNedit.GetEditorObject.ResizeMove().style.top = parseInt(Obj.style.height) + parseInt(Obj.style.top) + 0 + "px";
            PlugNedit.GetEditorObject.WhiteSpace().style.left = parseInt(Obj.style.left) + 50 + "px";
            PlugNedit.GetEditorObject.WhiteSpace().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
            PlugNedit.GetEditorObject.LoadEditor().style.left = parseInt(Obj.style.left) + 140 + "px";
            PlugNedit.GetEditorObject.LoadEditor().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
            PlugNedit.GetEditorObject.Menu().style.left = parseInt(Obj.style.left) + 80 + "px";
            PlugNedit.GetEditorObject.Menu().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
            PlugNedit.GetEditorObject.Pencil().style.left = parseInt(Obj.style.left) + 170 + "px";
            PlugNedit.GetEditorObject.Pencil().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
            PlugNedit.GetEditorObject.UnLocked().style.left = parseInt(Obj.style.left) + 110 + "px";
            PlugNedit.GetEditorObject.UnLocked().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
            PlugNedit.GetEditorObject.Locked().style.left = parseInt(Obj.style.left) + 110 + "px";
            PlugNedit.GetEditorObject.Locked().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
            PlugNedit.GetEditorObject.Constrain().style.left = parseInt(Obj.style.left) + 140 + "px";
            PlugNedit.GetEditorObject.Constrain().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
            PlugNedit.GetEditorObject.ImageActual().style.left = parseInt(Obj.style.left) + 50 + "px";
            PlugNedit.GetEditorObject.ImageActual().style.top = parseInt(Obj.style.top) - PNETOOLS.EditorToolbarOffsetTop + "px";
       },
       
    HideEditorObjects : function (){
      PlugNedit.GetEditorObject.Pencil().style.display = "none";
      PlugNedit.GetEditorObject.WhiteSpace().style.display = "none";
      PlugNedit.GetEditorObject.LoadEditor().style.display = "none";
      PlugNedit.GetEditorObject.Resize().style.display = "none";
      PlugNedit.GetEditorObject.CrossHairs().style.overflow = "hidden";
      PlugNedit.GetEditorObject.Menu().style.display = "none";
      PlugNedit.GetEditorObject.ImageActual().style.display = "none";
      PlugNedit.GetEditorObject.ResizeMove().style.display = "none";
      PlugNedit.GetEditorObject.Locked().style.display = "none";
      PlugNedit.GetEditorObject.UnLocked().style.display = "none";
      PlugNedit.GetEditorObject.Constrain().style.display = "none";
      },
    }

PNEloadstatus('Flux-config');