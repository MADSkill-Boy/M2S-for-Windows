function errormod(text){
  vex.dialog.alert(text);
}

function infomod(text){
  vex.dialog.alert(text);
}

function imagemod(image){
  var imagemod = gui.Window.open('imagemod.html?img='+image, {
    position: 'center',
    min_width: 100,
    min_height: 100,
    toolbar:false,
    frame:false,
    resizable: true
  });
}