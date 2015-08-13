// Copyright Flux editor, Javascript Tech, Inc. http : // plugnedit.com
PlugNeditFontLoader = {
     
      // Your google API KEY here..
    GoogleFontKey: false, 
    Color: "#06944D",
    PixelSize: 15,
    startAt: 0,
    Loaded: 0,
    SelectFonts: [],
    PFonts: [],
    SmothIE: 0,
    FontDelay: 250,
    scrollTimer: false,
    
  
    SetOffset: function() {
        for (var k = 0; k <  PlugNeditFontLoader.spans.length; k++) {
            if (Math.abs(PlugNeditFontLoader.TempScrollTop - PlugNeditFontLoader.spans[k].offsetTop) < 60) {
                PlugNeditFontLoader.startAt =  PlugNeditFontLoader.spans[k].id.replace(/[A-Za-z$-]/g, "");
                return;
            }
        }
    },

    ScrollTop: function() {
        if (typeof pageYOffset != 'undefined') {
            PlugNeditFontLoader.TempScrollTop = pageYOffset;
        } else {
            var B = document.body;
            var D = document.documentElement;
            D = (D.clientHeight) ? D : B;
            PlugNeditFontLoader.TempScrollTop = D.scrollTop;
        }
    },

    DisplayFonts: function() {
      
        PlugNeditFontLoader.ScrollTop();
        PlugNeditFontLoader.TheDisplays='';
        var offstart = Math.round(PlugNeditFontLoader.TempScrollTop / PlugNeditFontLoader.TheOffset);
       
        var AdjustOffset = document.getElementById('fontspan' + offstart).offsetTop - PlugNeditFontLoader.TempScrollTop;
        var Setat = Math.abs(PlugNeditFontLoader.startAt - offstart);
        PlugNeditFontLoader.startAt = offstart - 4;
        if (Math.abs(AdjustOffset) > 50) {
            PlugNeditFontLoader.SetOffset();
        }
        if (PlugNeditFontLoader.startAt < 0) {
            PlugNeditFontLoader.startAt = 0;
        }
        end = Math.round(parseFloat(PlugNeditFontLoader.startAt)) + 15;
        for (var i = PlugNeditFontLoader.startAt; i < end; i++) {
            if (typeof PlugNeditFontLoader.Thefonts[i] != "undefined") {
         
                PlugNeditFontLoader.TheDisplays = PlugNeditFontLoader.TheDisplays + PlugNeditFontLoader.Thefonts[i];
            }
        }
        document.getElementById('displays').innerHTML = PlugNeditFontLoader.TheDisplays;
    },

    SetFonts: function(fonts) {
    if (PlugNeditFontLoader.GoogleFontKey === false){console.log('Google API font key needs set in the googlefonts.js file under GoogleFontKey variable for fonts to load. ');return;}
        var SetFontHTML = '';
        PlugNeditFontLoader.Thefonts = [];
        for (var i = 0; i < fonts.items.length; i++) {
         
            SetFontHTML = SetFontHTML + '<input type="checkbox" data-pnefontcheck="' + fonts.items[i].family.replace(/ /g, '+') + '" name="check' + i + '" id="' + fonts.items[i].family.replace(/ /g, '+') + '" name="check' + i + '" onChange="PlugNeditFontLoader.ResetFonts()"> <span id="fontspan' + i + '" style="color:' + PlugNeditFontLoader.Color + ';font-size:' + PlugNeditFontLoader.PixelSize + 'px;font-family:' + fonts.items[i].family + '">' + fonts.items[i].family + '</span><BR>';
            PlugNeditFontLoader.Thefonts[i] = "<link href='http://fonts.googleapis.com/css?family=" + fonts.items[i].family.replace(/ /g, '+') + "' rel='stylesheet' type='text/css'>";
            PlugNeditFontLoader.PFonts[i] = fonts.items[i].family;
        }
        document.getElementById('content').innerHTML = SetFontHTML;
        PlugNeditFontLoader.spans = document.getElementsByTagName('span');
        PlugNeditFontLoader.TheOffset = document.getElementById('fontspan101').offsetTop - document.getElementById('fontspan100').offsetTop;
        PlugNeditFontLoader.DisplayFonts();
        PlugNeditFontLoader.Loadeditoroptions();
     
    },

    ResetFonts: function() {
        PlugNeditFontLoader.SelectFonts = [];
        var FontsInsert = [],
            FontInnerHTML = '',
            count = 0;
        for (var i = 0; i < PlugNeditFontLoader.PFonts.length; i++) {
            if (document.getElementById(PlugNeditFontLoader.PFonts[i].replace(/ /g, '+')).checked) {
                PlugNeditFontLoader.runList(PlugNeditFontLoader.PFonts[i]);
                PlugNeditFontLoader.SelectFonts[count] = PlugNeditFontLoader.PFonts[i];
                FontsInsert[count] = "<link id='" + PlugNeditFontLoader.PFonts[i].replace(/ /g, '+') + "' href='http://fonts.googleapis.com/css?family=" + PlugNeditFontLoader.PFonts[i].replace(/ /g, '+') + "'  data-pnefonts='" + PlugNeditFontLoader.PFonts[i] + "' rel='stylesheet' type='text/css'>";
                FontInnerHTML = FontInnerHTML + "<link id='" + PlugNeditFontLoader.PFonts[i].replace(/ /g, '+') + "' href='http://fonts.googleapis.com/css?family=" + PlugNeditFontLoader.PFonts[i].replace(/ /g, '+') + "'  data-pnefonts='" + PlugNeditFontLoader.PFonts[i] + "' rel='stylesheet' type='text/css'>";
                count = count + 1;
            }
        }
        parent.PlugNedit.GetCanvasObject.Spacer ( ).innerHTML = FontInnerHTML;
    },


        loadApiScript: function() {
    
        var script = document.createElement('script');
        script.src = 'https://www.googleapis.com/webfonts/v1/webfonts?key='+PlugNeditFontLoader.GoogleFontKey+'&callback=PlugNeditFontLoader.SetFonts';
        document.body.appendChild(script);
        PlugNeditFontLoader.FontOnload()
        
    },

    runList: function(NewOption) {
        var selected = parent.document.getElementById('fontFamily');
        var isset = false;
        for (i = 0; i < selected.length; ++i) {
            if (selected.options[i].value == NewOption) {
                isset = true;
            }
        }
        if (isset === false) {
            selected.options[selected.options.length] = new Option(NewOption, NewOption);
            parent.PNECKGoogleFonts = parent.PNECKGoogleFonts + NewOption + '/' + NewOption + ';';
        }
    },

    Loadeditoroptions: function() {
        var divs = parent.PlugNedit.CanvasWindow.getElementsByTagName('link');
        var selected = parent.document.getElementById('fontFamily');
        for (var i = 0; i < divs.length; i += 1) {
            if (divs[i].getAttribute('data-pnefonts')) {
                selected.options[selected.options.length] = new Option(divs[i].getAttribute('data-pnefonts'), divs[i].getAttribute('data-pnefonts'));
                parent.PNECKGoogleFonts = parent.PNECKGoogleFonts + divs[i].getAttribute('data-pnefonts') + '/' + divs[i].getAttribute('data-pnefonts') + ';';
                if (document.getElementById(divs[i].getAttribute('data-pnefonts').replace(/ /g, '+'))) {
                    document.getElementById(divs[i].getAttribute('data-pnefonts').replace(/ /g, '+')).checked = true;

                }
            }
        }
    },

    bodyScroll: function() {
        if (PlugNeditFontLoader.scrollTimer === false) {
            PlugNeditFontLoader.scrollTimer = setInterval("PlugNeditFontLoader.scrollFinished()", PlugNeditFontLoader.FontDelay);
        }
        PlugNeditFontLoader.HoldScrollTop = PlugNeditFontLoader.TempScrollTop;
        PlugNeditFontLoader.ScrollTime = true;
        PlugNeditFontLoader.ScrollTop();
    },

    scrollFinished: function() {
        if (PlugNeditFontLoader.TempScrollTop == PlugNeditFontLoader.HoldScrollTop) {
            clearInterval(PlugNeditFontLoader.scrollTimer);
            PlugNeditFontLoader.scrollTimer = false;
            if ( PlugNeditFontLoader.ScrollTime === true) {
                PlugNeditFontLoader.DisplayFonts();
            }
            PlugNeditFontLoader.ScrollTime = false;
        }
        PlugNeditFontLoader.HoldScrollTop = PlugNeditFontLoader.TempScrollTop;
    },

    FontOnload: function() {

        window.onscroll = PlugNeditFontLoader.bodyScroll;

    },
}