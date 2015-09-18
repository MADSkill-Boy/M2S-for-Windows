var
applicationRoot 		= './', 								// Configuration variable
gui 					= require('nw.gui'),					// Load native UI library
isDebug 				= gui.App.argv.indexOf('--zybug') > -1, // Debug flag
win 					= gui.Window.get(), 					// browser window object
os 						= require('os'), 						// os object
path 					= require('path'), 						// path object
fs 						= require('fs'), 						// fs object
url 					= require('url'), 						// url object
osPlatform				= process.platform,
request 				= require('request'),
AdmZip				    = require('adm-zip'),
wget                    = require('wget');
tunnel                  = require('tunnel');

initApp = function(callback){
    /*win.showDevTools();*/
	callback();
},
initGui = function(callback){

		win.title = 'M2S';
		win.on('new-win-policy', function (frame, url, policy) {
			if(url.indexOf('facebook')==-1){
				policy.ignore();
				win.focus();
			}
		});

		// Prevent dropping files into the window
		window.addEventListener("dragover", preventDefault, false);
		window.addEventListener("drop", preventDefault, false);

		// Prevent dragging files outside the window
		window.addEventListener("dragstart", preventDefault, false);


		process.on('uncaughtException', function(err){
			if (console) {
				console.log(err);
			}
		});

		callback();

},
preventDefault = function(e) {
    e.preventDefault();
},
api = {

	send:function(data){
		frames['igui'].postMessage({api:data}, "*");
	},

	eval:function(c){
		eval(c);
	},

	dragger:{
		areas:function(d){
			return //we don't want this on mac! (we need to replace this nodewebkit thing with our own c++ container)
			d.forEach(function(area){
				var d = document.createElement('div')
				d.className = 'dragger';
				d.setAttribute('style','width:'+area[0]+';height:'+area[1]+';top:'+area[2]+';left:' + area[3]);
				d.onmouseout=function(){api.send({focus:true})}
				document.body.appendChild(d)
			})
		}
	},
}



window.onload = function(){
	win.focus();
	initApp(function(){


		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1);
		}

	});

	$('#max').click(function(){
	     if(win.isFullscreen){
			win.toggleFullscreen();
			console.log('ok');
	     }else{
			if (screen.availHeight <= win.height) {
			  win.unmaximize();
			}else{
			  win.maximize();
			}
	     }
    });
    $('#min').click(function(){
         win.minimize();
    });
    $('#close').click(function(){
         win.close();
    });

    $('#closehide').click(function(){
         win.hide();
         win.setShowInTaskbar(false);
         window.LOCAL_NW.desktopNotifications.notify('./images/icon.png', 'M2S', Language.minimizedapp, function(){win.show(); win.setShowInTaskbar(true);});
    });
}