function pagefunctions(){
var keyuser = localStorage.getItem('keyuser');
if(localStorage.getItem('imguse')){
	myimgs = localStorage.getItem('imguse');
}else{
	myimgs = 'images/icon-user-default.png';
}
$('.menu-bar img').attr("src", myimgs);


$('#writte-state-button').append(localStorage.getItem('user'));

updatetimelinestates();

$('.bibutton #friends').click(function(){
  if($('.bibutton #friends.active').length == '0'){
        $('.groupsstates').hide();
        $('.usersfriends').show();
        $('.bibutton #friends').addClass('active');
        $('.bibutton #groups').removeClass('active')
  }
});

$('.bibutton #groups').click(function(){
  if($('.bibutton #groups.active').length == '0'){
        $('.groupsstates').show();
        $('.usersfriends').hide();
        $('.bibutton #groups').addClass('active');
        $('.bibutton #friends').removeClass('active')
  }
});

$('#writte-state-button').click(function(){
  $('#list-friends').hide();
  $('#writte-state').show();
})

$('#close-tabs').click(function(){
  $('#list-friends').show();
  $('#writte-state').hide();
})

$('.more-forsend').click(function(){
   $('.share-moreapp').show();
})

$('.modal-share span.remove').click(function(){
   $('.share-moreapp').hide();
})

$('.optlink#stickerss').click(function(){
   var slec = $('.optlink.sel').attr('id');
   $('.optlink.sel').removeClass('sel');
   $('.optlink#stickerss').addClass('sel');
   $('.'+slec).hide();
   $('.stickerss').show();
})

$('.optlink#imagest').click(function(){
   var slec = $('.optlink.sel').attr('id');
   $('.optlink.sel').removeClass('sel');
   $('.optlink#imagest').addClass('sel');
   $('.'+slec).hide();
   $('.imagest').show();
})

$('.optlink#locastdfg').click(function(){
   var slec = $('.optlink.sel').attr('id');
   $('.optlink.sel').removeClass('sel');
   $('.optlink#locastdfg').addClass('sel');
   $('.'+slec).hide();
   $('.locastdfg').show();
})

$('.bargroup-emo span').click(function(){
  name = $(this).attr('class');
  $('.icon-group').hide();
  $('.icon-group#'+name).show();
})

$('.send-state').click(function(){
  sendmsm();
})

$('#file-input').change(function(e) {
  var file = e.target.files[0],
    imageType = /image.*/;

  if (!file.type.match(imageType))
    return;

  var reader = new FileReader();
  reader.onload = fileOnload;
  reader.readAsDataURL(file);

});

$('#upload-image').click(function() {
    $('#upload-image').attr('disabled', 'disabled');
    var canvas = document.getElementById("canvas");
    var url = canvas.toDataURL("image/png", 1.0);
    url = url.replace('data:image/png;base64,', '');
    console.log(url);
    $.ajax({
      url: 'https://api.imgur.com/3/image',
      method: 'POST',
      headers: {
        Authorization: 'Client-ID def4c03828b22c2',
        Accept: 'application/json'
      },
      data: {
        image: url,
        type: 'base64'
      },
      success: function(result) {
        var link = result.data.link;
        $('textarea').val($('textarea').val() + ' ' + link);
        $('#upload-image').removeAttr("disabled");
        $('#upload-imge').hide();
        $('#share-mre').show();
        $('.selct-shareop').show();
        $('.sections-share').show();
        $('.imageuplo').hide();
        $('.share-moreapp').hide();
      }
    });
});

$('#cancel-upl-image').click(function() {
   $('#upload-imge').hide();
   $('#share-mre').show();
   $('.selct-shareop').show();
   $('.sections-share').show();
   $('.imageuplo').hide();
})

$('#btn-location').click(function() {
    if ($('#btn-location.btn-info').length != '0') {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
           console.log('Loading location...');
           var latitud = position.coords.latitude;
           var longitud = position.coords.longitude;
           var latlong = latitud + ' ' + longitud;
           console.log('Location:' + latlong);
           $('#writte-state').append(
             $(document.createElement("input")).attr("value", latlong).attr('name', 'map').attr('type', 'hidden').attr('class', 'map')
           );
           var mapht = '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + latitud + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;margin-top: 10px;max-height: 200px;max-width: 700px;width: 100%;" id="map-html"></iframe>';
           $('#location').append(mapht);
           $('#btn-location').removeAttr("disabled");
           $('#btn-location').html(Language.removelocation);
           $('#btn-location').removeClass('btn-info');
           $('#btn-location').addClass('btn-danger');
        }, function(error) {
                alert('Error occurred. Error code: ' + error.code);         
            },{timeout:5000});
      }else{
        alert("Your browser doesn't the location API");
      }
      $('#btn-location').attr('disabled', 'disabled');
      $('#btn-location').html(Language.locationloading);
    } else {
      $('#btn-location').html(Language.sharelocation);
      $('#btn-location').removeClass('btn-danger');
      $('#btn-location').addClass('btn-info');
      $('#map-html').remove();
      $('input.map').remove();
    }
});
}

function updatetimelinestates(type){
   if(!type || type == 'users'){
   	 $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/states.php",
       data: {"s": "friends", "key": keyuser},
       cache: false,
       dataType: 'json',
       beforeSend: function() {
       	 if($('.states .usersfriends').html() == ''){
           $('.states .usersfriends').append('<div id="loading-user" class="load-idsd"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
         }
       },
       success: function(result) {
       	 $('.usersfriends .load-idsd').remove();
       	 if (result.states) {
       	 	if (result.states.length == '0') {
              console.log('No states!');
              if ($('.states .usersfriends h3#nostates').length == '0') {
                $('.states .usersfriends').append("<div class='no-friends' id='nostates'><h4>"+Language.nostatesfriends+"</h4></div>");
              }
            }
            for (var i = 0; i < result.states.length; i++) {
              id = result.states[i].id;
              iduser = result.states[i].iduser;
              username = result.states[i].username;
              imagepr = result.states[i].imagepr;
              message = result.states[i].message;
              date = result.states[i].date;
              message = linkscom(message);
              if($('.states .usersfriends .li-chats#'+id).length == '0') {
              	$('.states .usersfriends').prepend("<li class='li-chats' id='"+id+"'><img src='"+imagepr+"' class='img' onclick='infouser("+iduser+")' style='cursor:pointer'/><span class='name'>"+username+"</span><span class='state'><p class='selecton'>"+message+"</p><p class='date'>"+convert(date)+"</p></span></li>");
                if(username == localStorage.getItem('user')){
                	$('.states .usersfriends .li-chats#'+id+' p.date').append('<a style="cursor:pointer;margin-left:2px;color:#999;font-weight:bold" onclick="deletestate('+id+')">'+Language.delete+'</a>');
                }
              }
            }
            $('.imagechat').attr('onclick', 'var urlimg = $(this).attr("alt");imagemod(urlimg)');
            $('.nolink').attr('onclick', 'var nw = require("nw.gui");linken = $(this).html();nw.Shell.openExternal(linken);');
       	 }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
    });
  }
  if(!type || type == 'groups'){
    $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/states.php",
       data: {"s": "groups", "key": keyuser},
       cache: false,
       dataType: 'json',
       beforeSend: function() {
       	 if($('.states .groupsstates').html() == ''){
           $('.states .groupsstates').append('<div id="loading-user" class="load-idsd"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
         }
       },
       success: function(result) {
       	 $('.groupsstates .load-idsd').remove();
       	 if (result.states) {
       	 	if (result.states.length == '0') {
              console.log('No states!');
              if ($('.states .groupsstates h3#nostates').length == '0') {
                $('.states .groupsstates').append("<div class='no-friends' id='nostates'><h4>"+Language.nostatesgroups+"</h4></div>");
              }
            }
            for (var i = 0; i < result.states.length; i++) {
              id = result.states[i].id;
              idgroup = result.states[i].idgroup;
              namegr = result.states[i].username;
              imagepr = result.states[i].imagepr;
              officiald = result.states[i].official;
              message = result.states[i].message;
              date = result.states[i].date;
              meadmin = result.states[i].meadmin;
              message = linkscom(message);
              if(imagepr){
                 imageprr = "<img src='"+imagepr+"' class='img' onclick='infogroup("+idgroup+")' style='cursor:pointer'/>";
              }else{
                 var namesplit = namegr.split(' ');
                 abv1 = namesplit[0].charAt(0);
                 if (namesplit[1]) {
                   abv2 = namesplit[1].charAt(0);
                   abv = abv1 + abv2;
                 }else{
                   abv = abv1;
                 }
                 imageprr = '<div class="img" style="background-color:#777;cursor:pointer" onclick="infogroup('+idgroup+')"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>';
              }
              if(officiald == 'yes'){
              	namegr = namegr + '<span class="icon ok"></span>';
              }
              if($('.states .groupsstates .li-chats#'+id).length == '0') {
              	$('.states .groupsstates').prepend("<li class='li-chats' id='"+id+"'>"+imageprr+"<span class='name'>"+namegr+"</span><span class='state'><p class='selecton'>"+message+"</p><p class='date'>"+convert(date)+"</p></span></li>");
                if(meadmin == 'yes'){
                	$('.states .groupsstates .li-chats#'+id+' p.date').append('<a style="cursor:pointer;margin-left:2px;color:#999;font-weight:bold" onclick="deletestategr('+id+')">'+Language.delete+'</a>');
                }
              }
            }
            $('.imagechat').attr('onclick', 'var urlimg = $(this).attr("alt");imagemod(urlimg)');
            $('.nolink').attr('onclick', 'var nw = require("nw.gui");linken = $(this).html();nw.Shell.openExternal(linken);');
       	 }
       }
    })
  }
}

function deletestate(id){
   $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/connect/delete-state.php",
       data: {"id": id, "key": keyuser},
       cache: false,
       dataType: 'json',
       success: function(result) {
       	 if(result.mensaje == 'ok'){
            $('.states .usersfriends .li-chats#'+id).remove();
       	 }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
   });
}


function deletestategr(id){
   $.ajax({
       type: "POST",
       crossDomain: true,
       url: "http://m2s.es/app/api/connect/delete-state-gr.php",
       data: {"id": id, "key": keyuser},
       cache: false,
       dataType: 'json',
       success: function(data) {
       	 if(data.mensaje == 'ok'){
            $('.states .groupsstates .li-chats#'+id).remove();
       	 }else{
          console.log('Error: '+data.mensaje);
         }
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.error(textStatus + ' ' + XMLHttpRequest.status);
       }
   });
}

function poststick(text) {
  $('.share-moreapp').hide();
  sendstate('<div class="'+text+'"></div>', '');
}

function sendmsm() {
  var txtvalue = document.getElementsByName('txt')[0].value;
  if (document.getElementsByName('map')[0]) {
    var mapv = document.getElementsByName('map')[0].value;
  } else {
    var mapv = "";
  }
  sendstate(txtvalue, mapv);
}

function sendstate(text, map){
   $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/write-state.php",
      data: {"txt": text, "map": map, "key": keyuser},
      cache: false,
      dataType: 'json',
      beforeSend: function() {
        console.log('Connecting...');
      },
      success: function(writers) {
      	if(writers.mensaje == 'ok'){
      		document.getElementsByName('txt')[0].value = '';
            $('#list-friends').show();
            $('#writte-state').hide();
            updatetimelinestates('users');
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}

function fileOnload(e) {
  var $img = $('<img>', {
    src: e.target.result
  });
  var canvas = $('#canvas')[0];
  $('#file-input').val('');
  $img.load(function() {
    canvas.width = this.width;
    canvas.height = this.height;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(this, 0, 0, this.width, this.height);
  });
  $('#upload-imge').show();
  $('#share-mre').hide();
  $('.selct-shareop').hide();
  $('.sections-share').hide();
  $('.imageuplo').show();
}