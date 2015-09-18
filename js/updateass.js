function pagefunctions(){
var win = gui.Window.get();
win.title = 'M2S: '+Language.newupdate;
win.setMinimumSize(380, 225);
win.resizeTo(380, 225);

$('.closeapp').click(function(){
	win.close();
})

var download = function(urlt) {
  var src = urlt;
  var output = './update.zip';
  var options = {};
  var download = wget.download(src, output, options);
  download.on('error', function(err) {
     alert(err);
  });
  download.on('end', function(output) {
    var zip = new AdmZip("./update.zip");
    zip.extractAllTo("./",true);
    $('.download-update').hide();
    $('.closeapp').show();
    $('p').html("<b>"+Language.updatefinished+"</b><br>"+Language.updatefinished2);
    $('.app-title .text').html(Language.installation);
    fs.unlink('./update.zip', function (err) {});
    win.setMinimumSize(380, 160);
    win.resizeTo(380, 160);
  });
  download.on('progress', function(progress) {
  });
};

$('.download-update').click(function(){
   if(!$('.download-update').attr('disabled')){
     $('.download-update').attr('disabled','disabled');
     $('.download-update').html(Language.downloading);
     $('.cancelupdate').hide();
     download("https://dl.dropboxusercontent.com/u/47074505/m2s/os%20x/update.zip");
   }
})

$('.cancelupdate').click(function(){
   win.setMinimumSize(380, 600);
   win.resizeTo(380, 600);
   document.location.href="/myfriends.html";
});
}