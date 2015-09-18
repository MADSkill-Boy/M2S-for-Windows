var keyuser = localStorage.getItem('keyuser');

function pagefunctions(){
$('#sign-out .cabe-showh').click(function(){
	signout();
})


if(!localStorage.getItem('imguse')){
    $('.img-center').attr('src', "images/icon-user-default.png");
    myimgs = "images/icon-user-default.png";
}else{
  	$('.img-center').attr('src', localStorage.getItem('imguse'));
  	myimgs = localStorage.getItem('imguse');
}

$('.menu-bar img').attr("src", myimgs);

$('.cabe-showh').click(function(){
	namethis = $(this).attr('alt');
	if(namethis != 'sign-out'){
       if($('#'+namethis+' .cont').is(":visible")){
       	 $('#'+namethis+' .cont').hide();
       }else{
       	 $('#'+namethis+' .cont').show();
       }
	} 
})

$('#changeimage').change(function(e) {
  var file = e.target.files[0],
    imageType = /image.*/;

  if (!file.type.match(imageType))
    return;

  var reader = new FileReader();
  reader.onload = fileOnload;
  reader.readAsDataURL(file);

});

function fileOnload(e) {
  var $img = $('<img>', {
    src: e.target.result
  });
  url = e.target.result;
  $('.loadingimg').show();
  $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/editprofile.php",
      data: {"imgeprofile": url, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
          console.log(result.mensaje);
          if(result.mensaje == 'ok'){
          	$('.loadingimg').hide();
          	$('.img-center').attr('src', url);
          	localStorage.setItem('imguse', url);
          }else{
          	errormod('Error uploading...');
          	$('.loadingimg').hide();
          }
      }
   })
}

$('#updtphbtn').click(function(){
	var newphnum = $('#mophn').val();
	$.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/editprofile.php",
      data: {"phonenumber": newphnum, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
          console.log(result.mensaje);
          if(result.mensaje == 'ok'){
          	infomod(Language.updatephonesucces);
          	$('#mophn').val('');
          }else{
          	console.log(result.mensaje);
          }
      }
     })
})

$('option[value="'+langdefault+'"]').attr('selected','selected');

$('.changelang').click(function(){
   if($('#idiomch').val() != langdefault){
     localStorage.setItem('lang', $('#idiomch').val());
     document.location.href='index.html';
   }
});

$('#updpassn').click(function(){
	var newpassw = $('#newpassi').val();
	var confpassw = $('#confnewpassi').val();
	if(newpassw != ''){
	$.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/editprofile.php",
      data: {"password": newpassw, "password_conf": confpassw, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
          console.log(result.mensaje);
          if(result.mensaje == 'ok'){
          	infomod(Language.updatepasssucces);
          	$('#newpassi').val('');
          	$('#confnewpassi').val('');
          	localStorage.removeItem('keyuser');
          }else{
            infomod(result.mensaje);
          }
          if(result.mensaje == 'e3'){
          	errormod(Language.passnotmatch);
          }
      }
     })
}else{
  errormod(Language.nointrpass);
}
})

$('.listfriendblock').html('<div id="loading-user" style="top:0px;margin-top:20px;padding-bottom:20px" id="load-idsd"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
$.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/blocklist.php",
    data: {"key": keyuser},
    cache: false,
    dataType: 'json',
    success: function(result) {
      if(result.list.length != '0'){
         $('.listfriendblock').html('');
         for (var i = 0; i < result.list.length; i++) {
            idg = result.list[i].id;
            username = result.list[i].name;
            imageprofile = result.list[i].imagepr;
            blockstatesfv = result.list[i].block;
            divcont = '<div class="userblockgrouplist" id="'+idg+'"><img src="'+imageprofile+'"/><div class="left-jk"><b>'+username+'</b>';
            if(blockstatesfv == 'yes'){
              divcont += ' <button class="unblockbu" id="'+idg+'" onclick="unblocpfu('+idg+')">'+Language.unblock+'</button>';
            }else{
              divcont += ' <button class="blockbu" id="'+idg+'" onclick="blockpfu('+idg+')">'+Language.block+'</button>';
            }
            divcont += ' <span onclick="infouser('+idg+')">'+Language.viewhisprofile+'</span> </div></div>';
            $('.listfriendblock').append(divcont);
         }
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.error(textStatus + ' ' + XMLHttpRequest.status);
      errormod(Language.errorpetitionm2s);
    }
})
}

function unblocpfu(datadi){
   $('#'+datadi+'.unblockbu').html(Language.loading);
   $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/acceptuser.php",
      data: {"id": datadi, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
        if(result.mensaje == 'ok'){
          $('#'+datadi+'.unblockbu').html(Language.block);
          $('#'+datadi+'.unblockbu').attr('onclick', 'blockpfu("'+datadi+'")');
          $('#'+datadi+'.unblockbu').addClass('blockbu');
          $('#'+datadi+'.unblockbu').removeClass('unblockbu');
        }else{
          console.log('Error:'+result.mensaje);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}

function blockpfu(datadi){
   $('#'+datadi+'.blockbu').html(Language.loading);
   $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/blockuser.php",
      data: {"recid2": datadi, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(result) {
        if(result.mensaje == 'ok'){
          $('#'+datadi+'.blockbu').html(Language.unblock);
          $('#'+datadi+'.blockbu').attr('onclick', 'unblockpfu("'+datadi+'")');
          $('#'+datadi+'.blockbu').addClass('unblockbu');
          $('#'+datadi+'.blockbu').removeClass('blockbu');
        }else{
          console.log('Error:'+result.mensaje);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}

$('.exportbutton').click(function(){
    var json = JSON.stringify(localStorage);
    var encoded = btoa(json);

    $.generateFile({
      filename: 'dataoffline.json',
      content: encoded,
      script: 'http://m2s.es/app/api/downloadfile.php'
    });
})

$('.importbutton').click(function(){
	document.location.href= '/importjson.html';
})

