// Copyright Flux editor, Javascript Tech, Inc. http : // plugnedit.com Version 1.0.2
var PlugNedit = {
    initPlugNEdit: function(a) {
        // Add event listeners to editor window and canvas window.
        // PlugNedit uses multi  window mouse catpures to separate the content from the canvas and editor.
        // EI9 + Chrome FireFox Safari compatible.

        // Mouse Move : Catch mouse Chords
        this.AddEventListen(this.CanvasWindow, 'mousemove', this.MouseMove);
        this.AddEventListen(document, 'mousemove', this.MouseMove);

        // Mouse Over : Catch object tags
        this.AddEventListen(this.CanvasWindow, 'mouseover', this.BrowseElements);
        this.AddEventListen(document, 'mouseover', this.BrowseElements);

        // Mouse Out : Release object tags
        this.AddEventListen(this.CanvasWindow, 'mouseout', this.ReleaseTarget);
        this.AddEventListen(document, 'mouseout', this.ReleaseTarget);

        // Mouse Down : Identify PlugNedit objects.
        this.AddEventListen(this.CanvasWindow, 'mousedown', this.ElementFinder);
        this.AddEventListen(document, 'mousedown', this.ElementFinder);

        // Key Down : Disabe accidently leaving of the page.
        this.AddEventListen(this.CanvasWindow, 'keydown', this.DisableEvent);
        this.AddEventListen(document, 'keydown', this.DisableEvent);
        // Key Press : Disabe accidently leaving of the page.
        this.AddEventListen(this.CanvasWindow, 'keypress', this.DisableEvent);
        this.AddEventListen(document, 'keypress', this.DisableEvent);

        // Mouse Up : Unlock unused objects .
        this.AddEventListen(this.CanvasWindow, 'mouseup', this.UnlockElement);
        this.AddEventListen(document, 'mouseup', this.UnlockElement);

        // Double Click : Double click options.
        this.AddEventListen(this.CanvasWindow, 'dblclick', this.DoubleDown);
        this.AddEventListen(document, 'dblclick', this.DoubleDown);

        // Drag Start : Keep object from accidently placement outside editor formatting.
        this.AddEventListen(this.CanvasWindow, 'dragstart', this.ReturnFalse);
        this.AddEventListen(document, 'dragstart', this.ReturnFalse);

        // Window Resize : Reset the editor positioning.
        this.AddEventListen(window, 'resize', this.Elementposition);

        // On Sroll : Sroll toolbars or palletes
        this.AddEventListen(window, 'scroll', this.ObjectPosition);

        // On Unload : Make suere the eidtor is ready to unload.
        this.AddEventListen(window, 'beforeunload', this.CheckUnload);
        this.AddEventListen(this.CanvasWindow, 'beforeunload', this.CheckUnload);

        // On Context Menu : Stop the browser context menu right click menu from showing.
        this.AddEventListen(this.CanvasWindow, 'contextmenu', this.ReturnFalse);

        // On Mouse Wheel : Make sure the mouse wheel scrolls the editor not the canvas.
        this.AddEventListen(this.CanvasWindow, 'onwheel', this.MouseWheelHandler);
        this.AddEventListen(this.CanvasWindow, 'scroll', this.MouseWheelHandler);

        // Check for formating and size change of the current active HTML layer.
        this.AdjustTheDivINT = setInterval(this.AdjustTheDiv, 1000);
    },

    MouseWheelHandler: function(e) {

        // Stops the canvas window mouse wheel evenst, to keep the editor in the proper position, and reset window focus.
        // The canvas should not scroll only the editor window.
        var self = PlugNedit;
        if (!e) e = self.CanvasWindow.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        // Scroll the canvas to the top position.
      self.RE("PNECANVASiframe").contentWindow.scrollTo(0, 0);
        window.focus();
    },

    SetCurrentLayerObject: function(SetLayerNumber) {
        // Builds and set the current global layer objects.
        if (!SetLayerNumber) {
            SetLayerNumber = this.CurrentLayerNumber;
        }
        this.CurrentLayerNumber = SetLayerNumber;
        // Editor layer is in the editor window, it is the move layer object menu item and shadows the canvas layer.
        this.CurrentLayerObject.Editor = this.GetEditorObject.EditorLayer(this.CurrentLayerNumber);

        // InnerObject is the current canvas window layer that can be edited and changed by user.
        // This object can be Image or HTMLDiv
        this.CurrentLayerObject.Editable = this.GetCanvasObject.EditableLayer(this.CurrentLayerNumber);
        // The container div is on the canvas window and contains the InnerObject div.
        this.CurrentLayerObject.Container = this.GetCanvasObject.ContainerLayer(this.CurrentLayerNumber);
        // Reset the Current Layer Number if changed.
        // The HTMDIV is the current / last HTML layer selected.
        this.CurrentLayerObject.HTMLDIV = this.GetCanvasObject.EditableLayer(this.EditableDivLayer);
    },
    ElementFinder: function(TargetObj, b) {

        // This event is triggered on Mouse Down.
        // It identifies if the object being clicked on is a Editor / Canvas / layer object and then resets
        // the global objects to the newly selected object target object.
          
            TargetObj = TargetObj ? TargetObj : window.event;
           var self = PlugNedit,  TargetSrc = TargetObj.target ? TargetObj.target : TargetObj.srcElement,
            m, d, TargetParent, IntDivL;

        // Current Window Canvas / Editor / User Window.
        self.InCKeditorWindow = false;
        if (self.EditorClosed===true){return;}
        self.CurrentWindow = TargetSrc.ownerDocument.defaultView.window.name;

        // Check if inside a canvas layer.
        TargetSrc = self.IsCanvasLayer(TargetSrc);
        // Check wich mouse button has been clicked and pull up right mouse click menu.
        self.MouseWich(TargetObj, TargetSrc);
        // Identifiy special editor objects (resize image and pull down hinge.) and reset target.
        TargetSrc = self.EditorObjectSpecial(TargetSrc);

        // Grab mouse chords for multiple layer selection.
        self.PNEMouseXY = PlugNedit.MousePX + "," + PlugNedit.MousePY;
        // Set the current HTML tag.
        self.BrowserElementCurTag = TargetSrc.tagName;
        self.CurrentObjectID = TargetSrc.id;
        if (self.InCKeditorWindow) {
            PNETOOLS.HideEditorObjects();
            return;

        }
        if (!self.HasAttriubteValue(TargetSrc)) {
            return;
        }

        // Check if canvas object and set layer options.
        if (self.TestOBJECT('TestAll', TargetSrc.id)) {
            self.EditorLayer = self.BuildEditorLayer(TargetSrc.id);
            if (self.EditorLayer == TargetSrc.id) {
                self.GetEditorObject.MenuContainer().style.display = PNETOOLS.DisplayMenu;
                self.GetEditorObject.NudgeDisplay().style.display = PNETOOLS.NudgeDisplay;
            }

            self.LockedElement = TargetSrc.id;
            self.SetCurrentLayerObject(self.RNum(TargetSrc.id));
            // Check if not image and set the onselect text or objects to true.
            // Make the div user editable.
            // Set the editor option to HTML type Layer.
            if (!self.isImage(TargetSrc.id)) {
                self.EditableDivLayer = self.BuildEditableLayer(self.CurrentLayerNumber);
                self.SetCurrentLayerObject();

                if (!self.CurrentLayerObject.Editable.hasAttribute('contentEditable') || self.CurrentLayerObject.Editable.getAttribute('contentEditable') != "true") {

                    self.SetContentEditable('false');
                    self.CurrentLayerObject.Editable.setAttribute("contentEditable", "true");
                    self.CKDestroy();

                }
                self.CurrentLayerObject.Editable.setAttribute("data-editortype", "HTML");
                self.AllowSelectInline = true;
                self.AddEventListen(self.CurrentLayerObject.Editable, 'selectstart', self.SelectStart);
            }
        }

        self.CurrentObjectID = TargetSrc.id;
        // Set editor in lock down mode until mouse up
        self.LockedDown = true;
        // Sort thru layers and highlight objects.
        self.SortLayers(self.CurrentLayerNumber);
        // set the toolbar options to the proper layers settings.
        self.SetToolBarParams();
        // Set the visual chords.
        self.SetVisualChords();

        if (PNETOOLS.Debug) {
            self.DisplayLog();
        }
    },

    ResizeObject: function(a) {
        // Turn off select objects and hide editor objects not needed.
        this.Onselect();
        PNETOOLS.HideEditorObjects();
        // Set start mouse position and start height & width position.
        if (this.EditorOffsetY === false) {
            this.EditorOffsetY = (this.MousePY);
            this.EditorOffsetX = (this.MousePX);
            this.ProximityHeight = parseInt(this.CurrentLayerObject.Container.style.height);
            this.ProximityWidth = parseInt(this.CurrentLayerObject.Container.style.width);
        }
        // Set cursor to proper image.
        if (this.PNEimitateElement == "ResizeMove") {
            document.body.style.cursor = "url(assets/32X32/pulldown.png), S-Resize";
        }
        if (this.PNEimitateElement == "Resize") {
            document.body.style.cursor = "url(assets/picon/png/32x32/rsize.png), SE-Resize";
        }
        // Set the new style height && width from offsets.
        var NewStyleHeight = this.MousePY - this.EditorOffsetY + this.ProximityHeight,
            NewStyleWidth = this.MousePX - this.EditorOffsetX + this.ProximityWidth;
        this.CurrentLayerObject.Editable.style.width = NewStyleWidth - (this.OffsetInnerObject(this.CurrentLayerObject.Editable) * 2) + "px";
        // Constrain proportion, if set remove the objects height and allow the browser to compute the new size.
        if (this.CurrentLayerObject.Container.hasAttribute("data-Constrain")) {
            this.CurrentLayerObject.Editable.style.height = "";
            NewStyleHeight = parseInt(this.CurrentLayerObject.Editable.clientHeight);
        }
        // Set the object and array new height and width, subtract the offsettop of the div.
        this.CurrentLayerObject.Container.style.height = NewStyleHeight + "px";
        this.CurrentLayerObject.Editable.style.height = NewStyleHeight - (this.OffsetInnerObject(this.CurrentLayerObject.Editable) * 2) + "px";
        this.CurrentLayerObject.Container.style.width = NewStyleWidth + "px";
        // Set new layer attributes height and width.
        this.LayerAttributeHeight[this.CurrentLayerNumber] = NewStyleHeight - (this.OffsetInnerObject(this.CurrentLayerObject.Editable) * 2);
        this.LayerAttributeWidth[this.CurrentLayerNumber] = NewStyleWidth - (this.OffsetInnerObject(this.CurrentLayerObject.Editable) * 2);
        // If pull hinge move objects below process the function for moving layers down.
        if (this.PNEMoveBelow === true) {
            this.MoveObjectsBelow(NewStyleHeight);
        }
    },
    SetLayerMove: function(a) {
        // Set user onselection to false and hide editor elements not needed until obj is placed.
        this.Onselect();
        PNETOOLS.HideEditorObjects();
        // Set mouse offset from the layer offset.
        if (this.EditorOffsetY === false) {
            this.EditorOffsetY = (parseInt(this.CurrentLayerObject.Container.style.top) - this.MousePY);
            this.EditorOffsetX = (parseInt(this.CurrentLayerObject.Container.style.left) - this.MousePX);
        }
        // Set the objects left & top chords.
        var TopPostion = this.MousePY + this.EditorOffsetY,
            LeftPostion = this.MousePX + this.EditorOffsetX;
        if (Math.abs(LeftPostion) > this.WindowWidth / 2 - PNETOOLS.EditorMinLeft || TopPostion < PNETOOLS.EditorMinTop) {
            return;
        }


        // Set the editor and canvas layers new left and top.
        this.CurrentLayerObject.Container.style.top = TopPostion + "px";
        this.CurrentLayerObject.Editor.style.top = (TopPostion - PNETOOLS.EditorToolbarOffsetTop) + "px";
        this.CurrentLayerObject.Container.style.left = LeftPostion + "px";
        this.CurrentLayerObject.Editor.style.left = LeftPostion + "px";
        // Set the layer arrays top && left position of the inner canvas layer div.
        this.LayerAttributeLeft[this.CurrentLayerNumber] = parseInt(this.CurrentLayerObject.Container.style.left) + this.CurrentLayerObject.Editable.offsetLeft;
        this.LayerAttributeTop[this.CurrentLayerNumber] = parseInt(this.CurrentLayerObject.Container.style.top) + this.CurrentLayerObject.Editable.offsetTop;
    },
    MouseMove: function(MouseX, MouseY) {
        // PlugNedit.LockedElement Check if element is locked for movement.
        // PlugNedit.ProcessXY Check if snap is engaged. If guides snap is currently snaped stop movement of layer.
        // Check if user has locked the element in the editor with the quick bar lock.
        var self = PlugNedit;
        self.SetMousePX(MouseX, MouseY);
        if (self.LockedElement === false || self.ProcessXY === false || self.isLockedLayer()) {
            return;
        }
        // Check if user is focused on inner div and selecting text.
        if (self.TestOBJECT(self.LayersEditableDivs, self.LockedElement) && self.AllowSelectInline === true) {
            return;
        }
        // Set current Mouse Position
        // Check if editor locked into resize mode and process size change or else process layer movement.
        if (self.ProximityLock) {
            self.ResizeObject(self.CurrentLayerNumber);
        } else {
            self.SetLayerMove(self.CurrentLayerNumber);
        }
        // Process the guides and snap and chords.
        self.SetGuidesH(self.CurrentLayerNumber);
        self.SetGuidesV(self.CurrentLayerNumber);
        self.SetVisualChords();
    },
    BrowseElements: function(TargetSrc, b) {
        var self = PlugNedit;
        // Function BrowseElements is the mouse over function in plugnedit.
        TargetSrc = TargetSrc ? TargetSrc : window.event;
        TargetSrc = TargetSrc.target ? TargetSrc.target : TargetSrc.srcElement;
        self.PNEimitateElement = 0;
        // Check if editor is in Lock Down for moving or resizing.
        if (!TargetSrc || self.LockedDown === true || self.LockedElement || !self.HasAttriubteValue(TargetSrc)) {
            return;
        }
        // Set the global mousever tag name.
        self.LockPreSourceElement = TargetSrc.tagName;
        // Test if plugnedit Layer object.
        if (self.TestOBJECT('TestAll', TargetSrc.id)) {
            // Highlight border of layer on mouseover.
            self.GetCanvasObject.ContainerLayer(TargetSrc.id).style.borderColor = self.Overbordercolor;
            self.LockPreSourceElementID = TargetSrc.id;
        }
    },
    ScrollLayers: function(d) {
        // Set Scroll Offsets.
        var docBody, docElement, self = PlugNedit;
        if (typeof pageYOffset != "undefined") {
            self.TempScrollTop = pageYOffset;
        } else {
            docBody = document.body;
            docElement = document.documentElement;
            docElement = (docElement.clientHeight) ? docElement : docBody;
            self.TempScrollTop = docElement.scrollTop;
        }
        if (typeof pageXOffset != "undefined") {
            self.TempScrollLeft = pageXOffset;
        } else {
            docBody = document.body;
            docElement = document.documentElement;
            docElement = (docElement.clientWidth) ? docElement : docBody;
            self.TempScrollLeft = docElement.scrollLeft;
        }
        // Scroll toolbars with offsets greater then screen height.
        // Toolbar Id : NoEdittool then the number of the toolbar. Exaple : NoEdittool1
        // Toolbar offset are set in PNETOOLS.PNEtoolbaroffset.
        for (var ToolBarNumber = 0; ToolBarNumber < PNETOOLS.PNEtoolbaroffset.length; ToolBarNumber++) {
            if (self.GetEditorObject.ToolBar(ToolBarNumber)) {
                if (PNETOOLS.PNEtoolbaroffset[ToolBarNumber] === 0 || (parseInt(self.GetEditorObject.ToolBar(ToolBarNumber).style.top) + PNETOOLS.PNEtoolbaroffset[ToolBarNumber]) < (self.TempScrollTop + self.ToolBarOffsetHeight) || parseInt(self.GetEditorObject.ToolBar(ToolBarNumber).style.top) > self.TempScrollTop) {
                    self.GetEditorObject.ToolBar(ToolBarNumber).style.top = self.TempScrollTop + "px";
                }
            }
        }

        PlugNedit.RE("PNECANVASiframe").style.height = +self.WindowHeight + self.IframeOffsetTop + self.TempScrollTop + 0 + 'px';

        self.GetEditorObject.SideBarButtons().style.top = self.TempScrollTop + "px";


    },
    UnlockElement: function() {

        var self = PlugNedit;
        self.CanvasWindow.body.scrollTop = 0 + 'px';
        // Display Menu.
        self.GetEditorObject.MenuContainer().style.display = "";
        self.GetEditorObject.NudgeDisplay().style.display = "";
        if (self.InCKeditorWindow) {
            PNETOOLS.HideEditorObjects();
            return;

        }
        // Reset the objects below current object.
        self.PNEMoveBelow = false;
        self.PNELayerdrag.length = 0;
        // Reset the offsets.
        self.EditorOffsetY = false;
        self.EditorOffsetX = false;
        // Reset editor postion.
        self.LockedElementDiv = false;
        // Set the element position.
        if (self.LockedElement) {
            self.Elementposition();
        }
        // Set the session Closed.
        self.CloseSession = self.RNum(self.EditableDivLayer);

        if (self.UndoSteps === false) {
            self.UndoIt(0);
        }
        self.UndoSteps = false;
        // Reset editor objects to proper places on the screen.
        self.CleanWorkArea(self.EditableDivLayer);
        // Reset the mouse down attribues.
        self.LockedDown = false;
        self.LockedElement = false;
        // Reset the Resize attributes.
        self.ProximityLock = false;
        self.ProximityHot = false;
        self.ProximityLockClientX = 0;
        self.ProximityLockClientY = 0;
        // Reset the cursor.
        document.body.style.cursor = "Auto";
        if (PNETOOLS.Debug) {
            self.DisplayLog();
        }
    },
    CleanWorkArea: function(ObjLayer, Bypass) {

        if (!this.CurrentLayerObject.Editor && Bypass !== true || this.CurrentLayerNumber === false) {
            return;
        }
        // Hide Toolbars
        PNETOOLS.HideEditorObjects();
        // Hide Crosshairs and diplay the menu.
        this.ResetCrossHairs();

        // Check if on body or border and reset the display if so.
        if (this.CurrentObjectID == "NO1NoEditupperSetBorder") {
            this.BrowserElementCurTag = "BODY";
        }
        if (this.BrowserElementCurTag == "BODY") {
            this.GetEditorObject.RightClickMenu().style.visibility = "hidden";
        }
        for (var LayerNumber = this.LayerNames.length - 1; LayerNumber >= 0;
            --LayerNumber) {
            if (this.LayerNames[LayerNumber] !== undefined) {
                if (LayerNumber != this.RNum(ObjLayer) && LayerNumber != this.RNum(this.EditorLayer) || this.BrowserElementCurTag == "BODY") {
                    // Reset the borders bonding box.
                    this.GetCanvasObject.ContainerLayer(LayerNumber).style.borderColor = "transparent";
                    this.GetEditorObject.EditorLayer(LayerNumber).style.display = this.DisplayMove;
                } else {
                    // Highlight the active layer.
                    this.CurrentLayerObject.Editor.style.display = "";
                    this.GetCanvasObject.ContainerLayer(LayerNumber).style.borderStyle = "Solid";
                    this.GetCanvasObject.ContainerLayer(LayerNumber).style.borderColor = this.bordercolor;
                }
            }
        }

        if (this.isImage(this.CurrentLayerObject.Editor.id)) {

            // Sets Mini Tool Bar for image options.
            PNETOOLS.SetImageObjectsToolbars();
        } else {

            // Sets Text Toolbar for text options.
            PNETOOLS.SetTextObjectsToolbars();
        }
        PNETOOLS.SetTextToolbarPosition(this.CurrentLayerObject.Container);
        this.SelectItems();
    },

    SetContentEditable: function(set) {
        // Sets div content editable to true or false.
        var ArrayItem,
            ArrayObj = this.LayersEditableDivs;
        for (ArrayItem = ArrayObj.length - 1; ArrayItem >= 0;
            --ArrayItem) {
            if (this.GetCanvasObject.EditableLayer(ArrayObj[ArrayItem])) {

                this.GetCanvasObject.EditableLayer(ArrayObj[ArrayItem]).setAttribute("contentEditable", set);
            }
        }
    },

    TestOBJECT: function(ArrayObj, ElementMatch, b) {
        // Compare Objects ID to array of object ID's for matching a Editor Object.
        // TestAll Matches against any editor object.
        var ArrayItem;
        if (ArrayObj == "TestAll") {
            ArrayObj = this.LayersCanvasContainers.concat(this.LayersImageContainers, this.LayersEditableDivs, this.LayersEditorDivs, this.LayersImageObjectsLayer, this.LayersImageObjects);
        }
        for (ArrayItem = ArrayObj.length - 1; ArrayItem >= 0;
            --ArrayItem) {
            if (ArrayObj[ArrayItem] == ElementMatch) {
                return true;
            }
        }
    },
    SetMousePX: function(ME, d) {
        // Sets mouse cords on mouse move.
        var DocBody = document.body,
            DocElement = document.documentElement;
        ME = ME ? ME : window.event,
        TargetSrc = ME.target ? ME.target : ME.srcElement;
        // Check if Event client.
        if (this.AltBrowser) {
            try {
                this.MousePX = parseInt(event.clientX);
                this.MousePY = parseInt(event.clientY);
            } catch (a) {
                // If Event client not set, set browser type to standard.
                this.AltBrowser = false;
            }
        } else {
            // If standard browser proccess the pageXY
            // Set global MousePX
            this.MousePX = parseInt(ME.pageX);
            this.MousePY = parseInt(ME.pageY);
        }
        if (typeof pageYOffset != "undefined") {
            // Set the glogal scroll postiion
            this.TempScrollTop = pageYOffset;
            this.TempScrollLeft = pageXOffset;
        } else {
            // Set the glogal scroll bar position.
            DocElement = (DocElement.clientHeight) ? DocElement : DocElement;
            this.TempScrollTop = DocElement.scrollTop;
            this.TempScrollLeft = DocElement.scrollLeft;
        }

        if (TargetSrc.ownerDocument.defaultView.window.name != "PNEDITOR") {
            // Adjusts mouse chords if in canvas frame.
            this.MousePY = this.MousePY + this.IframeOffsetTop;
        }

    },
    Elementposition: function() {
        var self = PlugNedit;
        // Set the screen width and height attributes.
        if (document.body && document.body.offsetWidth) {
            self.WindowWidth = document.body.offsetWidth;
            self.WindowHeight = document.body.offsetHeight;
        }
        if (document.compatMode == "CSS1Compat" && document.documentElement && document.documentElement.offsetWidth) {
            self.WindowWidth = document.documentElement.offsetWidth;
            self.WindowHeight = document.documentElement.offsetHeight;
        }
        if (window.innerWidth && window.innerHeight) {
            self.WindowWidth = window.innerWidth;
            self.WindowHeight = window.innerHeight;
        }
        // Set Global Half Screens.
        self.WindowScreenWidthHalf = screen.width / 2;
        self.WindowWidthHalf = self.WindowWidth / 2;
        // Set Global Toolbar Offset Height.
        self.ToolBarOffsetHeight = self.WindowHeight;
        self.ObjectPosition();
    },
    Qupdate: function(ObjectValue, ObjectType, p, AdjustInner) {
        // Quick update bar from the cords menu.
        PNETOOLS.HideEditorObjects();
        if (!this.isNumeric(ObjectValue)) {
            return;
        }
        var ObjectOffsetValue = 0,
            ObjectOffest;
        var ObjectStyle = ObjectType.toLowerCase();
        // Setting top or left position
        if (ObjectStyle == 'top' || ObjectStyle == 'left') {
            // build type of offset from outer div.
            ObjectOffest = "offset" + ObjectStyle.charAt(0).toUpperCase() + ObjectStyle.slice(1);
            //
            ObjectOffsetValue = +parseInt(this.CurrentLayerObject.Editable[ObjectOffest]);
            // set the top or left postion.
            this.CurrentLayerObject.Container.style[ObjectStyle] = (+ObjectValue - ObjectOffsetValue) + "px";
        }
        // Set height or width.
        if (ObjectStyle == 'width' || ObjectStyle == 'height') {
            // Set height width of layer.
            ObjectOffest = "offset" + ObjectStyle.charAt(0).toUpperCase() + ObjectStyle.slice(1);
            ObjectOffsetValue = +parseInt(this.CurrentLayerObject.Editable[ObjectOffest]);
            ObjectOffsetValue = Math.abs((+parseInt(this.CurrentLayerObject.Editable.style[ObjectStyle]) - Math.abs(ObjectOffsetValue)));
        }
        if (AdjustInner == 1) {
            // adjust the inner width.
            this.CurrentLayerObject.Editor.style[ObjectStyle] = (+ObjectValue - this.KeyOffset.InnerDiv) + "px";
        } else {
            if (this.isImage(this.CurrentLayerObject.Editor.id)) {
                // Set the new picture and div object to the new style
                this.CurrentLayerObject.Container.style[ObjectStyle] = (+ObjectValue - ObjectOffsetValue) + "px";
                this.CurrentLayerObject.Editable.style[ObjectStyle] = (+ObjectValue) + "px";
            } else {
                // Adjust the inner and out div to new style.
                this.CurrentLayerObject.Editable.style[ObjectStyle] = (+ObjectValue - ObjectOffsetValue) + "px";
                this.CurrentLayerObject.Container.style[ObjectStyle] = (+ObjectValue - ObjectOffsetValue + this.KeyOffset.InnerDiv) + "px";
            }
        }
        // Update the array style object
        PlugNedit['LayerAttribute' + ObjectType][this.CurrentLayerNumber] = ObjectValue;
    },
    DeleteLayers: function() {
        // Deletes a layer and removes properties from the arrays and HTML from the canvas iframe.
        if (this.TestOBJECT(this.LayersCanvasContainers, this.BuildContainerLayer(this.EditorLayer))) {
            this.GetEditorObject.LayerOptionsDialogBox().style.visibility = "hidden";

            this.LayerLevels[this.CurrentLayerNumber] = undefined;
            this.LayerNames[this.CurrentLayerNumber] = undefined;
            this.LayerType[this.CurrentLayerNumber] = undefined;
            this.LayerAttributeWidth[this.CurrentLayerNumber] = undefined;
            this.LayerAttributeHeight[this.CurrentLayerNumber] = undefined;
            this.LayerAttribute[this.CurrentLayerNumber] = undefined;
            this.LayerAttributeTop[this.CurrentLayerNumber] = undefined;
            this.LayerAttributeLeft[this.CurrentLayerNumber] = undefined;
            // Delete HTML from canvas
            this.BuildLinkedLayers();
            var object = this.CurrentLayerObject.Editor;
            var parentobject = object.parentNode;
            var childobject = parentobject.removeChild(object);
            object = this.CurrentLayerObject.Container;
            parentobject = object.parentNode;
            childobject = parentobject.removeChild(object);
            this.GetEditorObject.RightClickMenu().style.visibility = "hidden";
            this.ControlLayers("Rebuild");
            this.ReleaseElements()
        }
    },
    SetGuidesV: function(LayerNumber) {
        // Set Vertical Guides & Snap
        if (!this.CurrentLayerObject.Container) {
            return;
        }
        var ChildOffsetLeft, ObjOffsetLeft, FocusObjOffsetLeft, SnapLeft, SnapRight, ObjOffsetting, FocusObjCenterPos,
            ObjCenterSnapRight, ObjCenterSnapLeft, ObjCenterPos, CompNewLeft, CompLeft, NewGuideLeftPos,
            FocusNewLeftPostion, Obj, FocusChildOffsetWidth,
            // Set the Current Active layer.
            FocusObj = this.CurrentLayerObject.Container,
            GuideLeft = this.GetEditorObject.GuidesLeft(),
            GuideCenter = this.GetEditorObject.GuidesCenterV(),
            GuideRight = this.GetEditorObject.GuidesRight(),
            // Set the offsets of current active layer.
            FocusChildOffsetLeft = this.getFirstChild(FocusObj).offsetLeft,
            FocusObjOffsetWidth = this.getFirstChild(FocusObj).offsetWidth;
        if (FocusChildOffsetLeft === undefined) {
            this.SetCrossHairs("embed");
            return;
        }
        if (!this.getFirstChild(FocusObj) || !this.getFirstChild(FocusObj).hasAttribute("data-pneLayerNumber")) {
            this.SetCrossHairs("embed");
            return;
        }
        // If not in snap mode processXY
        if (this.ProcessXY === true) {
            // Set guides Left - Center - Right position.
            GuideLeft.style.display = "";
            GuideLeft.style.height = "20000" + "px";
            GuideLeft.style.backgroundColor = PNETOOLS.GuidesColor;
            GuideLeft.style.opacity = "1";
            GuideLeft.style.left = (parseInt(FocusObj.style.left) + FocusChildOffsetLeft + 1) + "px";
            GuideCenter.style.opacity = "1";
            GuideCenter.style.display = "";
            GuideCenter.style.backgroundColor = PNETOOLS.GuidesColor;
            GuideCenter.style.left = (parseInt(FocusObj.style.left) + FocusChildOffsetLeft + (parseInt(FocusObjOffsetWidth) / 2) + 1) + "px";
            GuideRight.style.opacity = "1";
            GuideRight.style.display = "";
            GuideRight.style.backgroundColor = PNETOOLS.GuidesColor;
            GuideRight.style.left = (parseInt(FocusObj.style.left) + FocusChildOffsetLeft + (FocusObjOffsetWidth) + 1) + "px";
        } else {
            GuideRight.style.display = "none";
            GuideLeft.style.display = "none";
            GuideCenter.style.display = "none";
        }
        // If snap is turned off do not process.
        if (this.ProximityLock || PNETOOLS.Snap === false) {
            return;
        }
        // Process the half width of the current layer object + - 20 px for proximity snap.
        ObjCenterSnapRight = (this.LayerAttributeWidth[LayerNumber] / 2 + this.LayerAttributeLeft[LayerNumber] + 20);
        ObjCenterSnapLeft = (this.LayerAttributeWidth[LayerNumber] / 2 + this.LayerAttributeLeft[LayerNumber] - 20);
        // Loop thru attributes
        for (var LayerPostion = this.LayerAttributeLeft.length - 1; LayerPostion >= 0;
            --LayerPostion) {
            // Process the left of the current layer object + - 20 px for proximity snap.
            SnapLeft = (this.LayerAttributeLeft[LayerNumber] + 20);
            SnapRight = (this.LayerAttributeLeft[LayerNumber] - 20);
            // Process center for proximity snap.
            ObjCenterPos = (this.LayerAttributeWidth[LayerPostion] / 2 + this.LayerAttributeLeft[LayerPostion]);
            // Calculate within proximity of snap object.
            if (LayerPostion != LayerNumber && this.LayerAttributeLeft[LayerPostion] < SnapLeft && this.LayerAttributeLeft[LayerPostion] > SnapRight || LayerPostion != LayerNumber && ObjCenterPos < ObjCenterSnapRight && ObjCenterPos > ObjCenterSnapLeft) {
                // Build layer object layer if in proximity
                Obj = this.GetCanvasObject.ContainerLayer(LayerPostion);
                if (!this.getFirstChild(Obj) || !this.getFirstChild(Obj).hasAttribute("data-pneLayerNumber")) {
                    continue;
                }
                // Set the offsets of the elements
                ChildOffsetLeft = this.getFirstChild(Obj).offsetLeft;
                FocusChildOffsetWidth = this.getFirstChild(Obj).offsetWidth;
                SnapLeft = (FocusChildOffsetLeft + 10);
                SnapRight = (FocusChildOffsetLeft - 10);
                FocusObjCenterPos = (parseInt(this.LayerAttributeWidth[LayerNumber] / 2 + this.LayerAttributeLeft[LayerNumber]));
                ObjOffsetLeft = (parseInt(this.LayerAttributeLeft[LayerPostion]) + ChildOffsetLeft);
                FocusObjOffsetLeft = (parseInt(this.LayerAttributeLeft[LayerNumber]) + FocusChildOffsetLeft);
                ObjOffsetting = ((parseInt(FocusChildOffsetWidth) / 2) + (parseInt(this.GetCanvasObject.ContainerLayer(LayerPostion).style.left) + ChildOffsetLeft));
                // if within 6px snap to object
                if (Math.abs((parseInt(Math.abs(ObjOffsetLeft) - Math.abs(FocusObjOffsetLeft)))) < 6 || Math.abs((parseInt(Math.abs(ObjOffsetting) - Math.abs(FocusObjCenterPos)))) < 6) {
                    // Process Center snap
                    if (Math.abs((parseInt(Math.abs(ObjOffsetting) - Math.abs(FocusObjCenterPos)))) < 6) {
                        CompNewLeft = ((ObjOffsetting - (parseInt(FocusObjOffsetWidth) / 2)) - FocusChildOffsetLeft);
                        FocusNewLeftPostion = CompNewLeft;
                        NewGuideLeftPos = ObjOffsetting;
                    } else {
                        // Process left snap
                        CompNewLeft = parseInt(+parseInt(Obj.style.left) + ChildOffsetLeft);
                        CompLeft = parseInt(+parseInt(FocusObj.style.left) + FocusChildOffsetLeft);
                        CompNewLeft = (CompNewLeft - CompLeft) + parseInt(FocusObj.style.left);
                        FocusNewLeftPostion = CompNewLeft;
                        NewGuideLeftPos = FocusNewLeftPostion + FocusChildOffsetLeft;
                    }
                    // If not curently snaped, snap the object.
                    if (this.ProcessXY === true) {
                        if (((FocusObjOffsetWidth / 2) + CompNewLeft) < 5 && ((FocusObjOffsetWidth / 2) + CompNewLeft) > -5) {
                            CompNewLeft = "-" + (FocusObjOffsetWidth / 2);
                            FocusNewLeftPostion = 0;
                        }
                        if (Math.abs(FocusNewLeftPostion + FocusChildOffsetLeft) - Math.abs(this.LayerAttributeLeft[LayerNumber]) > 10 || Math.abs(FocusNewLeftPostion + FocusChildOffsetLeft) - Math.abs(this.LayerAttributeLeft[LayerNumber]) < -10) {
                            return;
                        }
                        GuideRight.style.display = "none";
                        GuideLeft.style.display = "none";
                        GuideCenter.style.display = "none";
                        GuideLeft.style.display = "";
                        GuideLeft.style.height = "20000" + "px";
                        this.ProcessXY = false;
                        // Set the position and update the layer array attribute.
                        this.GetEditorObject.SnapDisplay().style.backgroundColor = PNETOOLS.GuidesSnapColor;
                        this.GetCanvasObject.ContainerLayer(this.CurrentLayerNumber).style.left = (FocusNewLeftPostion) + "px";
                        this.LayerAttributeLeft[LayerNumber] = (FocusNewLeftPostion + FocusChildOffsetLeft);
                        GuideLeft.style.backgroundColor = PNETOOLS.GuidesSnapColor;
                        GuideLeft.style.display = "";
                        GuideLeft.style.height = "20000" + "px";
                        GuideLeft.style.left = (NewGuideLeftPos) + "px";
                        // Wait 300 of a second before allowing object to move.
                        setTimeout("PlugNedit.ProcessXY=true", 300);
                    } else {
                        this.ProcessXY = 3;
                        // Wait 1 second after snap release before new snap can occur.
                        setTimeout("PlugNedit.ProcessXY=true", 1000);
                        this.GetEditorObject.SnapDisplay().style.color = "black";
                        this.GetEditorObject.SnapDisplay().style.backgroundColor = "white";
                    }
                    if (ObjOffsetLeft == FocusObjOffsetLeft) {
                        GuideLeft.style.left = ObjOffsetLeft + "px";
                        GuideLeft.style.backgroundColor = PNETOOLS.GuidesSnapColor;
                        GuideLeft.style.height = "20000" + "px";
                    }
                    break;
                }
            } else {
                // Display snaped in the editor window.
                this.GetEditorObject.SnapDisplay().style.color = "black";
                this.GetEditorObject.SnapDisplay().style.backgroundColor = "white";
            }
        }
    },
    SetGuidesH: function(LayerNumber) {
        // Set Horizontal Guides & Snap
        if (!this.CurrentLayerObject.Container) {
            return;
        }
        var ChildOffsetTop, ObjOffsetTop, FocusObjOffsetTop, SnapTop, SnapBottom, ObjOffsetting, FocusObjCenterPos,
            ObjCenterSnapBottom, ObjCenterSnapTop, ObjCenterPos, CompNewTop, CompTop, NewGuideTopPos,
            FocusNewTopPostion, Obj, FocusChildOffsetHeight,
            // Set the current layer object.
            FocusObj = this.CurrentLayerObject.Container,
            GuideTop = this.GetEditorObject.GuidesTop(),
            GuideCenter = this.GetEditorObject.GuidesCenterH(),
            GuideBottom = this.GetEditorObject.GuidesBottom(),
            // Set the current layer offsets.
            FocusChildOffsetTop = this.getFirstChild(FocusObj).offsetTop,
            FocusObjOffsetHeight = this.getFirstChild(FocusObj).offsetHeight;
        if (FocusChildOffsetTop === undefined) {
            this.SetCrossHairs("embed");
            return;
        }
        if (!this.getFirstChild(FocusObj) || !this.getFirstChild(FocusObj).hasAttribute("data-pneLayerNumber")) {
            this.SetCrossHairs("embed");
            return;
        }
        // If not in snap mode continue.
        // Process half screen and left postion of guides.
        if (this.ProcessXY === true) {
            GuideTop.style.display = "";
            GuideTop.style.height = 1 + "px";
            GuideTop.style.left = "-" + (this.WindowWidth / 2 - 5) + "px";
            GuideCenter.style.left = "-" + (this.WindowWidth / 2 - 5) + "px";
            GuideBottom.style.left = "-" + (this.WindowWidth / 2 - 5) + "px";
            GuideTop.style.width = (this.WindowWidth - 10) + "px";
            GuideCenter.style.width = (this.WindowWidth - 10) + "px";
            GuideBottom.style.width = (this.WindowWidth - 10) + "px";
            GuideTop.style.backgroundColor = PNETOOLS.GuidesColor;
            GuideTop.style.opacity = "1";
            GuideTop.style.top = (parseInt(FocusObj.style.top) + FocusChildOffsetTop + 1) + "px";
            GuideCenter.style.opacity = "1";
            GuideCenter.style.display = "";
            GuideCenter.style.backgroundColor = PNETOOLS.GuidesColor;
            GuideCenter.style.top = (parseInt(FocusObj.style.top) + FocusChildOffsetTop + (parseInt(FocusObjOffsetHeight) / 2) + 1) + "px";
            GuideBottom.style.opacity = "1";
            GuideBottom.style.display = "";
            GuideBottom.style.backgroundColor = PNETOOLS.GuidesColor;
            GuideBottom.style.top = (parseInt(FocusObj.style.top) + FocusChildOffsetTop + (FocusObjOffsetHeight) + 1) + "px";
        } else {
            GuideBottom.style.display = "none";
            GuideTop.style.display = "none";
            GuideCenter.style.display = "none";
        }
        // Check user setting to allow snap.
        if (this.ProximityLock || PNETOOLS.Snap === false) {
            return;
        }
        // Set the object snap offset + - 20 px
        ObjCenterSnapBottom = (this.LayerAttributeHeight[LayerNumber] / 2 + this.LayerAttributeTop[LayerNumber] + 20);
        ObjCenterSnapTop = (this.LayerAttributeHeight[LayerNumber] / 2 + this.LayerAttributeTop[LayerNumber] - 20);
        for (var F = this.LayerAttributeTop.length - 1; F >= 0;
            --F) {
            // Set current objects - + 20 px offset
            SnapTop = (this.LayerAttributeTop[LayerNumber] + 20);
            SnapBottom = (this.LayerAttributeTop[LayerNumber] - 20);
            ObjCenterPos = (this.LayerAttributeHeight[F] / 2 + this.LayerAttributeTop[F]);
            // Compute if objects are within snap range.
            if (F != LayerNumber && this.LayerAttributeTop[F] < SnapTop && this.LayerAttributeTop[F] > SnapBottom || F != LayerNumber && ObjCenterPos < ObjCenterSnapBottom && ObjCenterPos > ObjCenterSnapTop) {
                Obj = this.GetCanvasObject.ContainerLayer(F);
                if (!this.getFirstChild(Obj) || !this.getFirstChild(Obj).hasAttribute("data-pneLayerNumber")) {
                    continue;
                }
                // Set the offsets of the current layer
                ChildOffsetTop = this.getFirstChild(Obj).offsetTop;
                FocusChildOffsetHeight = this.getFirstChild(Obj).offsetHeight;
                // Set the focused element offset height to + - 10 px
                SnapTop = (FocusChildOffsetTop + 10);
                SnapBottom = (FocusChildOffsetTop - 10);
                FocusObjCenterPos = (parseInt(this.LayerAttributeHeight[LayerNumber] / 2 + this.LayerAttributeTop[LayerNumber]));
                // Set the offsets of the current layer object
                ObjOffsetTop = (parseInt(this.LayerAttributeTop[F]) + ChildOffsetTop);
                FocusObjOffsetTop = (parseInt(this.LayerAttributeTop[LayerNumber]) + FocusChildOffsetTop);
                ObjOffsetting = ((parseInt(FocusChildOffsetHeight) / 2) + (parseInt(this.GetCanvasObject.ContainerLayer(F).style.top) + ChildOffsetTop));
                // Calculate within range of snap object.
                if (Math.abs((parseInt(Math.abs(ObjOffsetTop) - Math.abs(FocusObjOffsetTop)))) < 6 || Math.abs((parseInt(Math.abs(ObjOffsetting) - Math.abs(FocusObjCenterPos)))) < 6) {
                    // Check if within middle snap.
                    if (Math.abs((parseInt(Math.abs(ObjOffsetting) - Math.abs(FocusObjCenterPos)))) < 6) {
                        CompNewTop = ((ObjOffsetting - (parseInt(FocusObjOffsetHeight) / 2)) - FocusChildOffsetTop);
                        FocusNewTopPostion = CompNewTop;
                        NewGuideTopPos = ObjOffsetting;
                    } else {
                        // Check if within left snap.
                        CompNewTop = parseInt(+parseInt(Obj.style.top) + ChildOffsetTop);
                        CompTop = parseInt(+parseInt(FocusObj.style.top) + FocusChildOffsetTop);
                        CompNewTop = (CompNewTop - CompTop) + parseInt(FocusObj.style.top);
                        FocusNewTopPostion = CompNewTop;
                        NewGuideTopPos = FocusNewTopPostion + FocusChildOffsetTop;
                    }
                    // Check if the snap should be processed.
                    if (this.ProcessXY === true) {
                        if (((FocusObjOffsetHeight / 2) + CompNewTop) < 5 && ((FocusObjOffsetHeight / 2) + CompNewTop) > -5) {
                            CompNewTop = "-" + (FocusObjOffsetHeight / 2);
                            FocusNewTopPostion = 0;
                        }

                        if (Math.abs(FocusNewTopPostion + FocusChildOffsetTop) - Math.abs(this.LayerAttributeTop[LayerNumber]) > 10 || Math.abs(FocusNewTopPostion + FocusChildOffsetTop) - Math.abs(this.LayerAttributeTop[LayerNumber]) < -10) {
                            return;
                        }
                        GuideBottom.style.display = "none";
                        GuideTop.style.display = "none";
                        GuideCenter.style.display = "none";
                        GuideTop.style.display = "";
                        GuideTop.style.height = "1" + "px";
                        // Stop processing the snap.
                        this.ProcessXY = false;
                        // Calculate center position with snap range.
                        // Set guides snap postion.
                        // Set the layers array, new top postion.
                        this.GetEditorObject.SnapDisplay().style.backgroundColor = PNETOOLS.GuidesSnapColor;
                        this.GetCanvasObject.ContainerLayer(this.CurrentLayerNumber).style.top = (FocusNewTopPostion) + "px";
                        this.LayerAttributeTop[LayerNumber] = (FocusNewTopPostion + FocusChildOffsetTop);
                        GuideTop.style.backgroundColor = PNETOOLS.GuidesSnapColor;
                        GuideTop.style.display = "";
                        GuideTop.style.height = "1" + "px";
                        GuideTop.style.top = (NewGuideTopPos) + "px";
                        // Stop snap for 1 / 3 of a second
                        setTimeout("PlugNedit.ProcessXY=true", 300);
                    } else {
                        // Do not re - snap for 1 second after snapping a object.
                        this.ProcessXY = 3;
                        setTimeout("PlugNedit.ProcessXY=true", 1000);
                        this.GetEditorObject.SnapDisplay().style.color = "black";
                        this.GetEditorObject.SnapDisplay().style.backgroundColor = "white";
                    }
                    if (ObjOffsetTop == FocusObjOffsetTop) {
                        GuideTop.style.top = ObjOffsetTop + "px";
                        GuideTop.style.backgroundColor = PNETOOLS.GuidesSnapColor;
                        GuideTop.style.height = 1 + "px";
                    }
                    F = 0;
                }
            } else {
                this.GetEditorObject.SnapDisplay().style.color = "black";
                this.GetEditorObject.SnapDisplay().style.backgroundColor = "white";
            }
        }
    },
    AdjustTheDiv: function(object, Type, Type2)
        // Auto Adjust the heigth of a div.
        {
            var self = PlugNedit;
            if (self.PNENull(self.CurrentLayerObject.HTMLDIV) || self.isImage(self.CurrentLayerObject.Container.id)) {
                return;
            }
            var ObjectOffset;
            if (!self.AltBrowser) {
                ObjectOffset = parseInt(self.CurrentLayerObject.HTMLDIV.offsetHeight);
            } else {
                ObjectOffset = parseInt(self.CanvasWindow.defaultView.getComputedStyle(self.CurrentLayerObject.HTMLDIV, "").getPropertyValue("height"));
            }
            // Sets scroll to overflow and the div height to 0px, the checks the actual content height.
            var NewHeight = ObjectOffset,
                ObjOrigH = parseInt(self.CurrentLayerObject.HTMLDIV.style.height);
            self.CurrentLayerObject.Container.style.overflow = "scroll";
            self.CurrentLayerObject.HTMLDIV.style.overflow = "scroll";
            self.CurrentLayerObject.HTMLDIV.style.height = 0 + "px";
            NewHeight = self.CurrentLayerObject.HTMLDIV.scrollHeight;
            self.CurrentLayerObject.HTMLDIV.style.overflow = "hidden";
            self.CurrentLayerObject.Container.style.overflow = "hidden";
            self.CurrentLayerObject.HTMLDIV.style.height = ObjOrigH + 'px';

            if (Type2) {
                self.SetHighestset = NewHeight;
                self.CurrentLayerObject.Container.style.height = ObjectOffset + "px";
                return;
            }
            if (parseInt(self.CurrentLayerObject.Container.style.height) < NewHeight || Type !== undefined) {
                // Crunches or expands the div to the new siz.
                self.CurrentLayerObject.HTMLDIV.style.height = NewHeight + "px";
                self.CurrentLayerObject.Container.style.height = NewHeight + (self.OffsetInnerObject(self.CurrentLayerObject.HTMLDIV) * 2) + "px";
                self.LayerAttributeHeight[self.RNum(self.CurrentLayerObject.HTMLDIV.id)] = NewHeight;
                self.CleanWorkArea();
            }
        },
    SetToolBarParams: function() {
        if (!this.CurrentLayerObject.Editable) {
            return;
        }
        // Selects the style tag of current inner object div and sets the toolbars to match,
        var ShadowStyle, f, ObjInnerDiv = this.CurrentLayerObject.Editable,
            ObjInnerStyle = this.CurrentLayerObject.Editable.getAttribute('style'),
            StyleObject, ObjectNumber, r,
            IdPrefix = '';
        // Split the style tag into.
        ObjInnerStyle = ObjInnerStyle.split(';');
        // Check if image and set the Id to reflect the image attributes ID
        if (this.isImage(this.CurrentLayerObject.Editable.id)) {
            IdPrefix = 'I';
        }
        // Add Objects
        ObjInnerStyle.push("borderStyle", "borderWidth", "borderColor", "borderRadius");
        for (var o = ObjInnerStyle.length - 1; o >= 0;
            --o) {
            // Replace the - to conform to the set style property
            StyleObject = ObjInnerStyle[o].split(':');
            ObjectNumber = StyleObject[0].indexOf("-");
            StyleObject[0] = StyleObject[0].replace("-", "");
            // Set to upper case and join members.
            if (!this.PNENull(ObjectNumber)) {
                StyleObject[0] = this.setCharAt(StyleObject[0], ObjectNumber, StyleObject[0].charAt(ObjectNumber).toUpperCase()).split(' ').join('');
            }
            // Check if color and convert to HEX.
            if (this.RE(StyleObject[0] + IdPrefix)) {
                if (StyleObject[0].match(/color/gi)) {
                    this.RE(StyleObject[0] + IdPrefix).value = '#' + this.SortRGB(ObjInnerDiv.style[StyleObject[0]]);
                    this.RE(StyleObject[0] + IdPrefix).style.backgroundColor = '#' + this.SortRGB(ObjInnerDiv.style[StyleObject[0]]);
                } else {
                    // Set toolbar values.
                    this.RE(StyleObject[0] + IdPrefix).value = ObjInnerDiv.style[StyleObject[0]];
                }
            }
        }
        // Check if text shadow and color, convert to HEX and set toolbar.
        if (ObjInnerDiv.style.textShadow) {
            if (ObjInnerDiv.style.textShadow.match("rgb")) {
                this.RE("textShadowColor" + IdPrefix).style.backgroundColor = "#" + this.SortRGB(ObjInnerDiv.style.textShadow);
                this.RE("textShadowColor" + IdPrefix).value = "#" + this.SortRGB(ObjInnerDiv.style.textShadow);
                if (ObjInnerDiv.style.textShadow.match("rgb")) {
                    f = /(.*?)rgb\(.*?\)/.exec(ObjInnerDiv.style.textShadow);
                    ShadowStyle = ObjInnerDiv.style.textShadow;
                    this.RE("textShadow" + IdPrefix).value = ShadowStyle.replace(/(.?)rgb\(.*?\)/, "").replace(/^\s+|\s+$/g, "");
                }
            }
        } else {
            if (this.RE("textShadow" + IdPrefix)) {
                this.RE("textShadow" + IdPrefix).value = "";
            }
        }
        if (ObjInnerDiv.style.boxShadow) {
            // Check if box shadow and color, convert to HEX and set toolbar
            if (ObjInnerDiv.style.boxShadow.match("rgb")) {
                this.RE("boxShadowColor" + IdPrefix).style.backgroundColor = "#" + this.SortRGB(ObjInnerDiv.style.boxShadow);
                this.RE("boxShadowColor" + IdPrefix).value = "#" + this.SortRGB(ObjInnerDiv.style.boxShadow);
                if (ObjInnerDiv.style.boxShadow.match("rgb")) {
                    f = /(.*?)rgb\(.*?\)/.exec(ObjInnerDiv.style.boxShadow);
                    // Update the box shadow values
                    ShadowStyle = ObjInnerDiv.style.boxShadow;
                    this.RE("boxShadow" + IdPrefix).value = ShadowStyle.replace(/(.?)rgb\(.*?\)/, "").replace(/^\s+|\s+$/g, "");
                }
            }
        } else {
            if (this.RE("boxShadow" + IdPrefix)) {
                this.RE("boxShadow" + IdPrefix).value = "";
            }
        }
    },
    EditorObjectSpecial: function(TargetSrc) {
        // Check if the user is using the resize or pull donw handles.
        // Set the editor to the proper objects.
        if (TargetSrc.id == "Resize") {
            this.GetEditorObject.MenuContainer().style.display = PNETOOLS.DisplayMenu;
            this.GetEditorObject.NudgeDisplay().style.display = PNETOOLS.NudgeDisplay;
            this.SetCurrentLayerObject();
            TargetSrc = this.BuildEditorLayer(this.CurrentLayerNumber);
            this.CurrentObjectID = TargetSrc.id;
            this.LockedElement = this.BuildEditorLayer(this.CurrentLayerNumber);
            this.ProximityHot = "Resize";
            this.ProximityLock = this.ProximityHot;

        }
        if (TargetSrc.id == "ResizeMove") {

            this.GetEditorObject.MenuContainer().style.display = PNETOOLS.DisplayMenu;
            this.GetEditorObject.NudgeDisplay().style.display = PNETOOLS.NudgeDisplay;
            this.SetCurrentLayerObject();
            TargetSrc = this.BuildEditorLayer(this.CurrentLayerNumber);
            this.CurrentObjectID = TargetSrc.id;
            this.LockedElement = this.BuildEditorLayer(this.CurrentLayerNumber);
            this.DragSelectObjects();
            this.PNEMoveBelow = true;
            this.ProximityHot = "Resize";
            this.ProximityLock = this.ProximityHot;
        }
        return TargetSrc;
    },
    ToolTip: function(Message) {
        // Simple tooltip display.
        var object = this.GetEditorObject.ToolTip();
        if (Message === false) {
            object.style.visibility = "hidden";
            return;
        }
        var OffsetLeft = 0;
        var OffsetTop = 40;
        if (this.AltBrowser) {
            OffsetTop = this.TempScrollTop;
        }
        if (this.MousePX > 500) {
            OffsetLeft = 300;
        }
        object.innerHTML = Message;
        object.style.left = this.MousePX - OffsetLeft + "px";
        object.style.top = this.MousePY + OffsetTop + "px";
        object.style.visibility = "visible";
    },
    DragSelectObjects: function(object) {
        // Get the layer array Height / Top Attributes
        this.Movealllayerspivot = this.LayerAttributeHeight[this.CurrentLayerNumber];
        object = this.LayerAttributeHeight[this.CurrentLayerNumber] + this.LayerAttributeTop[this.CurrentLayerNumber];
        // Loop thru array and find objects below current object.
        for (var LayerNumber = this.LayerAttributeTop.length - 1; LayerNumber >= 0;
            --LayerNumber) {
            if (this.LayerAttributeTop[LayerNumber] > object) {
                // Set the top posion and layer number to a temp array.
                this.PNELayerdrag[LayerNumber] = this.LayerAttributeTop[LayerNumber];
            }
        }
    },
    MoveObjectsBelow: function(NewTop) {
        // Set new top position offset.
        var Pivot = NewTop - this.Movealllayerspivot,
            ObjHeight = this.LayerAttributeTop[this.CurrentLayerNumber] + this.SetHighestset + 28;
        for (var DragLayer = this.PNELayerdrag.length - 1; DragLayer >= 0;
            --DragLayer) {
            if (this.PNELayerdrag[DragLayer] !== undefined) {
                if (ObjHeight !== 0 && ObjHeight > this.PNELayerdrag[DragLayer] + Pivot) {
                    return;
                }
            }
        }
        // Loop thru array of objects bellow current layer active and move to new position.
        for (DragLayer = this.PNELayerdrag.length - 1; DragLayer >= 0;
            --DragLayer) {
            if (this.PNELayerdrag[DragLayer] !== undefined) {
                this.GetCanvasObject.ContainerLayer(DragLayer).style.top = this.PNELayerdrag[DragLayer] + Pivot + "px";
                this.LayerAttributeTop[DragLayer] = this.PNELayerdrag[DragLayer] + Pivot;
                this.GetEditorObject.EditorLayer(DragLayer).style.top = this.PNELayerdrag[DragLayer] + Pivot - 15 + "px";
            }
        }
    },
    getFirstChild: function(Obj) {
        // Find first usable child
        try {
            var FirstChild = Obj.firstChild;
            while (FirstChild !== null && FirstChild.nodeType == 3) {
                FirstChild = FirstChild.nextSibling;
                break;
            }
            // Check if block level link, move to outer div.
            if (FirstChild.tagName == "A") {
                FirstChild = FirstChild.firstChild;
                while (FirstChild !== null && FirstChild.nodeType == 3) {
                    FirstChild = FirstChild.nextSibling;
                    break;
                }
            }
            return FirstChild;
        } catch (b) {
            return false;
        }
    },
    SetRightClickOption: function(DisplayType) {
        // Set the editor right click menu to display proper buttons.
        var object = this.GetEditorObject.RightClickMenu(),
            ColorSet, TopPostion;
        if (DisplayType !== 0) {
            if (DisplayType == 2) {
                // Active color
                ColorSet = "black";
            } else {
                // Inactive Color
                ColorSet = "gray";
            }
            object.style.left = this.MousePX - 205 + "px";
            if (this.AltBrowser) {
                TopPostion = this.TempScrollTop;
            } else {
                TopPostion = 0;
            }
            object.style.top = TopPostion + this.MousePY + "px";
            object.style.visibility = "visible";
            for (var e = 1; e < 8; e++) {
                // Loop thru and color right click to Active / Inactive color
                this.RE("RightMouseClickOptionNoEdit" + e).style.color = ColorSet;
            }
        } else {
            object.style.visibility = "hidden";
        }
    },
    CKDestroy: function() {
        // Destroy CKEditor Instance,
        try {
            for (var name in this.CKEDITOR.instances) {
                this.CKEDITOR.instances[name].destroy();
            }
            this.CKEDITORStatus = "Destroyed";
        } catch (e) {}
    },
    Insertckmove: function() {

        // Inserts buttons next to the CKeditor for adjusting the postion of the toolbar.
        var Count, InstanceName, DivElement, ObjectUp, ObjectDown;
        this.PNEkrepeat = this.PNEkrepeat + 1;
        if (this.PNEkrepeat > 30) {
            this.PNEkrepeat = 0;
            return;
        }
        setTimeout(function(b) {
            try {
                for (var g in CKEDITOR.instances) {
                    Count = g;
                    break;
                }
                InstanceName = this.CKKey.Prefix + CKEDITOR.instances[Count].name;
                DivElement = document.createElement("div");
                ObjectUp = "this.RE('" + InstanceName + "').style.bottom='';this.RE('" + InstanceName + "').style.top='0px';this.RE('" + InstanceName + "').style.position='fixed';this.RE('" + InstanceName + "').style.height='100px'";
                ObjectDown = "this.RE('" + InstanceName + "').style.bottom='75px';this.RE('" + InstanceName + "').style.top='';this.RE('" + InstanceName + "').style.position='fixed';this.RE('" + InstanceName + "').style.height='100px'";
                DivElement.style.width = "0px";
                DivElement.style.height = "0px";
                DivElement.style.position = "relative";
                DivElement.style.left = "-40px";
                DivElement.style.top = "-80px";
                DivElement.innerHTML = '<img src="assets/32x32/up.png" style="cursor:pointer;" onClick="' + ObjectUp + '" ><br><img src="assets/32x32/down.png"   style="cursor:pointer;" onClick="' + ObjectDown + '"> ';
                DivElement.style.overflow = "visible";
                DivElement.style.zIndex = "1";
                this.RE(InstanceName).appendChild(DivElement);
                this.PNEkrepeat = 0;
                this.RE(InstanceName).style.bottom = "75px";
                this.RE(InstanceName).style.top = "";
                this.RE(InstanceName).style.position = "fixed";
                this.RE(InstanceName).style.height = "100px";
            } catch (h) {
                this.Insertckmove();
            }
        }, 500);
    },
    RenewInline: function() {
        // Renew CKEditor

        if (PNETOOLS.CKEditor === false) {
            return;
        }
        var ckscript = this.CanvasWindow.defaultView.window.CKEDITOR;

        this.CKEDITOR.inline(this.EditableDivLayer);

        // Set Ckeditor offsets if you desire them.

        // this.CKEDITOR.config.startupFocus = true;
        // this.CKEDITOR.config.floatSpaceDockedOffsetY = 28;
        // this.CKEDITOR.config.floatSpacePinnedOffsetY = 100;
        // this.CKEDITOR.config.floatSpaceDockedOffsetX = 0;
        // this.CKEDITOR.config.floatSpacePinnedOffsetX = 0;
        // this.CKEDITORcurrentStatus = true;
        ckscript.CKEDITORStatus = "Inline";


        // Insert Ckedit hinge for moving the editor if you wish.

        //  CKEDITOR.on ( "instanceReady", function ( a )
        //   {
        //     this.Insertckmove ( );
        //     });
        // Load custome fonts into the editor if you wish.
        // this.LoadPNECKFonts ( );
    },
    ContentEditableFalse: function() {
        // Set canvas objects to not allow content editable.

        var Divs = this.CanvasWindow.getElementsByTagName("div");
        for (var DivObj = 0; a < Divs.length; a++) {
            if (Divs[DivObj].id.match(this.KEY.DivObjectI)) {
                Divs[DivObj].setAttribute("contentEditable", "false");
            }
        }


    },
    CheckRenewal: function(obj, objid) {
        // Not in use but maybe helpful under certian design conditions.
        // Check CKEditor renewal.
        //    if (obj.id != objid)
        //   {
        //    this.CKDestroy ( );
        //   }
    },
    ResetDisplay: function() {
        // Loop thru canvas objects and set the highlighted border color to transparent.
        for (var LayerNumber = this.LayerLevels.length - 1; LayerNumber >= 0;
            --LayerNumber) {
            if (this.GetCanvasObject.ContainerLayer(LayerNumber)) {
                this.GetCanvasObject.ContainerLayer(LayerNumber).style.borderColor = "transparent";
            }
        }
    },
    MouseWich: function(TargetObj, TargetSrc) {
        // Check which mouse button has been clicked and diplay the right mouse click menu .
        if (TargetObj.which) {
            if (TargetObj.which == 3) {
                if (TargetSrc.getAttribute("data-pneLayerNumber")) {
                    this.SetRightClickOption(2);
                } else {
                    //  this.SetRightClickOption ( 1 );
                }
            } else {
                if (!TargetSrc.id.match("RightMouseClickOption")) {
                    this.SetRightClickOption(0);
                }
            }
        }
    },
    IsCanvasLayer: function(TargetSrc) {
        // Check if current HTML object is inside a canvas layer.
        var h = false;
        this.InCKeditorWindow = false;
        if (!TargetSrc.hasAttribute("id") || TargetSrc.id && !this.TestOBJECT(this.LayersEditableDivs, TargetSrc.id)) {
            var FindTarget = TargetSrc,
                g = 1;
            while (FindTarget) {
                if (FindTarget.parentNode === null) {
                    break;
                }
                FindTarget = FindTarget.parentNode;
                g++;
                if (FindTarget.nodeType !== 1 || !FindTarget.hasAttribute("id")) {
                    continue;
                }
                if (FindTarget.id.match(this.CKKey.Prefix)) {
                    this.InCKeditorWindow = true;
                }
                if (this.TestOBJECT(this.LayersEditableDivs, FindTarget.id)) {
                    break;
                }
            }
            if (FindTarget.nodeType === 1 && FindTarget.hasAttribute("id") && this.TestOBJECT(this.LayersEditableDivs, FindTarget.id)) {
                TargetSrc = FindTarget;
            }
        }
        return TargetSrc;
    },
    DisplayLog: function() {
        // Diisplay log debug
        document.getElementById('DebugDisplay').style.display = 'none';
        document.getElementById('DebugContainer').style.display = 'none';
        
        var output = "<br><span style='color:red;font-size:17px'>Debug Mode</span><br><br>";
        output = output + "<br><span style='color:red'>Image Layer</span>  " + this.ImageLayer;
        output = output + "<br><span style='color:red'>Editor Layer</span>  " + this.EditorLayer;
        output = output + "<br><span style='color:red'>Editable Div Layer</span>  " + this.EditableDivLayer;
        output = output + "<br><span style='color:red'>Multiple Select Mode</span>  " + this.MultipleSelectMode;
        output = output + "<br><span style='color:red'>Layers Canvas Containers </span>  " + this.LayersCanvasContainers.slice();
        output = output + "<br><span style='color:red'>Layers Editor Divs </span>  " + this.LayersEditorDivs.slice();
        output = output + "<br><span style='color:red'>Layers Container Types </span>  " + this.LayersContainerTypes.slice();
        output = output + "<br><span style='color:red'>Layers Editable Types </span>  " + this.LayersEditableTypes.slice();
        output = output + "<br><span style='color:red'>Layers Editor Divs </span>  " + this.LayersEditorDivs.slice();
        output = output + "<br><span style='color:red'>Layers Canvas Containers</span>  " + this.LayersCanvasContainers.slice();
        output = output + "<br><span style='color:red'>Layers Image Containers</span>  " + this.LayersImageContainers.slice();
        output = output + "<br><span style='color:red'>Layers Image Objects</span>  " + this.LayersImageObjects.slice();
        output = output + "<br><span style='color:red'>Multiple Select Objects </span>  " + this.MultipleSelectObjects.slice();
        output = output + "<br><span style='color:red'>Embed </span>  " + this.PNEEmbedLayer.slice();
        output = output + "<br><span style='color:red'>layer Attriubute </span>  " + this.LayerAttribute.slice();
        output = output + "<br><span style='color:red'>LayersEditableDivs</span>  " + this.LayersEditableDivs.slice();
        output = output + "<br><span style='color:red'>Layer Names </span>  " + this.LayerNames.slice();
        output = output + "<br><span style='color:red'>Layer Types </span>  " + this.LayerType.slice();
        output = output + "<br><span style='color:red'>Layer Levels</span>  " + this.LayerLevels.slice();
        output = output + "<br><span style='color:red'>Layer Widths</span>  " + this.LayerAttributeWidth.slice();
        output = output + "<br><span style='color:red'>Layer Heights</span>  " + this.LayerAttributeHeight.slice();
        output = output + "<br><span style='color:red'>Layer Attribute </span>  " + this.LayerAttribute.slice();
        output = output + "<br><span style='color:red'>Layer Top</span>  " + this.LayerAttributeTop.slice();
        output = output + "<br><span style='color:red'>Layer Left </span>  " + this.LayerAttributeLeft.slice();
        output = output + "<br><span style='color:red'>Layer Left Offsets </span>  " + this.LayerOffSetLeft.slice();
        output = output + "<br><span style='color:red'>Layer Top Offsets</span>  " + this.LayerOffSetTop.slice();
        output = output + "<br><span style='color:red'>Layer Padding </span>  " + this.LayerPadding.slice();
        output = output + "<br><span style='color:red'>Temp x </span>  " + this.TempPointX.slice();
        output = output + "<br><span style='color:red'>Temp y </span>  " + this.TempPointY.slice();
        output = output + "<br><span style='color:red'>Layer Visibility</span>  " + this.LayerAttributeVisiblity.slice();
        output = output + "<br><span style='color:red'>Layer Filter</span>  " + this.LayerTransFilter.slice();
        output = output + "<br><span style='color:red'>Control Left</span>  " + this.ControlLeft.slice();
        output = output + "<br><span style='color:red'>Linked Layers</span>  " + this.LayerLinks.slice();
        output = output + "<br><span style='color:red'>Layers Angle</span>  " + this.LayerTransAngle.slice();
        output = output + "<br><span style='color:red'>Image Actual Height </span>  " + this.ImageActualH.slice();
        output = output + "<br><span style='color:red'>Image Actual Width </span>  " + this.ImageActualW.slice();
        document.getElementById('DebugDisplay').innerHTML = output;
    },
    SelectItems: function() {
       
        // Multi Selection of layers for drag, used when user clicks and drags over body.
        if (!this.PNENull(this.CurrentObjectID) && !this.CurrentObjectID.match("ICG1ADDON")) {
            return;
        }
        var SelectRectangle = screen.width / 2 - 9,
            MousePostion = this.PNEMouseXY.split(","),
            Rectangle1,
            Rectangle2, Rectangle3, Rectangle4;
        // Build rectangle to check if layer objects are within the selected area.
        if (this.MousePX > MousePostion[0]) {
            Rectangle1 = MousePostion[0] - SelectRectangle;
            Rectangle2 = this.MousePX - SelectRectangle;
        } else {
            Rectangle2 = MousePostion[0] - SelectRectangle;
            Rectangle1 = this.MousePX - SelectRectangle;
        }
        if (this.MousePY > MousePostion[1]) {
            Rectangle3 = MousePostion[1];
            Rectangle4 = this.MousePY;
        } else {
            Rectangle4 = MousePostion[1];
            Rectangle3 = this.MousePY;
        }
        // Reset mulit select objects..
        this.MultipleSelectMode = false;
        this.MultipleSelectObjects.length = 0;
        var Count = 0;
        // Loop thru layers array
        for (var LayerLevels = this.LayerAttributeLeft.length - 1; LayerLevels >= 0;
            --LayerLevels) {
            if (this.LayerAttributeLeft[LayerLevels] !== undefined) {
                // Select objects located inside the user selected rectangle.
                if (this.LayerAttributeLeft[LayerLevels] > Rectangle1 && this.LayerAttributeLeft[LayerLevels] < Rectangle2 && this.LayerAttributeTop[LayerLevels] > Rectangle3 && this.LayerAttributeTop[LayerLevels] < Rectangle4 || this.LayerAttributeLeft[LayerLevels] < Rectangle1 && this.LayerAttributeLeft[LayerLevels] > Rectangle2 && this.LayerAttributeTop[LayerLevels] < Rectangle3 && this.LayerAttributeTop[LayerLevels] > Rectangle4) {
                    // Select multi select objects.
                    this.MultipleSelectMode = true;
                    this.MultipleSelectObjects[Count] = LayerLevels;
                    Count++;
                    // Set the borders to highlight the select objects.
                    this.GetCanvasObject.ContainerLayer(LayerLevels).style.borderStyle = "Solid";
                    this.GetCanvasObject.ContainerLayer(LayerLevels).style.borderColor = "Yellow";
                }
            }
        }
    },
    SendControl: function() {
        // CKEditor hack for plugnedit, shares control of objects with CKEditor.
        if (CKEDITOR && CKEDITOR.currentInstance && CKEDITOR.currentInstance.name.match(this.KEY.DivObjectI)) {
            if (!this.LockedElement || this.LockedElement && !this.LockedElement.match(this.CKKey.Prefix)) {
                this.PNETOCKEditor = true;
            }
        } else {
            this.PNETOCKEditor = false;
            if (this.AdjustTheDivINT) {
                clearInterval(this.AdjustTheDivINT);
            }
        }
    },
    ResetCrossHairs: function() {
        // Hides the guides cross hairs.
        this.GetEditorObject.GuidesLeft().style.display = "none";
        this.GetEditorObject.GuidesTop().style.display = "none";
        this.GetEditorObject.GuidesBottom().style.display = "none";
        this.GetEditorObject.GuidesRight().style.display = "none";
        this.GetEditorObject.GuidesCenterH().style.display = "none";
        this.GetEditorObject.GuidesCenterV().style.display = "none";
    },
    DoubleDown: function(TargetObj) {
        return;
        // Double click function.
        var b, self = PlugNedit;


        TargetObj = TargetObj ? TargetObj : window.event;
        var TargetSrc = TargetObj.target ? TargetObj.target : TargetObj.srcElement;

        TargetSrc = self.IsCanvasLayer(TargetSrc);

        if (self.EditableDivLayer !== false && self.TestOBJECT(self.LayersEditableDivs, TargetSrc.id) && self.AllowContentEditable === true) {
            self.RenewInline();
            self.RemoveContentEditable();
            self.REI(self.EditableDivLayer).setAttribute("contentEditable", "true");
            self.Editablecontent = true;
        }

    },
    NewHTMLLayer: function(m, g, b) {
        // Hide toolbars, Destroy CKEditor.
        PNETOOLS.HideEditorObjects();
        this.CKDestroy();
        var LeftPosition, l, d, NewCanvasContainer, OuterDivClone, NewEditorDiv, Emebed = false;
        // Set all layer attributes.
        this.SingleEdit = 0;
        // Not in use.
        // Layer number count plus 1. used to identify the layer in the layers attributes arrays.
        this.LayerNumber = +this.LayerNumber + 1;
        this.LayerName = this.LayerName + 1;
        this.LayerAttributeHeight[this.LayerNumber] = 300;
        this.LayerAttributeWidth[this.LayerNumber] = 600;
        l = "100%";
        LeftPosition = -205 + this.LayerOffSetStep;
        this.LayerAttributeTop[this.LayerNumber] = (200 + this.LayerOffSetStep + this.TempScrollTop) - this.inlineOffestY - this.KeyOffset.Top;
        this.LayerOffSetStep = this.LayerOffSetStep + 5;
        this.LayerAttributeLeft[this.LayerNumber] = LeftPosition;
        this.LayerPadding[this.LayerNumber] = 3;
        // Set the editor Object ID Key
        this.LayersContainerTypes[this.LayerNumber] = this.KEY.CanvasDiv;
        this.LayerType[this.LayerNumber] = this.KEY.EditorDiv;
        this.LayersEditableTypes[this.LayerNumber] = this.KEY.DivObjectI;
        this.EditableDivLayer = this.BuildEditableLayer(this.LayerNumber);
        this.EditorLayer = this.BuildEditorLayer(this.LayerNumber);
        this.LayerNumberActive = this.LayerNumber;
        this.LayerLevels[this.LayerNumber] = this.LayerNumber;
        LayerLevelToggle = this.LayerNumber;
        this.LayerOffSetLeft[this.LayerNumber] = this.KeyOffset.InnerDiv;
        this.LayerOffSetTop[this.LayerNumber] = this.KeyOffset.InnerDiv;
        this.LayerAttributeVisiblity[this.LayerNumber] = "visible";
        this.ilayers = 1;
        this.LayerCount = this.LayerCount + 1;
        if (this.PNECKEditorLoaded === false) {
            d = "Click to enter text or move item. Double click to toggle between selecting text and move item.";
        } else {
            d = "";
        }
        if (!this.PNENull(m)) {
            d = m;
        }
        // Create Object Elements.
        // Objects are placed both in the Editor window and Canvas window.
        NewCanvasContainer = document.createElement("div");
        NewCanvasContainer.id = this.BuildContainerLayer(this.LayerNumber);
        NewCanvasContainer.setAttribute("data-pnelnatrbt", this.LayerName);
        NewCanvasContainer.setAttribute("data-layertype", this.KEY.CanvasDiv);
        NewCanvasContainer.setAttribute("data-pnepermitresize", "1");
        NewCanvasContainer.setAttribute("data-pnepermitmove", "1");
        NewCanvasContainer.setAttribute("data-pneLayerNumber", this.LayerNumber);
        NewCanvasContainer.setAttribute("data-layeropacity", "1");
        NewCanvasContainer.setAttribute("data-layerfilter", "100");
        NewCanvasContainer.setAttribute("data-type", "MVBDRW");
        NewCanvasContainer.setAttribute("data-layertype", this.KEY.EditorDiv);
        NewCanvasContainer.setAttribute("data-pneobject", 1);
        NewCanvasContainer.setAttribute("data-wlt", this.KEY.CanvasDiv);
        NewCanvasContainer.setAttribute("data-ilt", this.KEY.DivObjectI);
        NewCanvasContainer.setAttribute("style", "filter:alpha(opacity=100);opacity:1;margin:0px;font-size:12px;border-color:" + this.bordercolor + "; border-width:1px; border-style:solid; position:absolute; background-color:transparent; top:" + this.LayerAttributeTop[this.LayerNumber] + "px; left:" + this.LayerAttributeLeft[this.LayerNumber] + "px; width:" + this.LayerAttributeWidth[this.LayerNumber] + "px; height:" + this.LayerAttributeHeight[this.LayerNumber] + "px; z-index:" + this.LayerLevels[this.LayerNumber] + "; overflow:visible;line-height:normal;padding: 3px 3px 3px 3px;border-spacing:0px");
        this.LayersCanvasContainers.push(this.BuildContainerLayer(this.LayerNumber));
        this.REI(this.CurrentCanvas).appendChild(NewCanvasContainer);
        NewHTMLLayer = this.REI(NewCanvasContainer.id).cloneNode();
        NewHTMLLayer.setAttribute("data-pneobject", 2);
        NewHTMLLayer.id = this.BuildEditableLayer(this.LayerNumber);
        this.LayersEditableDivs.push(this.BuildEditableLayer(this.LayerNumber));
        NewHTMLLayer.setAttribute("data-layertype", this.KEY.DivObjectI);
        NewHTMLLayer.setAttribute("class", "pneinline");
        NewHTMLLayer.setAttribute("data-type", "MVBDRWI");
        NewHTMLLayer.setAttribute("contentEditable", true);
        NewHTMLLayer.setAttribute("data-editortype", "text");
        NewHTMLLayer.setAttribute("style", "font-family:Arial, Arial, Helvetica, sans-serif;font-size:16px; background-color:#ffffff;border-color:#000000;border-style:none; border-top-width:1px; border-right-width: 1px;border-bottom-width: 1px;border-left-width:1px;padding: 5px 5px 5px 5px;border-spacing: 6px; width: " + (this.LayerAttributeWidth[this.LayerNumber] - this.KeyOffset.InnerDiv) + "px; height:" + (this.LayerAttributeHeight[this.LayerNumber] - this.KeyOffset.InnerDiv) + "px;text-align:left;position:static;margin: 0px auto;overflow:visible;word-wrap:break-word;letter-spacing:normal;line-height:normal;font-weight:normal;color:#000000;-moz-user-modify: read-write;-webkit-user-modify: read-write;");
        this.REI(NewCanvasContainer.id).appendChild(NewHTMLLayer);
        this.REI(NewHTMLLayer.id).innerHTML = d;
        NewEditorDiv = this.REI(NewCanvasContainer.id).cloneNode();
        NewEditorDiv.id = this.BuildEditorLayer(this.LayerNumber);
        this.LayersEditorDivs.push(NewEditorDiv.id);
        NewEditorDiv.setAttribute("data-layertype", this.KEY.EditorDiv);
        NewEditorDiv.setAttribute("style", "background: url(assets/24x24/move.png);background-repeat:no-repeat;visibility:visible;border-bottom-color:black; border-style:None; border-width:0px; position:absolute; background-color:transparent; top:" + (this.LayerAttributeTop[this.LayerNumber] - PNETOOLS.EditorToolbarOffsetTop) + "px; left:" + this.LayerAttributeLeft[this.LayerNumber] + "px; width:35px; height:24px; z-index:1001; overflow:visible;opacity:1;filter:alpha(opacity=100);cursor: move");
        this.GetEditorObject.EditorMirrorCanvas().appendChild(NewEditorDiv);
        this.GetEditorObject.LayerNamesInput().value = "Default " + this.LayerCount;
        this.SelectLayerStyle();
        this.GetEditorObject.LayerNameDialogBox().style.visibility = "visible";
        this.SetCurrentLayerObject(this.LayerNumber);
        this.FirstEdit = 1;
        this.ControlLayers();
        this.SetContentEditable('false');
        this.RenewInline();
    },
    PlaceImage: function(SRC, h, g) {
        // Hide menus and destroy the ckeditor.
        PNETOOLS.HideEditorObjects();
        var LeftPosition, l, b, NewCanvasContainer, NewImageObject, NewEditorDiv;
        this.objImage = new Image();
        // Set basic layer number count.
        this.SingleEdit = 0;
        this.LayerNumber = +this.LayerNumber + 1;
        this.ImageNumber = this.LayerNumber;
        this.LayerPadding[this.LayerNumber] = 0;
        this.LayerAttributeHeight[this.ImageNumber] = 300;
        this.LayersContainerTypes[this.LayerNumber] = this.KEY.CanvasImage;
        this.LayersEditableTypes[this.LayerNumber] = this.KEY.ImageObject;
        // Set the left to the half screen and compute new left postion.
        LeftPosition = -205 + this.LayerOffSetStep;
        // Set the layers global array settings.
        this.LayerAttributeLeft[this.LayerNumber] = LeftPosition;
        this.LayerAttributeTop[this.LayerNumber] = (90 + this.LayerOffSetStep + this.TempScrollTop) - this.inlineOffestY - this.KeyOffset.Top;
        this.LayerType[this.ImageNumber] = this.KEY.EditorImage;
        this.LayerNumberActive = this.ImageNumber;
        this.LayerLevels[this.ImageNumber] = this.ImageNumber;
        this.LayerAttributeVisiblity[this.ImageNumber] = "visible";
        this.LayerCount = this.LayerCount + 1;
        this.EditorLayer = this.BuildContainerLayer(this.ImageNumber);
        this.LayerAttributeWidth[this.LayerNumber] = 300;
        l = this.LayerAttributeTop[this.LayerNumber] - PNETOOLS.EditorToolbarOffsetTop + "px";
        b = this.LayerAttributeTop[this.LayerNumber] + "px";
        // Set the input layer name to the default name.
        this.GetEditorObject.LayerNamesInput().value = "Default " + this.LayerCount;
        this.GetEditorObject.LayerNameDialogBox().style.visibility = "visible";
        // Create the objects of the layer and insert into both the Editor and Canvas windows.
        NewCanvasContainer = document.createElement("div");
        NewCanvasContainer.id = this.BuildContainerLayer(this.ImageNumber);
        this.LayersCanvasContainers.push(NewCanvasContainer.id);
        NewCanvasContainer.setAttribute("data-pneobject", 3);
        NewCanvasContainer.setAttribute("data-pnelnatrbt", this.ImageNumber + this.KEY.CanvasImage);
        NewCanvasContainer.setAttribute("data-layertype", this.KEY.EditorImage);
        NewCanvasContainer.setAttribute("data-pnepermitresize", "1");
        NewCanvasContainer.setAttribute("data-pnepermitmove", "1");
        NewCanvasContainer.setAttribute("data-pneLayerNumber", this.LayerNumber);
        NewCanvasContainer.setAttribute("data-layeropacity", "1");
        NewCanvasContainer.setAttribute("data-layerfilter", "100");
        NewCanvasContainer.setAttribute("data-type", "MVBDRW");
        NewCanvasContainer.setAttribute("data-pnewidth", 0);
        NewCanvasContainer.setAttribute("data-pneheight", 0);
        NewCanvasContainer.setAttribute("data-wlt", this.KEY.CanvasImage);
        NewCanvasContainer.setAttribute("data-ilt", this.KEY.ImageObject);
        NewCanvasContainer.setAttribute("style", "opacity:1;filter:alpha(opacity=100);padding:2px;margin:0px;zoom:1;visibility:visible;border-bottom-color:" + this.bordercolor + ";border-width:1px; border-style:solid; position:absolute; background-color:transparent; top:" + b + "; left:" + this.LayerAttributeLeft[this.LayerNumber] + "px; width:300px; height:300px; z-index:" + this.ImageNumber + "; overflow:visible;font:normal;line-height:normal");
        this.REI(this.CurrentCanvas).appendChild(NewCanvasContainer);
        NewEditorDiv = this.REI(NewCanvasContainer.id).cloneNode();
        NewEditorDiv.id = this.BuildEditorLayer(this.ImageNumber);
        NewEditorDiv.setAttribute("data-pnelnatrbt", this.ImageNumber + this.KEY.EditorImage);
        this.LayersEditorDivs.push(NewEditorDiv.id);
        NewEditorDiv.setAttribute("style", "background: url(assets/24x24/move.png);background-repeat:no-repeat;cursor:move;visibility:visible;border-width:0px;border-bottom-color:black; border-style:none; position:absolute; background-color:transparent; top:" + l + "; left:" + this.LayerAttributeLeft[this.LayerNumber] + "px; width:35px; height:24px; z-index:1000; overflow:hidden;opacity:1;filter:alpha(opacity=100)");
        this.GetEditorObject.EditorMirrorCanvas().appendChild(NewEditorDiv);
        NewImageObject = document.createElement("img");
        NewImageObject.id = this.BuildEditableLayer(this.ImageNumber);
        NewImageObject.width = 285;
        NewImageObject.src = SRC;
        NewImageObject.alt = "";
        this.LayersImageContainers.push(this.BuildContainerLayer(this.ImageNumber));
        NewImageObject.setAttribute("data-Constrain", "1");
        NewImageObject.setAttribute("data-pnelnatrbt", this.ImageNumber + this.KEY.ImageObject);
        NewImageObject.setAttribute("data-layertype", this.KEY.EditorImage);
        NewImageObject.setAttribute("data-pnepermitresize", "1");
        NewImageObject.setAttribute("data-pnepermitmove", "1");
        NewImageObject.setAttribute("data-pneLayerNumber", this.LayerNumber);
        NewImageObject.setAttribute("data-layeropacity", "1");
        NewImageObject.setAttribute("data-layerfilter", "100");
        NewImageObject.setAttribute("data-type", "MVBDRWI");
        NewImageObject.setAttribute("data-pneobject", 4);
        this.LayersImageObjects.push(NewImageObject.id);
        NewImageObject.setAttribute("style", "max-width:100%;border-width:0px;border-style:none;margin:0px;width:285px;padding:" + this.LayerPadding[this.LayerNumber] + "px;zoom:1;text-align:center;line-height:normal");
        NewCanvasContainer.appendChild(NewImageObject);
        // Set the layers styles option.
        this.SelectLayerStyle();
        // Set the images Height / Width onload.
        this.objImage.onload = function() {
            PlugNedit.Setimage(PlugNedit.LayerNumber);
        };
        this.objImage.src = SRC;
        // Set the layers objects.
        this.SetCurrentLayerObject(this.LayerNumber);
        // Rebuild layers and hide sidebar.
        this.ControlLayers();
        this.SideBar();
    },
    Setimage: function(LayerNumber, d) {
        // Set the images actual size attribues.
        var ImgObj;
        if (d == "New") {
            ImgObj = this.objImage2;
        } else {
            ImgObj = this.objImage;
        }
        this.GetCanvasObject.ContainerLayer(LayerNumber).style.width = (parseInt(this.GetCanvasObject.EditableLayer(LayerNumber).clientWidth) + this.GetCanvasObject.EditableLayer(LayerNumber).offsetLeft) + "px";
        this.GetCanvasObject.ContainerLayer(LayerNumber).style.height = (parseInt(this.GetCanvasObject.EditableLayer(LayerNumber).clientHeight) + this.GetCanvasObject.EditableLayer(LayerNumber).offsetTop) + "px";
        this.ImageActualH[LayerNumber] = parseInt(ImgObj.height);
        this.ImageActualW[LayerNumber] = parseInt(ImgObj.width);
        this.GetCanvasObject.EditableLayer(LayerNumber).setAttribute("data-pnewidth", this.ImageActualW[LayerNumber]);
        this.GetCanvasObject.EditableLayer(LayerNumber).setAttribute("data-pneheight", this.ImageActualH[LayerNumber]);
    },
    PicSize: function(LayerNumber) {
        // Get the pictures actual width and height.
        var SRC = GetCanvasObject.EditableLayer(LayerNumber).src;
        objImage2 = new Image();
        objImage2.src = SRC;
        objImage2.onload = setTimeout(" PlugNedit.Setimage(" + PlugNedit.LayerNumber + ',"New")', 500);
    },
    SetVisualChords: function() {

        // Sets the chords at the bottom of the screen.
        if (!this.LockedElement) {
            return;
        }
        // Set object to current inner object.
        var Obj = this.CurrentLayerObject.Editable;
        // Set the chords to the current array setting for top and left.
        this.GetEditorObject.TopPositionChord().value = +this.LayerAttributeTop[this.CurrentLayerNumber];
        this.GetEditorObject.LeftPostionChord().value = +this.LayerAttributeLeft[this.CurrentLayerNumber];
        // measure the offset height - width and display in the chords menu
        this.GetEditorObject.HeightChord().value = Obj.offsetHeight;
        this.GetEditorObject.WidthChord().value = Obj.offsetWidth;
        if (this.isImage(this.CurrentLayerObject.Editable.id)) {
            // If object is a image, display the height width.
            var ObjWidth = parseInt(this.CurrentLayerObject.Editable.width);
            var ObjHeigth = parseInt(this.CurrentLayerObject.Editable.height);
            if (this.ImageActualW[this.CurrentLayerNumber] === undefined) {
                try {
                    // If the natural width has not yet been defined then set the natural width.
                    this.ImageActualW[this.CurrentLayerNumber] = parseInt(this.CurrentLayerObject.Editable.naturalWidth);
                    this.ImageActualH[this.CurrentLayerNumber] = parseInt(this.CurrentLayerObject.Editable.naturalHeight);
                } catch (d) {}
            }
            // If the picture is smaller then the natural width the display the chords as green
            // If not the user is sizing the picture to high and the chords display is red.
            if (ObjWidth < this.ImageActualW[this.CurrentLayerNumber] && ObjHeigth < this.ImageActualH[this.CurrentLayerNumber]) {
                this.GetEditorObject.ImageHeightChord().style.color = "green";
                this.GetEditorObject.ImageWidthChord().style.color = "green";
            } else {
                this.GetEditorObject.ImageHeightChord().style.color = "Red";
                this.GetEditorObject.ImageWidthChord().style.color = "Red";
            }
            // Displays the natural size.
            this.GetEditorObject.ActualImageChords().innerHTML = this.ImageActualW[this.CurrentLayerNumber] + " X " + this.ImageActualH[this.CurrentLayerNumber];
            this.GetEditorObject.ImageHeightChord().value = ObjHeigth;
            this.GetEditorObject.ImageWidthChord().value = ObjWidth;
        } else {
            this.GetEditorObject.ActualImageChords().innerHTML = "N/A";
            this.GetEditorObject.ImageHeightChord().value = "N/A";
            this.GetEditorObject.ImageWidthChord().value = "N/A";
        }
    },
    DisableEvent: function(Evnt) {
        // Disables the delete from causing the browser to leave the page.
        var EventType;
        if (!Evnt) {
            Evnt = window.event;
        }
        if (document.all) {
            EventType = Evnt.keyCode;
        } else {
            EventType = Evnt.which;
        }
        var EventSource = Evnt.target ? Evnt.target : Evnt.srcElement;
        if (EventType == 8) {
            if (document.all) {
                var IEreturn = 0;
                if (EventSource.tagName == "BODY") {
                    IEreturn = 1;
                }
                if (EventSource.tagName == "DIV" && EventSource.contentEditable != "true") {
                    IEreturn = 1;
                }
                if (IEreturn == 1) {
                    try {
                        event.preventDefault();
                    } catch (d) {
                        event.returnValue = false;
                    }
                }
            } else {
                if (EventSource.tagName == "BODY") {
                    if (EventType === 8) {
                        return false;
                    }
                    event.preventDefault();
                    event.returnValue = false;
                }
            }
        }
    },
    Bullpen: function()
        // This function is not in use.
        // With proper editor objects limits the editor.

    {
        this.REI("PNEcanvasI").style.left = 50 + "%";
        this.GetEditorObject.EditorMirrorCanvas().style.left = 50 + "%";
        if (this.PlayPen === true) {
            var PenWidth = this.WindowWidth - this.PlayPenWidth,
                PenHeight = this.WindowHeight - this.PlayPenHeight;
            this.RE("NoEditPlayTop").style.width = this.WindowWidth + "px";
            this.RE("NoEditPlayTop").style.height = 50 + "px";
            this.RE("NoEditPlayLeft").style.height = this.WindowHeight + "px";
            this.RE("NoEditPlayLeft").style.width = 50 + "px";
            this.RE("NoEditPlayRight").style.left = this.PlayPenWidth + "px";
            this.RE("NoEditPlayRight").style.width = PenWidth + "px";
            this.RE("NoEditPlayRight").style.height = this.WindowHeight + "px";
            this.RE("NoEditPlayBottom").style.top = this.PlayPenHeight + "px";
            this.RE("NoEditPlayBottom").style.width = this.WindowWidth + "px";
            this.RE("NoEditPlayBottom").style.height = PenHeight + "px";
        }
    },
    HighLightAlert: function(ObjID, OjbStyle, Value) {
        // Highlights or changes object and then changes back in the editor.
        var Obj = this.RE(ObjID),
            OldSetting = Obj.style[OjbStyle];
        Obj.style[OjbStyle] = Value;
        setTimeout(function() {
            Obj.style[OjbStyle] = OldSetting;
        }, 20000);
    },
    DivsOnRoids: function(f, b) {
        // Not in use, Rotates Object.
        var d, a, e, h, SecondRotation, k;
        if (f) {
            e = this.GetCanvasObject.ContainerLayer(this.CurrentLayerNumber);
            if (this.RE(e).getAttribute("Plugnedit-Rotation") !== null) {
                a = this.RE(e).getAttribute("Plugnedit-Rotation");
                d = parseFloat(a) + parseFloat(f);
            } else {
                d = f;
            }
            if (d < 0) {
                d = 350;
            }
            if (d > 359) {
                d = 0;
            }
            this.RE(e).setAttribute("Plugnedit-Rotation", d);
        }
        h = document.getElementsByTagName("div");
        for (var g = 0; g < h.length; g++) {
            if (h[g].getAttribute("Plugnedit-Rotation") !== null) {
                SecondRotation = h[g].getAttribute("Plugnedit-Rotation");
                k = h[g].getAttribute("Plugnedit-ScaleY");
                h[g].style.webkitTransform = "rotate(" + SecondRotation + "deg)";
                h[g].style.msTransform = "rotate(" + SecondRotation + "deg)";
                h[g].style.MozTransform = "rotate(" + SecondRotation + "deg)";
                h[g].style.OTransform = "rotate(" + SecondRotation + "deg)";
                h[g].style.transform = "rotate(" + SecondRotation + "deg)";
                this.LayerTransAngle[this.RNum(h[g].id)] = SecondRotation;
            }
        }
    },
    getInternetExplorerVersion: function() {
        // Determine IE and version.
        var d = -1;
        if (navigator.appName == "Microsoft Internet Explorer") {
            var a = navigator.userAgent;
            var b = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
            if (b.exec(a) !== null) {
                d = parseFloat(RegExp.$1);
            }
        }
        return d;
    },
    checkVersion: function() {
        // Checks version of IE.
        var versionIE = this.getInternetExplorerVersion();
        if (versionIE > -1) {
            if (versionIE < 8.9) {
                ReloadVersion = 1;
            }
            if (versionIE > 8.9) {
                this.AltBrowser2 = false;
                IEBVersion = 9;
            }
        }
    },
    IsEmpty: function(CheckName) {
        // Checks if variable is empty.
        CheckName = CheckName.replace(/^\s*/, '').replace(/\s+$/, '');
        if (CheckName === '') {
            return true;
        } else {
            return false;
        }
    },
    HasLink: function(LayerNumber) {
        // Check if block level link on layer.
        if (PlugNedit.REI(PlugNedit.BuildLink(LayerNumber))) {
            return true;
        } else {
            return false;
        }
    },
    EditorOptions: function() {
        //  Options for layers menu.
        var NewLayerName = this.GetEditorObject.OptionsLayerName().value;
        // Sets Layer Name.
        if (this.IsEmpty(NewLayerName)) {
            NewLayerName = "Defualt Name" + this.CurrentLayerNumber;
        }
        this.LayerNames[this.CurrentLayerNumber] = NewLayerName;
        this.GetEditorObject.OptionsImageSrc().style.visibility = "hidden";
        if (this.isImage(this.CurrentLayerObject.Editable.id) && !this.IsEmpty(this.GetEditorObject.OptionsURLsrc().value)) {
            this.CurrentLayerObject.Editable.src = this.GetEditorObject.OptionsURLsrc().value;
            this.CurrentLayerObject.Editable.alt = NewLayerName;
        }
        this.CurrentLayerObject.Editable.setAttribute(this.useATTrname, NewLayerName);
        this.CurrentLayerObject.Container.setAttribute(this.useATTrname, NewLayerName);

        // Check and sets link.
        if (!this.IsEmpty(this.GetEditorObject.OptionsCustomURL().value)) {
            if (this.HasLink(this.CurrentLayerNumber)) {
                this.GetCanvasObject.LayerLink(this.CurrentLayerNumber).href = this.GetEditorObject.OptionsCustomURL().value;
                this.ControlLayers(this.CurrentLayerNumber);
                return;
            } else {
                var LinkElement = document.createElement('a');
                LinkElement.href = this.GetEditorObject.OptionsCustomURL().value;
                LinkElement.style.display = 'block';
                LinkElement.id = this.BuildLink(this.CurrentLayerNumber);
                LinkElement.appendChild(this.CurrentLayerObject.Editable.cloneNode(true));
                this.CurrentLayerObject.Container.innerHTML = '';
                this.CurrentLayerObject.Container.appendChild(LinkElement);
                this.AddEventListen(this.GetCanvasObject.LayerLink(this.CurrentLayerNumber), 'click', this.ReturnFalse);
            }
        } else {
            if (this.HasLink(this.CurrentLayerNumber)) {
                var tempObj = this.CurrentLayerObject.Editable.cloneNode(true);
                this.CurrentLayerObject.Container.innerHTML = '';
                this.CurrentLayerObject.Container.appendChild(tempObj);
            }
        }
        // Rebuild the layers.
        this.ControlLayers(this.CurrentLayerNumber);
    },

    SortRGB: function(ColorObj) {
        // Sort a RGB Value and return a HEX color
        var Color, Red, Green, Blue;
        if (ColorObj.match("rgb")) {
            Color = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(ColorObj);
            Red = this.toHex(parseInt(Color[2]));
            Green = this.toHex(parseInt(Color[3]));
            Blue = this.toHex(parseInt(Color[4]));
            return Red + Green + Blue;
        } else {
            return ColorObj.replace("#", "");
        }
    },
    toHex: function(Obj) {
        // Return Hex Values
        Obj = parseInt(Obj);
        if (isNaN(Obj) || Obj === 0) {
            return "00";
        }
        Obj = Math.max(0, Math.min(Obj, 255));
        return "0123456789ABCDEF".charAt((Obj - Obj % 16) / 16) + "0123456789ABCDEF".charAt(Obj % 16);
    },
    FontSelect: function(d) {
        // Change the font family.
        this.CurrentLayerObject.HTMLDIV.style.fontFamily = d.value;
        // Adjust div height if changed.
        this.AdjustTheDiv();
    },
    changeFontSize: function(Size) {
        // Change the font size on the layers global setting.
        var Count;
        if (this.EditableDivLayer) {
            Size = parseInt(Size, 10);
            Count = parseInt(this.CurrentLayerObject.HTMLDIV.style.fontSize, 10);
            this.StyleInlinediv("fontSize", (Size + Count) + "px");
        }
        this.AdjustTheDiv();
    },
    UndoIt: function(a) {
        // Set the undo - Redo Elements.
        if (a === 0 && this.SingleEdit === 0) {
            this.Undostep[this.Arraycount] = this.REI("PNEcanvasI").innerHTML;
            this.UndoAlts[this.Arraycount] = this.GetEditorObject.EditorMirrorCanvas().innerHTML;
            this.UndoLayerPadding[this.Arraycount] = this.LayerPadding.slice(0);
            this.UndoLayerLevels[this.Arraycount] = this.LayerLevels.slice(0);
            this.UndoLayerNames[this.Arraycount] = this.LayerNames.slice(0);
            this.UndoLayerType[this.Arraycount] = this.LayerType.slice(0);
            this.UndoLayerLevelsToggle[this.Arraycount] = this.LayerLevelsToggle.slice(0);
            this.UndoLayerAttributeWidth[this.Arraycount] = this.LayerAttributeWidth.slice(0);
            this.UndoLayerAttributeHeight[this.Arraycount] = this.LayerAttributeHeight.slice(0);
            this.UndoLayerAttribute[this.Arraycount] = this.LayerAttribute.slice(0);
            this.UndoLayerAttributeTop[this.Arraycount] = this.LayerAttributeTop.slice(0);
            this.UndoLayerAttributeLeft[this.Arraycount] = this.LayerAttributeLeft.slice(0);
            this.UndoLayerOffSetLeft[this.Arraycount] = this.LayerOffSetLeft.slice(0);
            this.UndoLayerOffSetTop[this.Arraycount] = this.LayerOffSetTop.slice(0);
            this.UndoTempPointX[this.Arraycount] = this.TempPointX.slice(0);
            this.UndoTempPointY[this.Arraycount] = this.TempPointY.slice(0);
            this.UndoLayerAttributeVisiblity[this.Arraycount] = this.LayerAttributeVisiblity.slice(0);
            this.UndoLayerTransAngle[this.Arraycount] = this.LayerTransAngle.slice(0);
            this.UndoLayersLinked[this.Arraycount] = this.LayersLinked.slice(0);
            this.UndoImageActualH[this.Arraycount] = this.ImageActualH.slice(0);
            this.UndoImageActualW[this.Arraycount] = this.ImageActualW.slice(0);
            this.UndoLayersCanvasContainers[this.Arraycount] = this.LayersCanvasContainers.slice(0);
            this.UndoLayersEditorDivs[this.Arraycount] = this.LayersEditorDivs.slice(0);
            this.UndoLayersContainerTypes[this.Arraycount] = this.LayersContainerTypes.slice(0);
            this.UndoLayersEditableTypes[this.Arraycount] = this.LayersEditableTypes.slice(0);
            this.UndoLayersEditorDivs[this.Arraycount] = this.LayersEditorDivs.slice(0);
            this.UndoLayersCanvasContainers[this.Arraycount] = this.LayersCanvasContainers.slice(0);
            this.UndoLayersImageContainers[this.Arraycount] = this.LayersImageContainers.slice(0);
            this.UndoLayersImageObjects[this.Arraycount] = this.LayersImageObjects.slice(0);
            this.UndoLayersEditableDivs[this.Arraycount] = this.LayersEditableDivs.slice(0);
            this.UndoPNEEmbedLayer[this.Arraycount] = this.PNEEmbedLayer.slice(0);
            this.StepCount = this.Arraycount;
            this.Arraycount = this.Arraycount + 1;
        } else {

            // Sets undo objects.
            this.StepCount = this.StepCount + a;
            if (this.StepCount < 1) {
                this.StepCount = 1;
            }
            if (this.StepCount > this.Arraycount) {
                this.StepCount = this.Arraycount;
            }
            if (this.StepCount > 0 && this.StepCount < this.Arraycount) {
                this.REI("PNEcanvasI").innerHTML = this.Undostep[this.StepCount];
                this.GetEditorObject.EditorMirrorCanvas().innerHTML = this.UndoAlts[this.StepCount];
                this.LayerPadding = this.UndoLayerLevels[this.StepCount];
                this.LayerLevels = this.UndoLayerLevels[this.StepCount];
                this.LayerNames = this.UndoLayerNames[this.StepCount];
                this.LayerType = this.UndoLayerType[this.StepCount];
                this.LayerLevelsToggle = this.UndoLayerLevelsToggle[this.StepCount];
                this.LayerAttributeWidth = this.UndoLayerAttributeWidth[this.StepCount];
                this.LayerAttributeHeight = this.UndoLayerAttributeHeight[this.StepCount];
                this.LayerAttribute = this.UndoLayerAttribute[this.StepCount];
                this.LayerAttributeTop = this.UndoLayerAttributeTop[this.StepCount];
                this.LayerAttributeLeft = this.UndoLayerAttributeLeft[this.StepCount];
                this.LayerOffSetLeft = this.UndoLayerOffSetLeft[this.StepCount];
                this.LayerOffSetTop = this.UndoLayerOffSetTop[this.StepCount];
                this.TempPointX = this.UndoTempPointX[this.StepCount];
                this.TempPointY = this.UndoTempPointY[this.StepCount];
                this.LayerAttributeVisiblity = this.UndoLayerAttributeVisiblity[this.StepCount];
                this.LayerTransAngle = this.UndoLayerTransAngle[this.StepCount];
                this.LayersLinked = this.UndoLayersLinked[this.StepCount];
                this.ImageActualH = this.UndoImageActualH[this.StepCount];
                this.ImageActualW = this.UndoImageActualW[this.StepCount];
                this.LayersCanvasContainers = this.UndoLayersCanvasContainers[this.StepCount];
                this.LayersEditorDivs = this.UndoLayersEditorDivs[this.StepCount];
                this.LayersContainerTypes = this.UndoLayersContainerTypes[this.StepCount];
                this.LayersEditableTypes = this.UndoLayersEditableTypes[this.StepCount];
                this.LayersEditorDivs = this.UndoLayersEditorDivs[this.StepCount];
                this.LayersCanvasContainers = this.UndoLayersCanvasContainers[this.StepCount];
                this.LayersImageContainers = this.UndoLayersImageContainers[this.StepCount];
                this.LayersImageObjects = this.UndoLayersImageObjects[this.StepCount];
                this.LayersEditableDivs = this.UndoLayersEditableDivs[this.StepCount];
                this.PNEEmbedLayer = this.UndoPNEEmbedLayer[this.StepCount];
                this.LockPreSourceElementID = false;
                this.EditableDivLayer = false;
                this.EditorLayer = false;
                this.FireLight = 0;
                this.CurrentLayerObject.Editor = false;
                this.CurrentLayerObject.Editable = false;
                this.CurrentLayerObject.Container = false;
                this.CurrentLayerObject.HTMLDIV = false;
                this.ControlLayers("Rebuild");
                this.UndoSteps = true;
                this.CurrentLayerNumber = false;
            }
        }
    },
    SortLayers: function(Obj) {
        // Sort layer names and highlight.
        this.SetCurrentLayerObject(Obj);
        for (var LayerNumber = this.LayerLevels.length - 1; LayerNumber >= 0;
            --LayerNumber) {
            if (this.LayerLevels[LayerNumber] !== undefined) {
                try {
                    this.GetEditorObject.LayersMenu(LayerNumber).style.color = "black";
                } catch (e) {

                }
            }
        }
        if (this.CurrentLayerNumber) {
            this.GetEditorObject.LayersMenu(this.CurrentLayerNumber).style.color = "green";
        }
        this.CleanWorkArea(Obj);
    },
    TransDiv: function(Amount) {
        var Filter, Alpha;
        // Set style in object until the page is saved.
        // Set parent node not to link.
        Filter = (parseInt(this.CurrentLayerObject.Container.getAttribute("data-layerfilter")) + parseInt(Amount));
        if (Filter < 0) {
            Filter = 0;
        }
        if (Filter > 100) {
            Filter = 100;
        }
        if (Filter < 0) {
            Filter = 0;
        }
        if (Filter > 100) {
            Filter = 100;
        }
        this.CurrentLayerObject.Container.setAttribute("data-layerfilter", Filter);
        if (Filter == 100) {
            Alpha = 1;
        } else {
            Alpha = "." + Filter;
        }
        this.LayerTransFilter[this.RNum(this.CurrentLayerObject.Container.id)] = Filter;
        this.LayerTransOpacity[this.RNum(this.CurrentLayerObject.Container.id)] = Alpha;
        this.CurrentLayerObject.Container.setAttribute("data-layeropacity", Alpha);
        this.CurrentLayerObject.Editable.style.opacity = Alpha;
        this.CurrentLayerObject.Editable.style.filter = "alpha(opacity=" + Filter + ")";
        // Set temp styles for all browsers.
        this.CurrentLayerObject.Editable.setAttribute('data-PNEstyles', 'filter: alpha(opacity=' + Filter + ');-moz-opacity: ' + Alpha + ';-khtml-opacity: ' + Alpha + ';opacity:' + Alpha);
    },
    SetAlphaStyle: function(Opacity, Filter, DivObject) {
        // Check for opacity styles.
        var DivStyle = DivObject.getAttribute('style');
        DivStyle.toString();
        var list = DivStyle;
        var value = 'opacity';
        var values = list.split(';');
        var k = 1;
        while (k == 1) {
            for (var i = 0; i < values.length; i++) {
                if (values[i].match(value)) {
                    values.splice(i, 1);
                    list = values.join(';');
                }
            }
            if (list.match(value)) {
                values = list.split(';');
            } else {
                k = 0;
            }
        }
    },
    SortDivText: function(TextObj, Type) {
        // Sort the text from the text areea to the current HTML layer and back.
        if (this.AdvancedEditor === true) {
            return;
        }
        if (this.CurrentLayerObject.HTMLDIV) {
            if (Type == 1) {
                this.CurrentLayerObject.HTMLDIV.innerHTML = TextObj.value;
            } else {
                if (this.FirstHTMLEdit) {
                    this.CurrentLayerObject.HTMLDIV.innerHTML = "";
                } else {
                    var TextValue = this.CurrentLayerObject.HTMLDIV.innerHTML;
                    this.RE(TextObj.id).value = TextValue;
                }
            }
            // Adjust the div size.
            this.AdjustTheDiv();
        }
    },
    RemoveContentEditable: function() {
        // Remove content editable, many sets of content editable bog down the CKEditor.
        this.CKDestroy();
        var Divs, LayerNumber;
        for (LayerNumber = this.LayerLevels.length - 1; LayerNumber >= 0;
            --LayerNumber) {
            if (this.LayerLevels[LayerNumber] === undefined) {
                continue;
            }
            if (this.GetCanvasObject.EditableLayer(LayerNumber).hasAttribute("contentEditable")) {
                this.GetCanvasObject.EditableLayer(LayerNumber).removeAttribute("contentEditable");
            }
        }
    },
    looparray: function(SaveType) {
        // Prepare for save, loop thru attributs and remove the Onclick attribute that was
        // set not to return false. Remove the content editable attribute and set border to transparent.
        this.CKDestroy();
        var Divs, LayerNumber;
        for (LayerNumber = this.LayerLevels.length - 1; LayerNumber >= 0;
            --LayerNumber) {
            if (this.LayerLevels[LayerNumber] === undefined) {
                continue;
            }
            if (this.GetCanvasObject.EditableLayer(LayerNumber).hasAttribute('data-pnestyles')) {
                var tempstr = this.GetCanvasObject.EditableLayer(LayerNumber).style.cssText.replace(/;\s*$/, "");
                this.GetCanvasObject.EditableLayer(LayerNumber).setAttribute('data-pnestylestemp', tempstr + '; ' + this.GetCanvasObject.EditableLayer(LayerNumber).getAttribute('data-pnestyles'));
                this.GetCanvasObject.EditableLayer(LayerNumber).removeAttribute('style');
            }
            this.GetCanvasObject.ContainerLayer(LayerNumber).style.borderColor = "transparent";
            if (this.GetCanvasObject.EditableLayer(LayerNumber).hasAttribute("contentEditable")) {
                this.GetCanvasObject.EditableLayer(LayerNumber).removeAttribute("contentEditable");
            }
        }
    },
    SetMobileSpacers: function() {
        // Used for mobile page sized on the adaptime page canvas type.
        var FixedObj = this.GetEditorObject.FixedCanvas().getElementsByTagName("div"),
            ObjHeight, PageBottom = 0,
            i;
        // Set the fixed spacer on the canvas
        // Loop thru objects and find the lowest element on the page, by adding the top postion plus the layer height.
        for (i = 0; i < FixedObj.length; i++) {
            if (FixedObj[i].getAttribute("data-type") == "MVBDRW") {
                ObjHeight = this.RNum(FixedObj[i].style.top) + this.RNum(FixedObj[i].style.height);
                if (ObjHeight > PageBottom) {
                    // Set the page bottom.
                    PageBottom = ObjHeight;
                }
            }
        }
        // Set the marigin width of the spacer on the fixed canvas layer.
        this.GetCanvasObject.Spacer().style.width = parseInt(this.FullSizeMargin) + "px";
        // Set the spacer height on the canvas fixed canvas layer.
        this.GetCanvasObject.Spacer().style.height = PageBottom + "px";
        PageBottom = 0;
        ObjHeight = 0;
        // Sets the mobile spacer height.
        // Loop thru the elements on the mobile canvas, and set the bottom postion.
        var MobileObj = this.GetCanvasObject.MobileCanvas().getElementsByTagName("div");
        for (i = 0; i < FixedObj.length; i++) {
            if (MobileObj[i].getAttribute("data-type") == "MVBDRW") {
                ObjHeight = this.RNum(MobileObj[i].style.top) + this.RNum(MobileObj[i].style.height);
                if (ObjHeight > PageBottom) {
                    PageBottom = ObjHeight;
                }
            }
        }
        // Save the mobile width on the spacer..
        this.GetCanvasObject.Spacer().setAttribute("data-pnemobilewidth", parseInt(this.MobileMargin) + "px");
        this.GetCanvasObject.Spacer().setAttribute("data-pnemobileheight", PageBottom + "px");
    },
    SavePage: function(a) {
        // Save Page
        this.CKDestroy();
        this.looparray(a);
        this.TransferHT();
    },
    TransferHT: function(a, b) {
        // This funtion finds the buttom of the page when objects are rotated and sets the spacers height.
        var SpacerHeight=0, TempHeight, divs, TempWidth, DivSin, DivCos, Hone, Htwo, d, h, k, e;
     
        divs = this.CanvasWindow.getElementsByTagName("div");
        for (d = 0; d < divs.length; d++) {
            if (divs[d].getAttribute("data-type") == "MVBDRW") {



                TempHeight = +parseInt(this.RNum(divs[d].style.top)) + parseInt(this.RNum(divs[d].style.height));

                if (divs[d].getAttribute("Plugnedit-Rotation") !== null) {
                    TempWidth = this.RNum(divs[d].style.width);
                    DivSin = Math.sin(this.RNum(divs[d].getAttribute("Plugnedit-Rotation")));
                    DivCos = Math.cos(this.RNum(divs[d].getAttribute("Plugnedit-Rotation")));
                    Hone = TempHeight * Math.abs(DivSin) + TempWidth * Math.abs(DivCos);
                    Htwo = TempHeight * Math.abs(DivCos) + TempWidthTempWidth * Math.abs(DivSin);
                    if (Hone > Htwo) {
                        TempHeight = Math.round(this.RNum(wn));
                    } else {

                        TempHeight = Math.round(this.RNum(hn));

                    }
                }
                if (TempHeight > SpacerHeight) {
                  SpacerHeight = TempHeight;
                }
            }
        }
        // Start Transfer HTML

        if (this.IsAdaptive === true) {
            this.SetMobileSpacers();
        } else {

            this.GetCanvasObject.Spacer().style.height = (parseFloat(SpacerHeight) + parseFloat(this.PaddingPageBottom)) - parseFloat(10) + "px";


        }

        if (PNETOOLS.SaveContent == "body") {
            this.CanvasHTML = this.CanvasWindow.body.innerHTML;
        } else if (PNETOOLS.SaveContent == "page") {
            this.CanvasHTML = this.CanvasWindow.documentElement.outerHTML;

        } else if (PNETOOLS.SaveContent == "editor") {
            this.CanvasHTML = GetCanvasObject.Canvas().outerHTML;
        }
        // Changes the style to full styles of all browsers.
        this.CanvasHTML = this.CanvasHTML.replace(/data-pnestylestemp/g, "style");
        this.AddEventListen(this.GetEditorObject.HTMLSubmitWindow(), 'selectstart', true);
        this.EditorClosed = true;
        PNETOOLS.CloseEditor();
    },
    ControlLayers: function(Obj) {
        // Controls the layers pallete and rebuilds layers.
        var DivOptionLayer, e = "",
            Visibility, k = [],
            r = [],
            ObjSet, ObjSet2, d, ImgObjUp, p, ImgObjDown, InputObj, SpanObj,
            ImgSettings;
        // Sets layer name.
        if (Obj === undefined && this.GetEditorObject.EditorLayer(this.LayerNumberActive)) {
            this.LayerNames[this.LayerNumberActive] = this.GetEditorObject.LayerNamesInput().value;
            if (this.LayerNames[this.LayerNumberActive] === "") {
                this.LayerNames[this.LayerNumberActive] = "Default Layer" + this.LayerNumberActive;
            }
            ObjSet = this.CurrentLayerObject.Editor;
            ObjSet2 = this.CurrentLayerObject.Container;
            try {
                if (this.GetEditorObject.OverFlowVisible().checked) {
                    // Sets layer visibility.
                    this.CurrentLayerObject.Editable.setAttribute("data-pneallowover", "true");
                    this.CurrentLayerObject.Editable.style.overflow = "visible";
                    this.CurrentLayerObject.Editable.style.backgroundColor = "transparent";
                }
            } catch (b) {}
            // Sets the data layers name attribut to the div.
            ObjSet.setAttribute(this.useATTrname, this.GetEditorObject.LayerNamesInput().value);
            ObjSet2.setAttribute(this.useATTrname, this.GetEditorObject.LayerNamesInput().value);
            if (this.LayerType[this.LayerNumberActive].match(this.KEY.EditorImage)) {
                // Sets image alt tag.
                this.CurrentLayerObject.Editable.alt = this.GetEditorObject.LayerNamesInput().value;
            }
        }
        // Create temp array for layer levels.
        for (p = this.LayerLevels.length - 1; p >= 0;
            --p) {
            if (this.LayerLevels[p] !== undefined) {
                if (k[this.LayerLevels[p]] !== undefined) {
                    k.splice(this.LayerLevels[p], 0, p);
                } else {
                    k[this.LayerLevels[p]] = p;
                }
            }
        }
        // Reset the layers level pallete and rebuild the layers display.
        this.GetEditorObject.LayersPallet().innerHTML = '';
        for (d = k.length - 1; d >= 0; --d) {
            if (this.LayerNames[k[d]] !== undefined) {
                if (this.LayerAttributeVisiblity[k[d]] == "visible") {
                    Visibility = true;
                } else {
                    Visibility = false;
                }
                DivOptionLayer = document.createElement('div');
                DivOptionLayer.id = "z" + k[d];
                DivOptionLayer.style.cssText = "position:static;top:0px;left:0px;border-bottom: 1px solid black;padding:4px;vertical-align:middle";
                ImgObjUp = document.createElement('img');
                ImgObjUp.src = "assets/16x16/up.png";
                ImgObjUp.style.cssText = "cursor:pointer;width:16px;height:16px";
                ImgObjUp.setAttribute("onclick", "PlugNedit.LayerAdjust(1, '" + k[d] + "')");
                ImgObjDown = document.createElement('img');
                ImgObjDown.src = "assets/16x16/down.png";
                ImgObjDown.style.cssText = "cursor:pointer;width:16px;height:16px";
                ImgObjDown.setAttribute("onclick", "PlugNedit.LayerAdjust(0, '" + k[d] + "')");
                InputObj = document.createElement('input');
                InputObj.type = "checkbox";
                InputObj.checked = Visibility;
                InputObj.name = 'Check ' + k[d];
                InputObj.id = 'W' + k[d];
                InputObj.setAttribute("onclick", "ToggleLayerVisibility( '" + k[d] + "' )");
                InputObj.title = "Toggle Visibility Of Layer";
                SpanObj = document.createElement('span');
                SpanObj.id = this.BuildLayersMenu(k[d]);
                SpanObj.style.cssText = 'cursor:pointer;vertical-align:text-top;';
                SpanObj.setAttribute("onclick", "PlugNedit.SortLayers( '" + k[d] + "' )");
                SpanObj.title = "Layer Name! Click To Select Layer.  Double Click To Edit";
                SpanObj.innerHTML = this.LayerNames[k[d]];
                ImgSettings = document.createElement('img');
                ImgSettings.align = "right";
                ImgSettings.src = "assets/16x16/settings.png";
                ImgSettings.setAttribute("onclick", "PlugNedit.SortLayers( '" + k[d] + "' );PNETOOLS.DisplayOptionsMenu();");
                ImgSettings.title = "Layer Settings";
                ImgSettings.style.cssText = "cursor:pointer";
                DivOptionLayer.appendChild(ImgObjUp);
                DivOptionLayer.appendChild(ImgObjDown);
                DivOptionLayer.appendChild(InputObj);
                DivOptionLayer.appendChild(SpanObj);
                DivOptionLayer.appendChild(ImgSettings);
                // Set the palletes HTML
                this.GetEditorObject.LayersPallet().appendChild(DivOptionLayer);
            }
        }
    },
    ToggleLayerVisibility: function(LayerNumber) {
        // Toggle layer visibility and set the array and div to new option.
        var Visibility;
        Visibility = this.LayerAttributeVisiblity[Visibility];
        if (Visibility == "visible") {
            this.GetCanvasObject.ContainerLayer(LayerNumber).style.visibility = "hidden";
            this.LayerAttributeVisiblity[Obj] = "hidden";
            this.GetCanvasObject.ContainerLayer(LayerNumber).style.visibility = "hidden";
        } else {
            this.LayerAttributeVisiblity[Obj] = "visible";
            this.GetCanvasObject.ContainerLayer(LayerNumber).style.visibility = "visible";
            this.GetCanvasObject.ContainerLayer(LayerNumber).style.visibility = "visible";
        }
    },
    ImageActual: function() {
        // Get the images natural width and height and set thee array to match.
        var ObjHeight = parseInt(this.CurrentLayerObject.Editable.naturalHeight);
        var ObjWidth = parseInt(this.CurrentLayerObject.Editable.naturalWidth);
        this.CurrentLayerObject.Container.style.width = (ObjWidth + (this.CurrentLayerObject.Editable.offsetTop * 2)) + "px";
        this.CurrentLayerObject.Container.style.height = (ObjHeight + (this.CurrentLayerObject.Editable.offsetTop * 2)) + "px";
        this.CurrentLayerObject.Editable.style.width = ObjWidth + "px";
        this.CurrentLayerObject.Editable.style.height = ObjHeight + "px";
        this.LayerAttributeWidth[this.CurrentLayerNumber] = ObjWidth;
        this.LayerAttributeHeight[this.CurrentLayerNumber] = ObjHeight;
    },


    LayerAdjust: function(NextLevel, LayerNumber, ToPostion) {

        // This funciton is for the z - index of div to be adjusted to new levels.
        var LayerMaxZ = 0,
          
            NewLevel, LayerMaxZindexAlt = 0,
            LayerMinZindex = 0,
            AltObj, jloop;
        if (this.ZindexToggle !== 0) {
            var l = this.ZindexToggle.split(";");
            this.RE(l[1]).style.zIndex = l[0];
            this.LayerLevels[this.RNum(l[1])] = l[0];
            this.ZindexToggle = 0;
        }
        if (this.LayerType[LayerNumber] === undefined) {
            LayerNumber = this.CurrentLayerNumber;
        }
        for (jloop = this.LayerLevels.length - 1; jloop >= 0;
            --jloop) {
            if (LayerNumber != jloop && this.LayerLevels[jloop] !== undefined) {
                if (parseInt(this.LayerLevels[jloop]) < parseInt(LayerMinZindex)) {
                    LayerMinZindex = this.LayerLevels[jloop];

                }
                if (parseInt(this.LayerLevels[jloop]) > parseInt(LayerMaxZindexAlt)) {

                    LayerMaxZindexAlt = this.LayerLevels[jloop];

                }
            }
        }

        // Set to front.
        if (ToPostion) {
            if (ToPostion == "Front") {
                this.LayerLevels[LayerNumber] = parseInt(LayerMaxZindexAlt) + 1;
                this.GetCanvasObject.ContainerLayer(LayerNumber).style.zIndex = this.LayerLevels[LayerNumber];

            } else {
                this.LayerLevels[LayerNumber] = parseInt(LayerMinZindex) - 1;
                this.GetCanvasObject.ContainerLayer(LayerNumber).style.zIndex = this.LayerLevels[LayerNumber];
            }
        }
        if (ToPostion === undefined) {

            if (NextLevel == 1) {

                this.LayerLevels[LayerNumber] = Math.abs(this.LayerLevels[LayerNumber] + 1);

            } else {

                if (this.LayerLevels[LayerNumber] !== 0) {
                    this.LayerLevels[LayerNumber] = Math.abs(this.LayerLevels[LayerNumber] - 1);
                }
            }

            this.GetCanvasObject.ContainerLayer(LayerNumber).style.zIndex = this.LayerLevels[LayerNumber];

        }
        // Rebuild layer pallete and array.
        this.ControlLayers("Rebuild");
    },
    BuildLinkedLayers: function() {
        // Not currently in use, future options for grouping objects.
        try {
            var b = this.CanvasWindow.getElementsByTagName("div");
            for (var a = 0; a < b.length; a++) {
                if (b[a].getAttribute("pne-linked") && !isNaN(this.RNum(b[a].getAttribute("pne-linked")))) {
                    this.LayersLinked[this.RNum(b[a].id)] = b[a].getAttribute("pne-linked");
                }
            }
        } catch (d) {}
    },
    LoadPage: function() {
        // Load a page.
        var Divs, e, DivObject, Visiblity;
        if (this.GetCanvasObject.FixedCanvas()) {
            this.SetMobileCanvas();
        }
        this.useATTrname = "data-pnelnatrbt";

        //Loop Canvas Divs
        Divs = this.CanvasWindow.getElementsByTagName("div");
        for (e = 0; e < Divs.length; e++) {
            // Match object not in use but usefull under certian design conditions.
            if (Divs[e].id.match(this.KEY.DivObjectI)) {}
            // Not in use future function grouped objects.
            this.BuildLinkedLayers();
            // Not in use, offsets the editor if canvas is smaller then screen size.
            // Usefull for building objects that are small like a business card.
            if (this.PlayPen === true) {
                if (Divs[e].getAttribute("data-type") == "MVBDRW") {
                    Divs[e].style.top = this.RNum(Divs[e].style.top) + 50 + "px";
                    Divs[e].style.left = this.RNum(Divs[e].style.left) + 50 + "px";
                }
            }
            // Loads div objects and sets the layers attribute arrays.
            if (Divs[e].getAttribute("data-type") == "MVBDRW" && Divs[e].getAttribute("data-pneobject")) {
                if (Divs[e].getAttribute("data-pneobject") == 2) {
                    this.LayersEditableDivs.push(Divs[e].id);
                    continue;
                }
                if (Divs[e].getAttribute("data-pneobject") == 3) {
                    this.LayersImageObjects.push(this.KEY.Prefix + this.RNum(Divs[e].id) + this.KEY.ImageObject);
                    this.LayersImageContainers.push(Divs[e].id);
                }
                if (Divs[e].style.visibility.match("hidden")) {
                    Visiblity = this.LayerAttributeVisiblity[this.RNum(Divs[e].id)] = "hidden";
                } else {
                    Visiblity = this.LayerAttributeVisiblity[this.RNum(Divs[e].id)] = "visible";
                }
                this.LayersCanvasContainers.push(Divs[e].id);
                this.LayersContainerTypes[this.RNum(Divs[e].id)] = Divs[e].getAttribute("data-wlt");
                this.LayersEditableTypes[this.RNum(Divs[e].id)] = Divs[e].getAttribute("data-ilt");
                this.LayerLevels[this.RNum(Divs[e].id)] = Divs[e].style.zIndex;
                this.LayerAttributeTop[this.RNum(Divs[e].id)] = parseInt(Divs[e].style.top);
                this.LayerAttributeLeft[this.RNum(Divs[e].id)] = parseInt(Divs[e].style.left);
                this.LayerAttributeHeight[this.RNum(Divs[e].id)] = parseInt(Divs[e].style.height);
                this.LayerAttributeWidth[this.RNum(Divs[e].id)] = parseInt(Divs[e].style.width);
                this.LayerOffSetLeft[this.RNum(Divs[e].id)] = 0;
                this.LayerOffSetTop[this.RNum(Divs[e].id)] = 0;
                this.LayerNames[this.RNum(Divs[e].id)] = Divs[e].getAttribute(this.useATTrname);
                this.LayerType[this.RNum(Divs[e].id)] = Divs[e].getAttribute("data-layertype");
                this.LayersEditorDivs.push(this.BuildEditorLayer(this.RNum(Divs[e].id)));
                if (+this.RNum(Divs[e].id) > this.LayerNumber) {
                    this.LayerNumber = +this.RNum(Divs[e].id);

                }
                DivObject = document.createElement('div');
                DivObject.id = this.KEY.Prefix + this.RNum(Divs[e].id) + Divs[e].getAttribute("data-layertype");
                this.LayersEditorDivs.push(DivObject.id);
                DivObject.setAttribute("data-layertype", this.KEY.EditorDiv);
                DivObject.setAttribute("data-pneobject", this.KEY.EditorDiv);
                DivObject.setAttribute("style", "background: url(assets/24x24/move.png);background-repeat:no-repeat;visibility:visible;border-bottom-color:black; border-style:None; border-width:0px; position:absolute; background-color:transparent; top:" + (this.LayerAttributeTop[this.RNum(Divs[e].id)] - this.KeyOffset.InnerDiv) + "px; left:" + this.LayerAttributeLeft[this.RNum(Divs[e].id)] + "px; width:35px; height:24px; z-index:1001; overflow:visible;opacity:1;filter:alpha(opacity=100);cursor: move");
                this.GetEditorObject.EditorMirrorCanvas().appendChild(DivObject);
                if (this.RE(this.KEY.Prefix + this.RNum(Divs[e].id) + this.KEY.CanvisLink)) {
                    var CanvasObjLink = this.RE(this.KEY.Prefix + this.RNum(Divs[e].id) + this.KEY.CanvisLink);
                    CanvasObjLink.setAttribute("onclick", "return false");
                }
            }
        }
        // Build layrs and set page offsets.
        this.DivsOnRoids();
        this.ControlLayers("Rebuild");
        this.SetPageOffsets();
        console.log('Editor Ready');
    },
    SetpaddingBottom: function(a) {
        // Set the badding buttom of page.
        if (!isNaN(a)) {
            this.PaddingPageBottom = a;
        }
    },
    SetPageOffsets: function() {
        // Check if the canvas frame is offset from the top of the editor frame and adjust the offsets of the editor.
        var Obj = this.GetCanvasObject.Canvas(),
             top = parseInt(PlugNedit.RE("PNECANVASiframe").style.top),
             objleft = 0,
             objtop = 0,
             offsetbody = 0,
             left = parseInt(PlugNedit.RE("PNECANVASiframe").style.left);
        this.IframeOffsetTop = top;
   

        if (Obj.offsetParent) {

            do {

                if (Obj.tagName == 'BODY') {


                    objtop = objtop - parseInt(this.CanvasWindow.defaultView.getComputedStyle(Obj, "").getPropertyValue("margin-top"));

                }

                if (Obj.parentNode.tagName != 'BODY') {
                    objleft += Obj.offsetLeft;
                    objtop += Obj.offsetTop;
                }


            }
            while (Obj = Obj.offsetParent);

        }

        var temptop = top + objtop;
        var templeft = left + objleft;
        this.GetEditorObject.MirrorCanvasContainer().style.top = temptop + 'px';
        this.GetEditorObject.MirrorCanvasContainer().style.left = templeft + 'px';
        this.GetEditorObject.MirrorCanvasContainer().style.width = parseInt(this.GetCanvasObject.Canvas().offsetWidth) + 'px';
        this.GetEditorObject.MirrorCanvasTools().style.width = parseInt(this.GetCanvasObject.Canvas().offsetWidth) + 'px';
        this.GetEditorObject.MirrorCanvasTools().style.top = temptop + 'px';
        this.GetEditorObject.MirrorCanvasTools().style.left = templeft + 'px';
        this.GetCanvasObject.Spacer().style.height = 9000 + 'px';
        this.KeyOffset.Top = objtop;
        this.KeyOffset.Left = objleft;

    },
    LStylesN: function(Obj) {
        // Sets the duplicate a layers style pallete.
        if (typeof Obj === "undefined") {
            Obj = this.LayerNumberActive;
        }
        Obj = this.RNum(Obj);
        var values = "";
        for (var b = this.LayerNames.length - 1; b >= 0;
            --b) {
            if (this.LayerNames[b] !== undefined && b != Obj) {
                if (this.LayerType[b] == this.LayerType[Obj]) {
                    values = values + "<option value=" + b + ">" + this.LayerNames[b] + "</option>";
                }
            }
        }
        if (values !== "" && this.AltBrowser2 === false) {
            values = '<option value="No-style">Select Style</option>' + values;
            this.GetEditorObject.OptionStylesSelect().innerHTML = '<select class="Btext" id="SelectDuplicateStyle" onChange="PNETOOLS.DLStylenew(this.value)">' + values + "</select>";
            if (this.GetEditorObject.OptionMenuStylesSelect()) {
                this.GetEditorObject.OptionMenuStylesSelect().innerHTML = '<select class="Btext" id="SelectDuplicateStyle2" onChange="{PNETOOLS.DLStylenew(this.value,this.RE(\'UpdateLayerid\').value)">' + values + "</select>";
            }
        } else {
            this.GetEditorObject.OptionStylesSelect().innerHTML = "None Available Yet";
            if (this.GetEditorObject.OptionMenuStylesSelect()) {
                this.GetEditorObject.OptionMenuStylesSelect().innerHTML = "None Available Yet";
            }
        }
    },
    DLStylenew: function(OrigObj, Obj) {
        // Dupicate a style and sets the new object to selected style.
        if (typeof a === "undefined") {
            Obj = this.LayerNumberActive;
        }
        Obj = this.RNum(Obj);
        var ObjTargetDiv, ObjTarget, OrigDiv, Height, Width, Opacity, DataFilter;

        if (!this.isImage(this.GetCanvasObject.ContainerLayer(OrigObj).id)) {
            ObjTargetDiv = this.GetCanvasObject.ContainerLayer(Obj);
            ObjTarget = this.GetCanvasObject.EditableLayer(Obj);
            OrigDiv = this.GetCanvasObject.ContainerLayer(OrigObj);
            Height = ObjTarget.style.height;
            Width = ObjTarget.style.width;
            Opacity = OrigDiv.getAttribute("data-layeropacity");
            DataFilter = OrigDiv.getAttribute("data-layerfilter");
            ObjTarget.setAttribute("style", this.GetCanvasObject.EditableLayer(OrigObj).getAttribute("style"));
            ObjTargetDiv.setAttribute("data-layeropacity", Opacity);
            ObjTargetDiv.setAttribute("data-layerfilter", DataFilter);
            ObjTarget.style.height = Height;
            ObjTarget.style.width = Width;
            this.LayerTransFilter[Obj] = DataFilter;
            this.LayerTransOpacity[Obj] = Opacity;
        } else {
            OrigDiv = this.GetCanvasObject.ContainerLayer(OrigObj);
            ObjTargetDiv = this.GetCanvasObject.ContainerLayer(Obj);
            Opacity = OrigDiv.getAttribute("data-layeropacity");
            DataFilter = OrigDiv.getAttribute("data-layerfilter");
            ObjTarget = GetCanvasObject.EditableLayer(obj);
            Width = parseInt(ObjTarget.clientWidth);
            Height = parseInt(ObjTarget.clientHeight);
            ObjTarget.setAttribute("style", GetCanvasObject.EditableLayer(OrigObj).getAttribute("style"));
            ObjTarget.style.width = Width + "px";
            ObjTarget.style.height = Height + "px";
            ObjTargetDiv.setAttribute("data-layeropacity", Opacity);
            ObjTargetDiv.setAttribute("data-layerfilter", DataFilter);
            this.LayerTransFilter[Obj] = DataFilter;
            this.LayerTransOpacity[Obj] = Opacity;
        }

        this.GetEditorObject.OptionStylesSelect().innerHTML = '<span id="LayerSelectStyle" onClick="PlugNedit.LStylesN()">Click To Change Style</span>';
        if (this.GetEditorObject.OptionMenuStylesSelect()) {
            this.GetEditorObject.OptionMenuStylesSelect().innerHTML = '<span id="LayerSelectStyle2" onClick="PlugNedit.LStylesN()">Click To Change Style</span>';
        }
    },
    PNENull: function(Obj) {
        // Check if null variable.
        if (!Obj || typeof Obj === null || typeof Obj === undefined || typeof Obj === "null" || typeof Obj === "undefined") {
            return true;
        } else {
            return false;
        }
    },
    StyleEditorObject: function(object, type, style) {
        // Styles a editor object.
        if (this.RE(object)) {
            this.RE(object).style[type] = style;
        }
    },

    StyleInlinediv: function(Style, Value, g) {

        // Styles inline div.
        if (this.PNENull(g) && this.EditableDivLayer) {
            this.CurrentLayerObject.HTMLDIV.style[Style] = "";
            this.CurrentLayerObject.HTMLDIV.style[Style] = Value;
            this.AdjustTheDiv();
        } else {
            if (this.isImage(this.CurrentLayerObject.Editable.id) && !this.PNENull(g)) {
                // Styles image.
                this.CurrentLayerObject.Editable.style[Style] = Value;
            }
        }
        try {
            if (this.PNENull(g) && Style === "padding") {
                LayerPadding[RNum(this.EditableDivLayer)] = Value;
            }
        } catch (f) {}
    },
    validateHColor: function(Color, Type) {
        // Validate a HEX color.
        Color = Color.replace(/#/g, "");
        if (!/ [ ^ a - zA - Z0 - 9] /.test(Color) && Color.length === 6 || Color === "000000") {
            if (Type == "pnebgcolor") {
                return true;
            }
            this.RE(Type).value = Color;
            this.RE(Type).onchange();
        }
    },
    LoadFontFrame: function() {
        // Not in use, but used when font frame loads for special options.
    },

    SideBar: function(Toolbar) {

        // Set the toolbar to display and positions from the scroll offset to the page offset browser.
        var TempToolObj;
        this.Elementposition();
        this.GetEditorObject.SideBarButtons().style.left = 0 + "px";
        this.GetEditorObject.SideBarButtons().innerHTML = this.GetEditorObject.LeftSideButtons().innerHTML;
        var f, h, offsetleft, a = 0;
        offsetleft = +0;
        for (var ToolBarNumber = 0; ToolBarNumber < PNETOOLS.PNEtoolbaroffset.length; ToolBarNumber++) {
            if (this.GetEditorObject.ToolBar(ToolBarNumber)) {
                this.GetEditorObject.ToolBar(ToolBarNumber).style.visibility = "hidden";
            }
        }
        if (this.GetEditorObject.ToolBar(Toolbar)) {
            this.GetEditorObject.SideBarButtons().style.left = parseInt(this.GetEditorObject.ToolBar(Toolbar).offsetWidth) + 'px';
            this.GetEditorObject.ToolBar(Toolbar).style.visibility = "visible";
            this.GetEditorObject.ToolBar(Toolbar).style.left = offsetleft + "px";
            this.GetEditorObject.ToolBar(Toolbar).style.top = this.TempScrollTop + "px";
        } else {
            this.GetEditorObject.SideBarButtons().style.left = 0 + 'px';
        }
    },


    GuidesRules: function(Value) {

        //Set the guides and rulers visibility.
        try {
            if (Value == "Hide") {
                this.GetEditorObject.GuidesContainer().style.visibility = "hidden";
                this.GetEditorObject.GuidesContainer().style.overflow = "hidden";
                this.GetEditorObject.RulersRight().style.visibility = "hidden";
                this.GetEditorObject.RulersLeft().style.visibility = "hidden";
            } else {
                this.GetEditorObject.GuidesContainer().style.visibility = "visible";
                this.GetEditorObject.GuidesContainer().style.overflow = "visible";
                this.GetEditorObject.RulersLeft().style.visibility = "visible";
                this.GetEditorObject.RulersRight().style.visibility = "visible";
            }
        } catch (b) {}
    },
    ResetMargins: function(Margin) {

        //Set the margins widths.

        this.WordPressMargins = (parseInt(Margin) / 2) + 1;
        if (!isNaN(this.WordPressMargins)) {
            this.GetEditorObject.MarginCenter().style.backgroundColor = PNETOOLS.MarginColor;
            this.GetEditorObject.EditorGrids().style.width = parseInt(Margin) + 1 + "px";
            this.GetEditorObject.EditorGrids().style.left = "-" + parseInt(this.WordPressMargins) + "px";
            this.GetEditorObject.EditorGrids().style.borderColor = PNETOOLS.MarginColor;
            this.GetCanvasObject.Spacer().style.width = Margin + "px";
            this.GetEditorObject.MarginsWidthInput().value = this.WordPressMargins * 2 - 2;
            this.GetEditorObject.EditorGrids().style.visibility = "visible";
            MarginWidth = parseInt(Margin);
            this.SetMarginType();
        }
    },
    SetGuidesDiv: function(Value) {
        //Set the guides div.
        var InnerHTML;
        this.GuidesCount = this.GuidesCount + 1;
        if (Value == "Vertical") {
            InnerHTML = '<div onMouseOver="javascript:document.body.style.cursor=\'move\'" onMouseOut="javascript:document.body.style.cursor=\'auto\'" id="GuidVertical' + this.GuidesCount + '" style="height:20000px;width:2px;border:none;background-image:url(\'guides.jpg\');background-repeat:repeat-y repeat-x;position:absolute;top:1px;left:100px;visibility:visible"></div>';
            this.LockedElement = "GuidVertical" + this.GuidesCount;
        } else {
            InnerHTML = '<div onMouseOver="javascript: document.body.style.cursor=\'move\'" onMouseOut="javascript:document.body.style.cursor=\'auto\'" id="GuidHorizontal' + this.GuidesCount + '" style="height:2px;width:100%;border:none;background-image:url(\'guides2.jpg\');background-repeat:repeat-y repeat-x;position:absolute;top:22px;left:0px;visibility:visible"></div>';
            this.LockedElement = "GuidHorizontal" + this.GuidesCount;
        }
        this.GetEditorObject.GuidesContainer().innerHTML = this.GetEditorObject.GuidesContainer().innerHTML + InnerHTML;
    },
    Setselect: function(Obj, Value) {
        //Set a selector on a select.
        var Ele = this.RE(Obj);
        for (var a = 0; a < Ele.options.length; a++) {
            if (Ele.options[a].value.match(Value)) {
                Ele.options[a].selected = true;
                break;
            }
        }
    },
    SubmitHtmlSave: function() {

        // Submit HTML Save.
        this.RE("SaveType").value = "HTML";
        var Obj = this.RE("NoEditupper9viewsave");
        Obj.style.visibility = "visible";
        var Ele = (Obj.contentWindow || Obj.contentDocument);
        if (Ele.document) {
            Ele = Ele.document;
        }
        Ele.body.innerHTML = this.RE("FocusedElements").innerHTML;
        Ele.forms["HTMLSUBMIT"].submit();
        this.RE("SaveType").value = 0;
    },
    SelectLayerStyle: function() {
        // Select a layer style option menu.
        var Str = "";
        for (var b = this.LayerNames.length - 1; b >= 0;
            --b) {
            if (this.LayerNames[b] !== undefined && b != this.LayerNumberActive) {
                if (this.LayerType[b] == this.LayerType[this.LayerNumberActive]) {
                    Str = Str + "<option value=" + b + ">" + this.LayerNames[b] + "</option>";
                }
            }
        }
        if (Str !== "" && this.AltBrowser2 === false) {
            Str = '<option value="No-style">Select Style</option>' + Str;
            this.GetEditorObject.OptionStylesSelect().innerHTML = '<select class="Btext" id="SelectDuplicateStyle" onChange="PNETOOLS.DLStyle(this.value)">' + Str + "</select>";
        } else {
            this.GetEditorObject.OptionStylesSelect().innerHTML = "None Available Yet";
        }
    },
    SetRulers: function(str) {
        // Sets the top rulers.
        var Margin, Margin2;
        SetRulerMargin = parseInt(this.GetEditorObject.EditorGrids().style.width) / 2;
        if (str == "template" && SetRulerMargin > 200 && SetRulerMargin < 700) {
            Margin = SetRulerMargin;
            Margin2 = SetRulerMargin;
        } else {
            Margin = this.WindowWidth - 20;
            Margin2 = this.WindowWidth - 20;
        }
        this.GetEditorObject.RulersLeft().style.width = Margin + "px";
        this.GetEditorObject.RulersLeft().style.left = "-" + (Margin - 1) + "px";
        this.GetEditorObject.RulersRight().style.width = Margin2 + "px";
    },
    CloneLayer: function() {
        // Clone a layer and set the canvas, array attributes and objects.
        PNETOOLS.HideEditorObjects();
        this.CKDestroy();
        var ContainerClone = this.CurrentLayerObject.Container.cloneNode(true),
            EditorClone = this.CurrentLayerObject.Editor.cloneNode(true);
        this.LayerNumber = this.LayerNumber + 1;
        this.LayerName = this.LayerName + 1;
        this.ImageNumber = this.ImageNumber + 1;
        this.GetEditorObject.LayerNamesInput().value = "Clone " + this.LayerNames[this.CurrentLayerNumber].substring(0, 10);
        this.LayerPadding[this.LayerNumber] = parseInt(ContainerClone.style.padding);
        this.LayerAttributeHeight[this.LayerNumber] = parseInt(ContainerClone.style.height);
        this.LayerAttributeWidth[this.LayerNumber] = parseInt(ContainerClone.style.width);
        var NewLeft = "-" + (+200 + this.LayerOffSetStep);
        this.LayerAttributeTop[this.LayerNumber] = (90 + this.LayerOffSetStep + this.TempScrollTop) - this.inlineOffestY;
        this.LayerOffSetStep = this.LayerOffSetStep + 5;
        this.LayerAttributeLeft[this.LayerNumber] = NewLeft;
        ContainerClone.style.left = NewLeft + "px";
        ContainerClone.style.top = this.LayerAttributeTop[this.LayerNumber] + "px";
        ContainerClone.style.visibility = "visible";
        this.LayerType[this.LayerNumber] = this.LayerType[this.CurrentLayerNumber];
        this.LayersContainerTypes[this.LayerNumber] = this.LayersContainerTypes[this.CurrentLayerNumber];
        this.EditorLayer = this.BuildEditorLayer(this.LayerNumber);
        this.LayersEditableTypes[this.LayerNumber] = this.LayersEditableTypes[this.CurrentLayerNumber];
        this.LayersEditableDivs.push(this.BuildEditableLayer(this.LayerNumber));
        this.LayersEditorDivs.push(this.EditorLayer);
        this.EditableDivLayer = this.BuildEditableLayer(this.LayerNumber);
        this.LayersCanvasContainers.push(this.BuildContainerLayer(this.LayerNumber));
        ContainerClone.style.zIndex = this.LayerNumber;
        ContainerClone.id = this.BuildContainerLayer(this.LayerNumber);
        EditorClone.id = this.BuildEditorLayer(this.LayerNumber);
        this.LayerNumberActive = this.LayerNumber;
        this.LayerLevels[this.LayerNumber] = this.LayerNumber;
        this.LayerLevelToggle = this.LayerNumber;
        this.LayerOffSetLeft[this.LayerNumber] = 15;
        this.LayerOffSetTop[this.LayerNumber] = 0;
        this.LayerAttributeVisiblity[this.LayerNumber] = "visible";
        this.LayerCount = this.LayerCount + 1;
        this.LayerNumberActive = this.LayerNumber;
        ContainerClone.setAttribute("data-pneLayerNumber", this.LayerNumber);
        EditorClone.setAttribute("data-pneLayerNumber", this.LayerNumber);
        EditorClone.style.left = this.LayerAttributeLeft[this.LayerNumber] + "px";
        EditorClone.style.top = this.LayerAttributeTop[this.LayerNumber] - 15 + "px";
        if (ContainerClone.children[0].id.match(this.KEY.CanvisLink)) {
            ContainerClone.children[0].id = this.KEY.Prefix + this.LayerNumber + this.KEY.CanvisLink;
            ContainerClone.children[0].children[0].id = this.BuildEditableLayer(this.LayerNumber);
            ContainerClone.children[0].children[0].setAttribute("data-pneLayerNumber", this.LayerNumber);
              this.REI(this.CurrentCanvas).appendChild(ContainerClone);
              this.GetEditorObject.EditorMirrorCanvas().appendChild(EditorClone);
              this.AddEventListen(this.GetCanvasObject.LayerLink(this.LayerNumber), 'click', this.ReturnFalse);
        } else {
            ContainerClone.children[0].id = this.BuildEditableLayer(this.LayerNumber);
            ContainerClone.children[0].setAttribute("data-pneLayerNumber", this.LayerNumber);
            this.REI(this.CurrentCanvas).appendChild(ContainerClone);
            this.GetEditorObject.EditorMirrorCanvas().appendChild(EditorClone);
          }
       
         this.ControlLayers();
    },
    StyleRollOver: function(SetRollover) {
        // Not in use but can be used for creating rollover buttons.
        if (this.TestOBJECT(this.LayersEditableDivs, this.EditableDivLayer)) {
            var CanvasObject = this.CurrentLayerObject.Editable;
            if (SetRollover == "Delete") {
                CanvasObject.removeAttribute("data-pnetcolor");
                CanvasObject.removeAttribute("data-pnebgcolor");
                CanvasObject.removeAttribute("onmouseover");
                CanvasObject.removeAttribute("onmouseout");
                return;
            }
            var RolloverAttribute = "this.setAttribute('data-pnetcolor', this.style.color);this.style.color='" + "#" + this.RE("pneonmouseoverc").value + "'";
            var RolloverAttribute2 =
                ";this.setAttribute('data-pnebgcolor', this.style.backgroundColor);this.style.backgroundColor='" + "#" + this.RE("pneonmouseoverbg").value + "'";
            var Rollout =
                "this.style.color=this.getAttribute('data-pnetcolor');this.style.backgroundColor=this.getAttribute('data-pnebgcolor')";
            CanvasObject.setAttribute("onmouseover", RolloverAttribute + RolloverAttribute2);
            CanvasObject.setAttribute("onmouseout", Rollout);
        }
    },
    Getrad: function(radios) {
        // Loop thru radios.
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                // Do whatever you want with the checked radio
                return radios[i].value;
                // Only one radio can be logically checked, don't check the rest.
                break;
            }
        }
    },

    TextDecoration: function() {
        // Set text decoration.
        if (this.RE(this.KEY.Prefix + RNum(EditableDivLayer) + this.KEY.CanvisLink)) {
            this.RE(this.KEY.Prefix + RNum(EditableDivLayer) + this.KEY.CanvisLink).style.textDecoration = this.RE("textDecoration").value;
        }
    },
    BGColor: function(Color) {
        // Sets the background color of canvas.
  
        if (this.RE("PageBackgroundValue").value !== "") {
            this.CanvasWindow.getElementsByTagName("body")[0].style.backgroundColor = "#" + Color;
            this.RE("PlugneditBGColor").value = "#" + Color;
            GetCanvasObject.Canvas.setAttribute("data-pnebgcolor", "#" + Color);
        }
    },
    PNEMove: function(Stye, Value, Type, e) {

        // Move objects and reset the array attributes.
        var self = this;
        var ObjsSelected = this.MultipleSelectObjects.slice(0),
            Nudge = 1,
            NewStyle;
        PNETOOLS.HideEditorObjects();
        this.ResetDisplay();
        if (Type == 1) {
            Nudge = 10;
        }
        if (this.MultipleSelectMode === true) {
            for (var LayerNumber = ObjsSelected.length - 1; LayerNumber >= 0;
                --LayerNumber) {
                if (!this.PNENull(ObjsSelected[LayerNumber])) {
                    if (Stye == "top" && parseInt(this.GetCanvasObject.ContainerLayer(ObjsSelected[LayerNumber]).style[Stye]) <= 0) {
                        this.GetCanvasObject.ContainerLayer(ObjsSelected[LayerNumber]).style[Stye] = 0 + "px";
                        return;
                    }
                    if (Stye == "left" && Math.abs(parseInt(this.GetCanvasObject.ContainerLayer(ObjsSelected[LayerNumber]).style[Stye])) > this.WindowWidth) {
                        return;
                    }
                    this.GetEditorObject.EditorLayer(ObjsSelected[LayerNumber]).style[Stye] = parseInt(this.GetEditorObject.EditorLayer(ObjsSelected[LayerNumber]).style[Stye]) + Math.floor([Value] + Nudge) + "px";
                    NewStyle = parseInt(this.GetCanvasObject.ContainerLayer(ObjsSelected[LayerNumber]).style[Stye] = parseInt(this.GetCanvasObject.ContainerLayer(ObjsSelected[LayerNumber]).style[Stye]) + Math.floor([Value] + Nudge) + "px");
                    if (Stye == "top") {
                        this.LayerAttributeTop[ObjsSelected[LayerNumber]] = NewStyle;
                    } else {
                        this.LayerAttributeLeft[ObjsSelected[LayerNumber]] = NewStyle;
                    }
                }
            }
        } else {
            if (Stye == "top" && parseInt(this.REI(this.BuildContainerLayer(this.EditorLayer)).style[Stye]) < 0) {
                this.CurrentLayerObject.Container.style[Stye] = 0 + "px";
                return;
            }
            if (Stye == "left" && Math.abs(parseInt(this.CurrentLayerObject.Container.style[Stye])) > this.WindowWidth) {
                return;
            }
            if (this.CurrentLayerObject.Editor) {
                parseInt(this.CurrentLayerObject.Editor.style[Stye] = parseInt(this.CurrentLayerObject.Editor.style[Stye]) + Math.floor([Value] + Nudge) + "px");
                NewStyle = parseInt(this.CurrentLayerObject.Container.style[Stye] = parseInt(this.CurrentLayerObject.Container.style[Stye]) + Math.floor([Value] + Nudge) + "px");
                if (Stye == "top") {
                    this.LayerAttributeTop[this.CurrentLayerNumber] = NewStyle;
                } else {
                    this.LayerAttributeLeft[this.CurrentLayerNumber] = NewStyle;
                }
            }
        }
        if (this.PNEMOVEITEM === true) {
            setTimeout(function() {
                // set timeout to slow the movement.
                self.PNEMove(Stye, Value, Type);
            }, Type);
        }
    },

    CreateAdaptive: function() {
        //Create Adaptive Canvas.

        for (var key in PNETOOLS.CanvasObjects) {
            if (PNETOOLS.CanvasObjects.hasOwnProperty(key)) {
                createobject = document.createElement("div");
                createobject.id = key;
                createobject.setAttribute('data-Canvas', key);
                createobject.style.display = "none";
                this.REI(this.CurrentCanvas).appendChild(createobject);
            }
        }

        this.IsAdaptive = true;

    },
    ReleaseElements: function() {
        // Releases all editor variables of the current working layer.
        this.CurrentLayerObject.HTMLDIV = false;
        this.CurrentLayerObject.Container = false;
        this.CurrentLayerObject.Editable = false;
        this.CurrentLayerObject.Editor = false;
        this.CurrentLayerNumber = false;
        this.EditableDivLayer = false;
        this.EditorLayer = false;
        this.ImageLayer = false;
        this.LockPreSourceElementID = false;
        this.LockedElement = false;
        this.UnlockElement();
        PNETOOLS.HideEditorObjects();
    },

    SwitchCanvas: function(SwitchToCanvas) {
        // Switch to a new canvas.
        for (var key in PNETOOLS.CanvasObjects) {
            if (PNETOOLS.CanvasObjects.hasOwnProperty(key)) {
                this.REI(key).style.display = "none";
            }
        }
        // Reset just about everything.
        this.CurrentCanvas = SwitchToCanvas;
        this.REI(SwitchToCanvas).style.display = "";
        this.BrowserElementCurTag = "BODY";
        this.CKDestroy();
        this.initPlugNEdit();
        this.ReleaseElements();
        this.ResetDisplay();
        this.CleanWorkArea();
        this.ResetMargins(PNETOOLS.CanvasObjects[this.CurrentCanvas]);
    },


    SetMobileCanvas: function() {
        // Specail functions if mobile canvas.
    },

    Onselect: function(a) {
        // Control the onselect of objects.
        if (a == "select") {
            this.CanvasWindow.onselectstart = null;
            this.CanvasWindow.body.onselectstart = null;
        } else {
            this.CanvasWindow.onselectstart = function() {
                return false;
            };
            this.CanvasWindow.body.onselectstart = function() {
                return false;
            };
            document.onselectstart = function() {
                return false;
            };
            document.body.onselectstart = function() {
                return false;
            };
        }
    },
    LockLayer: function(LayerLock) {
        // User lock for resizing and moving.
        if (LayerLock === "true") {
            this.CurrentLayerObject.Container.setAttribute("data-pneLayerLock", "true");
        } else {
            this.CurrentLayerObject.Container.setAttribute("data-pneLayerLock", "false");
        }
        this.CleanWorkArea();
    },
    Swatches: function(Colorset) {
        //  Display swatches menu.
        this.CurrentColorSet = Colorset;
        this.GetEditorObject.SwatchMenu().src = "displayswatch.html";
        this.GetEditorObject.SwatchMenu().style.display = '';
        this.GetEditorObject.SwatchMenu().style.visibility = 'visible';
    },
    isLockedLayer: function(LayerNumber) {
        // Check if a locked layer.
        if (!LayerNumber && this.CurrentLayerNumber) {
            LayerNumber = this.CurrentLayerNumber;
        }
        if (LayerNumber === false) {
            return;
        }
        //  Check if user has locked position of size of current layer.
        if (this.GetCanvasObject.ContainerLayer(LayerNumber).hasAttribute("data-pneLayerLock")) {
            if (this.GetCanvasObject.ContainerLayer(LayerNumber).getAttribute("data-pneLayerLock") == "true") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    SetMarginType: function() {
        // Set the margins for proper layeouts.  Fixed and Handheld
        if (this.CurrentCanvas == "FixedLayoutCanvas") {
            this.FullSizeMargin = parseInt(this.MarginWidth);
        }
        if (this.CurrentCanvas == "MobileLayoutCanvas") {
            this.MobileMargin = parseInt(this.MarginWidth);
        }
    },
    isNumeric: function(ObjectLayer) {
        // Check if object is a number.
        return !isNaN(parseFloat(ObjectLayer)) && isFinite(ObjectLayer);
    },
    RE: function(ElementID) {
        // returns a elemets object from the editor frame.
        if (!this.PNENull(ElementID)) {
            return document.getElementById(ElementID);
        } else {
            return false;
        }
    },
    REI: function(ElementID) {
        // Returns element from canvas window iframe.
        if (this.CanvasWindow.getElementById(ElementID)) {
            return this.CanvasWindow.getElementById(ElementID);
        } else {
            if (this.CurrentWindow != "PNECANVASiframe") {
                return this.RE(Element);
            }
        }
    },
    LoadHTMLEditor: function() {
        // Load ckeditor if selected and installed.
        if (!PNETOOLS.CKEditor) {
            return;
        }

        this.AllowContentEditable = true;
        this.Editablecontent = true;
        var ScriptElement = document.createElement("script");
        ScriptElement.async = true;
        var self = this.CanvasWindow,
        editor = window;

        ScriptElement.addEventListener('load', function(e) {
            editor.PlugNedit.CKEDITOR = self.defaultView.window.CKEDITOR;

        }, false);
        ScriptElement.src = PNETOOLS.CKEditorInstallPath;
        ScriptElement.type = "text/javascript";

        this.CanvasWindow.getElementsByTagName("head")[0].appendChild(ScriptElement);
    },
    Constrain: function() {
        // Toggle constrian proportion.
        if (!this.CurrentLayerObject.Container.hasAttribute("data-Constrain")) {
            this.CurrentLayerObject.Container.setAttribute("data-Constrain", "1");
        } else {
            this.CurrentLayerObject.Container.removeAttribute("data-Constrain");
        }
    },
    RNum: function(object) {
        // Return number from a object.
        if (object) {
            if (this.isNumeric(object)) {
                return object;
            }
            return object.replace(/\D/g, "");
        }
    },
    FontWeight: function(a) {
        // Set the font weight.
        if (this.CurrentLayerObject.HTMLDIV.style.fontWeight.match("bold")) {
            this.CurrentLayerObject.HTMLDIV.style.fontWeight = "normal";
        } else {
            this.CurrentLayerObject.HTMLDIV.style.fontWeight = "bold";
        }
    },
    FontStyle: function(a) {
        // Set the font style.
        if (this.CurrentLayerObject.HTMLDIV.style.fontStyle.match("italic")) {
            this.CurrentLayerObject.HTMLDIV.style.fontStyle = "normal";
        } else {
            this.CurrentLayerObject.HTMLDIV.style.fontStyle = "italic";
        }
    },
    LTRText: function(a) {
        // Set left to right text
        this.CurrentLayerObject.HTMLDIV.dir = "ltr";
        this.GetEditorObject.EditableSource().dir = "ltr";
    },
    RTLText: function(a) {
        // Set right to left text.
        this.CurrentLayerObject.HTMLDIV.dir = "rtl";
        this.GetEditorObject.EditableSource().dir = "rtl";
    },
    Guides: function(a) {
        // Set guides.
        if (this.GetEditorObject.GuidesContainer().style.visibility == "visible") {
            this.GuidesRules("Hide");
        } else {
            this.GuidesRules("Show");
        }
    },
    CheckEmbed: function(Embeded) {
        // Check embed for plugnedit reserved names.
        if (Embeded.value.match("data-pnelnatrbt") || Embeded.value.match("ICG1ADDON")) {
            alert("The Embeded HTML Contains Reserved Keywords For The Editor");
            Embeded.value = "";
        }
    },
    PadBottom: function(padding) {
        // Set padding bottom.
        if (!isNaN(padding)) {
            this.PaddingPageBottom = padding;
        }
    },
    SetGradient: function(FirstColor, SecondColor) {
        // Set the gradient color of background.
        if (FirstColor != 'transparent') {
            FirstColor = '#' + FirstColor;
        }
        if (SecondColor != 'transparent') {
            SecondColor = '#' + SecondColor;
        }
        var Angle = this.RE('pnegradangle').value;
        PNETOOLS.StyleInlinediv('backgroundImage', 'linear-gradient(' + Angle + ',' + FirstColor + ',' + SecondColor + ')');
    },
    Grids: function(Grid) {
        // Set the grids.
        if (Grid === true) {
            this.GetEditorObject.EditorGrids().style.background = "url('grid.png') top center";
        } else {
            this.GetEditorObject.EditorGrids().style.background = "";
        }
    },
    SingleHandle: function(SingHandle) {
        // Use single or multiple handle for layers.
        if (SingHandle === true) {
            DisplayMove = 'none';
        } else {
            DisplayMove = '';
        }
    },
    DivtoText: function(a) {
        // Set the editor objects LTR RTL and display HTML.
        try {
            this.GetEditorObject.EditableSource().dir = this.RE(EditableDivLayer).dir;
        } catch (b) {
            this.GetEditorObject.EditableSource().dir = "ltr";
        }
        this.Onselect("select");
        try {
            this.style.MozUserSelect = "text";
        } catch (b) {}
        this.Sorttext(this.RE(EditableDivLayer).innerHTML, "2");
    },
    SubmitEmbed: function(EmbededCode) {
        // Submit embed.
        this.NewHTMLLayer(EmbededCode);
        this.ControlLayers();
    },
    OFFSiteHBlur: function(a) {
        // Offsite address display.
        if (this.value === "") {
            this.GetEditorObject.HyperLinkSelect().value = "None";
        }
        this.StyleEditorObject('offsiteaddress', 'visibility', 'hidden');
    },
    WindowBar: function(a) {
        // Display hide pull hinge.
        if (this.GetEditorObject.EditorMirrorCanvas().style.visibility == "visible") {
            this.GetEditorObject.EditorMirrorCanvas().style.visibility = 'hidden';
        } else {
            this.GetEditorObject.EditorMirrorCanvas().style.visibility = 'visible';
        }
    },
    UserAction: function() {
        // Not in use, but function to check if user is active.
    },
    setCharAt: function(str, index, chr) {
        // Sets char in string.
        if (index > str.length - 1) return str;
        return str.substr(0, index) + chr + str.substr(index + 1);
    },
    CreateResponsive: function() {
        // Set the resposive attribute
        this.GetCanvasObject.Canvas().setAttribute("data-PNEResponsive", "1");
    },
    BuildContainerLayer: function(LayerObject) {
        // Build single layer div id of the canvas layer.
        return this.KEY.Prefix + this.RNum(LayerObject) + this.LayersContainerTypes[this.RNum(LayerObject)];
    },
    BuildLink: function(LayerObject) {
        // Build single layer div id of the canvas layer.
        return this.KEY.Prefix + this.RNum(LayerObject) + this.KEY.CanvisLink;
    },
    BuildLayersMenu: function(LayerObject) {
        // Build single layer div id of the canvas layer.
        return this.KEY.Prefix + this.RNum(LayerObject) + this.LayersMenu;
    },
    isImage: function(LayerObject) {
        // check if object is a canvas layer image.
        if (LayerObject.match(this.KEY.EditorImage)) {
            return true;
        }
    },
    BuildEditorLayer: function(LayerObject) {
        // Build a layer ID from the LayerType Array
        return this.KEY.Prefix + this.RNum(LayerObject) + this.LayerType[this.RNum(LayerObject)];
    },
    BuildEditableLayer: function(LayerObject) {
        // Build the innder div ID from the layer type
        return this.KEY.Prefix + this.RNum(LayerObject) + this.LayersEditableTypes[this.RNum(LayerObject)];
    },
    OffsetInnerObject: function(CanvasObject) {
        // Compute the offset of inner div object.
        return ((CanvasObject.offsetTop) + parseInt(CanvasObject.style.padding));
    },
    AddEventListen: function(Obj, evnt, func) {
        // Add event listeners to objects
        if (Obj.addEventListener) {
            Obj.addEventListener(evnt, func, false);
        } else if (Obj.attachEvent) {
            Obj.attachEvent('on' + evnt, func);
        }
    },

    RemoveEventListen: function(Obj, evnt, func) {
        // Remove event listeners to objects
        if (Obj.addEventListener) {

            Obj.removeEventListener(evnt, func, false);
        } else if (Obj.attachEvent) {
            Obj.removeEventListener('on' + evnt, func);
        }
    },


    ReturnFalse: function(e) {
        // Stop propagation of default behavior. Used to stop drag and right click menu.
        e.preventDefault();
    },
    SelectStart: function() {
        // allow select text.
        var self = PlugNedit;
        self.Onselect('select');
        return true;
    },
    CheckUnload: function(d) {
        // On before unload check if accidentally leaving the page
        if (this.EditorClosed === false) {
            return "You are about to leave this page and all editing will be lost. Are you sure?";
        }
    },
    CloseSwatchFrames: function() {
        // Close Swatch frames.
        this.GetEditorObject.SwatchMenu().style.display = "none";
        this.GetEditorObject.SwatchMenu().style.visibility = "hidden";
    },
    EmbedHTML: function() {
        // Display Embed Menu.
        this.DisplayEditorMenus(this.GetEditorObject.InputEmbedMenu());
        this.RE("EmbededSource").value = "";
    },
    ObjectPosition: function() {
        // Triggred on scroll.
        var self = PlugNedit;
        self.ScrollLayers();
    },
    DisplayEditorMenus: function(object) {
        // Display Editor Menu and colored cover.
        object.style.visibility = 'visible';
        object.style.display = '';
        this.GetEditorObject.ColoredCover().style.zIndex = "10000";
        this.GetEditorObject.ColoredCover().style.display = "";
        this.GetEditorObject.ColoredCover().style.visible = "visible";
    },
    HideEditorMenus: function(object) {
        // Hide menu and colored background cover.
        object.style.visibility = 'hidden';
        object.style.display = 'none';
        this.GetEditorObject.ColoredCover().style.display = "none";
        this.GetEditorObject.ColoredCover().style.visible = "hidden";
    },
    DisplayOptionsMenu: function(a) {
        // Display the options menu.
        if (this.HasLink(this.CurrentLayerNumber)) {
            this.GetEditorObject.OptionsCustomURL().value = this.GetCanvasObject.LayerLink(this.CurrentLayerNumber).getAttribute('href');
        } else {
            this.GetEditorObject.OptionsCustomURL().value = "";
            this.GetEditorObject.OptionsHyperLinkSelect().value = "None";
            this.GetEditorObject.OptionsOffsiteDiv().style.display = 'none';
        }
        this.GetEditorObject.OptionsLayerName().value = this.LayerNames[this.CurrentLayerNumber];
        this.DisplayEditorMenus(this.GetEditorObject.LayerOptionsDialogBox());
        if (this.isImage(this.CurrentLayerObject.Editable.id)) {
            this.GetEditorObject.OptionsImageSrc().style.display = "";
            this.GetEditorObject.OptionsImageSrc().style.visibility = "visible";
            this.GetEditorObject.OptionsURLsrc().value = this.CurrentLayerObject.Editable.src;
        }
    },


    ONContextMenus: function(a) {},
    PrepSave: function(e, a) {
        this.TransferHT("s");
    },
    GetCanvasObject: {
        // Gets a canvas objects.
        EditableLayer: function(LayerNumber) {
            return PlugNedit.REI(PlugNedit.BuildEditableLayer(LayerNumber));
        },
        LayerLink: function(LayerNumber) {
            return PlugNedit.REI(PlugNedit.BuildLink(LayerNumber));
        },
        ContainerLayer: function(LayerNumber) {
            return PlugNedit.REI(PlugNedit.BuildContainerLayer(LayerNumber));
        },
   
        Spacer: function() {
            return PlugNedit.REI('ICG1ADDONS-Spacer');
        },
        Canvas: function() {
            return PlugNedit.REI('ICG1ADDON');
        },
        MobileCanvas: function() {
            return PlugNedit.REI("MobileLayoutCanvas");
        },
        FixedCanvas: function() {
            return PlugNedit.REI("FixedLayoutCanvas");
        }
    },
    SetEditorObjects: function() {
        // Sort and set the editor objects.
        var TempFunction;
        for (var key in PNETOOLS.EditorObjectsIDs) {
            TempFunction = "return PlugNedit.RE('" + PNETOOLS.EditorObjectsIDs[key] + "');";
            this.GetEditorObject[key] = new Function('a', TempFunction);
        }
    },
    GetEditorObject: {
        // Get a editor object.
        EditorLayer: function(LayerNumber) {
            return PlugNedit.RE(PlugNedit.BuildEditorLayer(LayerNumber));
        },
        LayersMenu: function(LayerNumber) {
            return PlugNedit.RE(PlugNedit.BuildLayersMenu(LayerNumber));
        },
        ToolBar: function(ToolBarNumber) {
            return PlugNedit.RE("NoEdittool" + ToolBarNumber);
        }
    },
    HasAttriubteValue: function(Obj, Name, Value) {
        // Check if attribute value exists.
        if (!Name) {
            Name = "id";
        }
        if (Obj.nodeType == 1 && Obj.hasAttribute(Name)) {
            if (Obj.getAttribute(Name)) {
                if (Value) {
                    return Obj.getAttribute(Name);
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    PrepEnvironment: function() {
        // Before load check if blank html or page or already created PNE page.
        var Obj = PlugNedit.RE("PNECANVASiframe");
        // Obj.name = "PNECanvasFrame"
        PlugNedit.CanvasWindow = Obj.contentDocument || Obj.contentWindow.document;
        PlugNedit.SetEditorObjects();
        Obj.name = "PNECanvasFrame";
        if (!PlugNedit.CanvasWindow.getElementById('ICG1ADDON')) {
            PlugNedit.GetEditorObject.EntryPageSelection().style.display = 'none';
            var divwrapper = PlugNedit.CanvasWindow.createElement('div');
            var div = PlugNedit.CanvasWindow.createElement('div');

            div.setAttribute.style = "text-align: center; position: relative; width: 100%;";
            div.id = 'ICG1ADDON';
            div.setAttribute('data-pneVersion', '4');
            div.setAttribute('data-Hguides', '');
            div.setAttribute('data-Vguides', '');
            div.setAttribute('data-pnekey', '');
            div.setAttribute('data-pneBackgroundColor', '');
            var div2 = PlugNedit.CanvasWindow.createElement('div');
            div2.setAttribute('style', 'position: static; height: 50px; width: 0px; overflow: visible; background-color: transparent;');
            div2.id = 'ICG1ADDONS-Spacer';
            var div3 = PlugNedit.CanvasWindow.createElement('div');
            div3.id = 'PNEcanvasI';
            div3.setAttribute('style', 'position: absolute; width: 0px; top: 0px; z-index: 10; left: 50%; overflow: visible;');
            div.appendChild(div2);
            div.appendChild(div3);
            divwrapper.id = "pneWrapper";
            divwrapper.appendChild(div);

            PlugNedit.CanvasWindow.body.appendChild(divwrapper);
            PlugNedit.GetEditorObject.ColoredCover().style.display = 'none';
            PlugNedit.GetEditorObject.EntryPageSelection().style.display = 'none';
            if (PNETOOLS.TypeAdaptive === true)

            {
            
               
                PlugNedit.CreateAdaptive();

            }

        } else {
            // Hide the cover.

            PlugNedit.GetEditorObject.ColoredCover().style.display = 'none';
            PlugNedit.GetEditorObject.EntryPageSelection().style.display = 'none';
        }


        // Check if browser support the color input or need javascript to create the color palette.
        var ColorElement = document.createElement("input");
        ColorElement.setAttribute("type", "color");
        var c;


        var ColorInput = document.getElementsByTagName("input");
        var i;
        var UpdateCode;
        var InputCode;


        for (i = 0; i < ColorInput.length; i++) {

            if (ColorInput[i].hasAttribute('data-colorinput') && ColorElement.type == "text") {

                ColorInput[i].type = "text";

            } else if (ColorInput[i].hasAttribute('data-colorinput') && ColorElement.type == "color") {
                ColorInput[i].type = "color";
                InputCode = "this.value.replace(/#/g, '')";
                UpdateCode = "PlugNedit.RE('" + ColorInput[i].id + "h').value=" + InputCode + ";PlugNedit.RE('" + ColorInput[i].id + "h').onchange()";
                ColorInput[i].setAttribute('onchange', UpdateCode);

            }



        }

        if (ColorElement.type == "text" ) {
            // Load color picker if not supported.
            console.log('JSColor')
            var ScriptElement = document.createElement("script");
            ScriptElement.src = PNETOOLS.JScolorInstallPath;
            ScriptElement.type = "text/javascript";
            ScriptElement.id = "jscolor";
            document.getElementsByTagName("head")[0].appendChild(ScriptElement);



        }
        PlugNedit.DisplayLog();
        console.log('Start Load');
            // Start the editor funcitons.
        PlugNedit.setToolbars();
        PlugNedit.LoadPage();
        PlugNedit.SetContentEditable('false');

        window.name = "PNEDITOR";
        PlugNedit.AddEventListen(PlugNedit.GetEditorObject.EditableSource(), 'selectstart', PlugNedit.SelectStart);
        PlugNedit.initPlugNEdit();
        PlugNedit.Elementposition();
        PlugNedit.checkVersion();
        if (PNETOOLS.Rulers) {
            PlugNedit.SetRulers();
        }
        PlugNedit.intbanner = false;
        PlugNedit.MarginHeigth = PNETOOLS.MarginHeight;
        PlugNedit.ResetMargins(PNETOOLS.MarginWidth);
        PlugNedit.Bullpen();
        PlugNedit.SideBar();
        PlugNedit.LoadFontFrame();
        document.getElementById('PNEFontFrame').src = PNETOOLS.FontFramePath;
        PlugNedit.LoadHTMLEditor();
        PNETOOLS.EditorReady();
        PlugNedit.CleanWorkArea(0, true);

    },


    setToolbars: function() {
        // Used for pallet toolbars, none in demo.
        this.GetEditorObject.MiniToolbar().style.display = PNETOOLS.DisplayMiniTools;
    },

    ImportPictures: function() {
        // Mini gallery import, no in use on demo.
        var xmlhttp = new XMLHttpRequest();
        var url = "assets/ImageGallery.txt";
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var PicArray = JSON.parse(xmlhttp.responseText);
                PicsDisplay(PicArray);
            }
        };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        function PicsDisplay(arr) {
            var Output = "";
            var i;
            for (i = 0; i < arr.length; i++) {
                Output += '<img onclick=PNETOOLS.PlaceImage("' + arr[i].urlLarge + '") src="' + arr[i].thumbNail + '"><br>' + arr[i].ImageName + '<br>';
            }
            PlugNedit.RE("respond-NoEdit2").innerHTML = Output;
        }
    },
    // Define PlugNedit Globals
    CKEDITOR: false,
    UndoSteps: false,
    CKEDITORcurrentStatus: false,
    AltBrowser: document.all ? true : false,
    AltBrowser2: document.all ? true : false,
    LockedElement: false,
    LockPreSourceElement: false,
    ProximityHot: false,
    ProximityLock: false,
    LockPreSourceElementID: false,
    FireLight: 0,
    LayerLight: 0,
    EditableDivLayer: false,
    ImageNumber: 0,
    LayerNumber: 0,
    Undostep: [],
    UndoAlts: [],
    UndoLayersCanvasContainers: [],
    UndoLayersEditorDivs: [],
    UndoLayersContainerTypes: [],
    UndoLayersEditableTypes: [],
    UndoLayersImageContainers: [],
    UndoLayersImageObjects: [],
    UndoLayersEditableDivs: [],
    UndoPNEEmbedLayer: [],
    LayerLevels: [],
    UndoLayerLevels: [],
    LayerLevelsToggle: [],
    LayersActive: [],
    UndoLayersActive: [],
    UndoLayerType: [],
    UndoLayerNames: [],
    UndoLayerPadding: [],
    UndoLayerLevelsToggle: [],
    UndoLayerAttributeWidth: [],
    UndoLayerAttributeHeight: [],
    UndoLayerAttribute: [],
    UndoLayerAttributeTop: [],
    UndoLayerAttributeLeft: [],
    UndoLayerOffSetLeft: [],
    UndoLayerOffSetTop: [],
    UndoTempPointX: [],
    UndoTempPointY: [],
    UndoLayerAttributeVisiblity: [],
    UndoLayerTransAngle: [],
    UndoLayersLinked: [],
    UndoImageActualH: [],
    UndoImageActualW: [],
    Arraycount: 1,
    LayerName: 0,
    StepCount: 0,
    LayerAttributeWidth: [],
    LayerAttributeHeight: [],
    LayerAttribute: [],
    LayerAttributeTop: [],
    LayerAttributeLeft: [],
    LayerOffSetLeft: [],
    LayerOffSetTop: [],
    LayerPadding: [],
    EditorLayer: false,
    VisToggle: "none",
    SingleEdit: 0,
    LayerNumberActive: 0,
    TempPointX: [],
    TempPointY: [],
    Overlap: 0,
    LayerType: [],
    LayersContainerTypes: [],
    LayersEditableTypes: [],
    LayerNames: [],
    LayerIDS: [],
    LockedDown: false,
    LayerAttributeVisiblity: [],
    PNEMouseXY: 0,
    ControlTop: [
        0,
        230,
        160,
        310,
        360,
        30,
        10,
        10
    ],
    OffSets: [
        0,
        0,
        15,
        16,
        24,
        15
    ],
    LayerTransFilter: [],
    LayerTransOpacity: [],
    ControlLeft: [],
    LayerLinks: [],
    myWidth: 0,
    myHeight: 0,
    PlayPen: "Off",
    PlayPenWidth: 800 + 50,
    PlayPenHeight: 600 + 50,
    ResMatch: 0,
    ilayers: 0,
    CloseSession: 0,
    ToggleResize: 0,
    LayerCount: 0,
    Centered: true,
    Secondload: 1,
    Setplacement: 0,
    FirstEdit: 0,
    LayerOffSetStep: 10,
    WordPressStandard: 0,
    ConnectedToServer: 1,
    AutoSaveCount: 1,
    TempScrollTop: 0,
    TempScrollLeft: 0,
    LayerTransAngle: [],
    LayersLinked: [],
    ImageActualH: [],
    ImageActualW: [],
    useATTrname: "data-pnelnatrbt",
    FrameSetScrollTop: 0,
    ToolBarOffsetHeight: 0,
    inlineOffestX: 0,
    inlineOffestY: 0,
    ToolbarPos: 0,
    TheBarInUse: "0",
    MarginHeigth: 0,
    MarginWidth: 0,
    PNELinkBack: false,
    ImageLayer: false,
    WordPressMargins: 252,
    StopConnection: 1,
    GuidesCount: 1,
    PNERichText: true,
    PNETOCKEditor: false,
    PNEUNLOCKEDITOR: false,
    CurrentLayerNumber: false,
    AdjustTheDivINT: false,
    PNECKRenew: false,
    PNECKEditorLoaded: false,
    AdjustDivOption: true,
    IFrameScrolling: 0,
    ZindexToggle: 0,
    AdvancedEditor: false,
    AllowSelectInline: true,
    AllowContentEditable: true,
    Editablecontent: true,
    ClosePNESession: false,
    BrowserElementCurTag: "BODY",
    PNEsidebaroffset: 0,
    KEY: {
        EditorDiv: "PNEdiv",
        CanvasDiv: "PNEdivCnvs",
        ImageObject: "PNEimageCnvsI",
        DivObjectI: "PNEdivCnvsI",
        EditorImage: "PNEimage",
        CanvasImage: "PNEimageCnvs",
        Prefix: "p",
        EditorEmbed: "Not In Use",
        CanvasEmbed: "Not In Use",
        CanvisLink: "PNElink"
    },
    CKKey: {
        Prefix: "cke_"
    },
    KeyOffset: {
        Top: 0,
        Left: 0,
        InnerDiv: 15
    },
    CurrentLayerObject: {
        ContainerDIV: false,
        InnerObject: false,
        EditorObject: false,
        HTMLDIV: false
    },
    LayersMenu: "PNELayersMenu",
    Bannercount: 1,
    PNECKGoogleFonts: "",
    DisplayMove: "none",
    PNEPICSizeW: [],
    PNEPICSizeH: [],
    MultipleSelectObjects: [],
    PNELayerdrag: [],
    MultipleSelectMode: false,
    CKEDITORStatus: "None",
    CurrentColorSet: "",
    PNEkrepeat: 0,
    PNEmovealltop: [],
    Movealllayerspivot: 0,
    PNEMoveBelow: false,
    SetHighestset: 0,
    ProcessXY: true,
    PNESnap: true,
    PaddingPageBottom: 60,
    CurrentCanvas: "PNEcanvasI",
    ElementClone: 0,
    FullSizeMargin: 800,
    MobileMargin: 540,
    LayersEditorDivs: [],
    LayersCanvasContainers: [],
    LayersImageContainers: [],
    PNEImage: [],
    PNEEmbedLayer: [],
    LayersEditableDivs: [],
    PNEgalleryloaded: 0,
    InterObjOffset: 25,
    LayersImageObjects: [],
    RTL: 0,
    LockWorkArea: 0,
    bordercolor: "red",
    Overbordercolor: "grey",
    Nudgewin: true,
    EditorOffsetY: false,
    EditorOffsetX: false,
    EditorClosed: false,
    InCKeditorWindow: false,
    IEBVersion: 6,
    ReloadVersion: 0,
    ONResizeLoad: 0,
    CurrentObjectID: false,
    IframeOffsetTop: 0,
    CanvasHTML: ""
};
//  ---------------------------------------




//  ---------------------------------------
PNEloadstatus('Flux-js');