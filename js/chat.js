var keyuser = localStorage.getItem('keyuser');

var id = getGET().id;
var win = gui.Window.get();

function pagefunctions(){
$(window).unload(function() {
  localStorage.removeItem("ChatOpened"+id);
})

if(!localStorage.getItem('imguse')){
       imageinme = "images/icon-user-default.png";
}else{
       imageinme = localStorage.getItem('imguse');
}
    
$.ajax({
  type: "POST",
  crossDomain: true,
  url: "http://m2s.es/app/api/profileinfo.php",
  data: {"id": id, "key": keyuser},
  cache: false,
  dataType: 'json',
  success: function(data) {
  	var username = data.username;
  	var timeago = data.timeago;
  	if(timeago.indexOf("con")>=0){
	  	timeago = Language.connected;
  	}else{
	  	if(timeago.indexOf("m")>=0){
	  		timeago = timeago.replace('m','');
	  		timeago = Language.minago+' '+timeago+' '+Language.minagoc;
	  	}
	  	
	  	if(timeago.indexOf("d")>=0){
		  	timeago = timeago.replace('d','');
	  		timeago = Language.daysago+' '+timeago+' '+Language.daysagoc;
		}
		
		if(timeago.indexOf("h")>=0){
		  	timeago = timeago.replace('h','');
	  		timeago = Language.hoursago+' '+timeago+' '+Language.hoursagoc;
		}
  	}
  	var email = data.email;
  	imagein = data.imagein;
  	if(imagein == null){
       imagein = '/images/icon-user-default.png';
       $('.mod-infouser img').attr('src', imagein);
    }else{
	    imagein = imagein;
	    $('.mod-infouser img').attr('src', imagein);
    }
  	$('.mod-infouser h4').html(username);
    win.title = 'M2S: '+Language.chatwith+' '+ username;
  	$('.mod-infouser .user-text span').html(timeago);
  	chat(id);

  	var chatrefresh = setInterval(function() {
  		updatechats(id);
	}, 14000);
  }
});

$('#userinfobut').click(function(){
    infouser(id)
});

$('#deleteconservationbut').click(function(){
    vex.dialog.confirm({
        message: Language.deleteconversu,
        callback: function(value) {
            if(value == true){
                localStorage.removeItem("c"+id);
                localStorage.removeItem('lastmsmc-' + id);
				localStorage.removeItem('lastmsmcd-' + id);
                $('.' + 'chat-messages .center').html('<div class="center-align nochat"><h3><span class="icon comments-alt"></span>'+Language.nomessageschat+'</h3></div>');
            }
        }
    })
});

$('#blockuserbut').click(function(){
    vex.dialog.confirm({
        message: Language.blockfriendsu,
        callback: function(value) {
            if(value == true){
                blockuser(id);
            }
        }
    })
});

$('#deletefriendbut').click(function(){
    vex.dialog.confirm({
        message: Language.removefriend,
        callback: function(value) {
            if(value == true){
                deletefriend(id);
            }
        }
    })
});

$('.share-more').click(function(){
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
        $('input[name="txt"]').val($('input[name="txt"]').val() + ' ' + link);
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
           $('footer').append(
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

$('.bargroup-emo span').click(function(){
  name = $(this).attr('class');
  $('.icon-group').hide();
  $('.icon-group#'+name).show();
})

$('.mod-infouser span.icon.chevron-down').click(function(){
  if(!$('.menu-optionchat').is(":visible")){
      $('.menu-optionchat').show();
  }
})
var menuoptionchatleft = $('.mod-infouser span.icon.chevron-down').position().left;
$('.menu-optionchat').css('left',menuoptionchatleft - 30);
$(window).resize(function() {
  var menuoptionchatleft = $('.mod-infouser span.icon.chevron-down').position().left;
  $('.menu-optionchat').css('left',menuoptionchatleft - 60);
});

$('.menu-optionchat li').click(function(){
   $('.menu-optionchat').hide();
});

$('.menu-optionchat li').hover(function(){
  $(this).css('background-color', '#1A83FA');
  $(this).css('color', '#fff');
  $('span', this).css('color', '#fff');
}, function() {
    $(this).css('background-color', 'none');
    $(this).css('color', '#555');
    $('span', this).css('color', '#555');
  });


$(document).mouseup(function (e){
    var container = $('.menu-optionchat');
    if (!container.is(e.target) && container.has(e.target).length === 0){
        container.hide();
    }
});
}

function updatechats(id) {
  console.log('Checking new messages...');
  $.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/chat.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    success: function(data) {
      for (var i = 0; i < data.messages.length; i++) {
        if ($('.nochat').lenght != '0') {
          $('.nochat').remove();
        }
        id = data.messages[i].id;
        username = data.messages[i].username;
        iduser = data.messages[i].iduser;
        imgr = data.messages[i].imgr;
        textmsm = data.messages[i].textmsm;
        locat = data.messages[i].locat;
        fecha = data.messages[i].fecha;
        me = data.messages[i].me;
        stick = data.messages[i].stick;
        tableid = data.messages[i].tableid;
        if(data.messages[i].mymessagenor){
          mymessagenor = 'yes';
        }else{
          mymessagenor = 'no';
        }
        if ($('#' + id).length != '0') {
          if(!data.messages[i].mymessagenor){
             $('#' + id + ' .foot .tick').remove();
             console.log(id+': nohas');
          }
        } else {
          var localid = "c" + tableid;
          var messages = new Object();
          messages.id = id;
          messages.username = username;
          messages.iduser = iduser;
          messages.textmsm = textmsm;
          messages.imgr = imgr;
          messages.locat = locat;
          messages.fecha = fecha;
          messages.me = me;
          messages.stick = stick;
          messages.tableid = tableid;
          if(data.myid != iduser || mymessagenor == 'yes'){
            if (!localStorage.getItem(localid)) {
              localStorage.setItem(localid, "[" + JSON.stringify(messages) + "]");
            }else{
              var antes = JSON.parse(localStorage.getItem(localid));
              antes.push(messages);
              localStorage.setItem(localid, JSON.stringify(antes));
            }
            datosmem = crearmsmd(id, username, iduser, imgr, textmsm, locat, fecha, me, stick, tableid, 'NO');
            $('.' + 'chat-messages .center').append(datosmem);
            if(stick != '1'){
              localStorage.setItem('lastmsmc-'+tableid, textmsm);
            }else{
              localStorage.setItem('lastmsmc-'+tableid, '[stick]');
            }
            localStorage.setItem('lastmsmcd-'+tableid, fecha);
            var d = $('.conversation');
            d.scrollTop(d.prop("scrollHeight"));
            $('#audio_fb')[0].play();
          }
        }
      }
      if($('.chat-messages .center').html() == ''){
        $('.' + 'chat-messages .center').html('<div class="center-align nochat"><h3><span class="icon comments-alt"></span>'+Language.nomessageschat+'</h3></div>'); 
      }
      $('.imagechat').attr('onclick', 'var urlimg = $(this).attr("alt");imagemod(urlimg)');
      $('.nolink').attr('onclick', 'var nw = require("nw.gui");linken = $(this).html();nw.Shell.openExternal(linken);');
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.error(textStatus + ' ' + XMLHttpRequest.status);
      var divno = document.createElement('div');
      divno.innerHTML = '<div id="list-notifications" style="text-align:center;cursor:pointer"></div>';
      divno.className = 'background-dark';
      var modsv = document.getElementById('modsv');
      modsv.appendChild(divno);
      $('#list-notifications').append(Language.errorpetitionm2s);
      $('#list-notifications').click(function() {
        window.location.reload();
      })
    }
  });
}

function crearmsmd(id, username, iduser, imgr, textmsm, locat, fecha, me, stick, tableid, leido) {
  if (me == '1') {
    if (stick == '1') {
      msm = '<div id="' + id + '" class="sms stick me">';
    } else {
      msm = '<div class="sms me" id="' + id + '">';
    }
    msm += '<a href="javascript:deletemessage(' + id + ',' + tableid + ',1)" class="trash" style="text-decoration:none;color:#777777;float:right;display:none;line-height: 50px;width: 50px;font-size:26px;text-align:center"><span class="icon trash"></span></a>';
    msm += '<img src="' + imageinme + '" class="imgp" style="right:0px;"/>';
    if (stick == '1') {
      msm += '<blockquote style="position:relative;top:-15px;margin-bottom: -7px;">';
    } else {
      msm += '<blockquote>'
    }
    if (stick == '1') {
      msm += '<div class="' + textmsm + '"></div>';
    } else {
      msm += '<p class="selecton">' + linkscom(textmsm) + '</p>';
    }
    if (locat.latitude != null) {
      longitud = locat.longitud;
      longitud = longitud.substring(0, longitud.length - 2);
      msm += '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locat.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
    }
    msm += '<div class="foot">';
    if (leido != 'NO') {
      msm += '<span class="tick">✓</span>';
    }
    msm += convert(fecha) + ' ';
    msm += '</div></div></blockquote>'
  } else {
    if (stick == '1') {
      msm = '<div id="' + id + '" class="sms stick">';
    } else {
      msm = '<div id="' + id + '" class="sms">';
    }
    if(typeof imagein == 'undefined'){
       imagein = 'images/icon-user-default.png';
    }
    msm += '<a href="javascript:deletemessage(' + id + ',' + tableid + ',0)" class="trash" style="text-decoration:none;color:#777777;float:right;display:none;line-height: 50px;width: 50px;font-size:26px;text-align:center"><span class="icon trash"></span></a>';
    msm += '<a href="#" onclick="infouser(' + iduser + ')">';
    msm += '<img src="' + imagein + '" class="imgp"/></a>';
    if (stick == '1') {
      msm += '<blockquote style="position:relative;top:-15px;margin-bottom: -7px;">';
    } else {
      msm += '<blockquote>'
    }
    if (stick == '1') {
      msm += '<div class="' + textmsm + '"></div>';
    } else {
      msm += '<p class="selecton">' + linkscom(textmsm) + '</p>';
    }
    if (locat.latitude != null) {
      longitud = locat.longitud;
      longitud = longitud.substring(0, longitud.length - 2);
      msm += '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locat.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
    }
    msm += '<div class="foot">';
    msm += convert(fecha);
    msm += '</div></div></blockquote>'
  }
  if (me == '1') {
    $$('#' + id).swipeLeft(function() {
      $('#' + id + ' .trash').css('display', 'block');
      if (stick == '1') {
        $('#' + id + ' blockquote').css('left', '-245px');
      } else {
        $('#' + id + ' blockquote').css('margin-right', '140px');
      }
      $('#' + id + ' img').css('position', 'relative');
      $('#' + id + ' img').css('right', '20px');
      console.log('swipe!');
    });
    $$('#' + id).swipeRight(function() {
      $('#' + id + ' .trash').css('display', 'none');
      if (stick == '1') {
        $('#' + id + ' blockquote').css('left', '-180px');
      } else {
        $('#' + id + ' blockquote').removeAttr('style');
      }
      $('#' + id + ' img').removeAttr('style');
    });
  } else {
    $$('#' + id).swipeLeft(function() {
      $('#' + id + ' .trash').css('display', 'block');
      if (stick == '1') {} else {
        $('#' + id + ' blockquote').css('margin-right', '70px');
      }
      console.log('swipe!');
    });
    $$('#' + id).swipeRight(function() {
      $('#' + id + ' .trash').css('display', 'none');
      if (stick == '1') {} else {
        $('#' + id + ' blockquote').removeAttr('style');
      }
    });
  }
  return msm;
  var d = $('.conversation');
  d.scrollTop(d.prop("scrollHeight"));
}

function loadchat(id, type) {
  $('.' + 'chat-messages .center').html('');
  if (localidsf != '') {
    var localidsf = JSON.parse(localStorage.getItem('c' + id));
  }
  if (localidsf) {
    for (var i = 0; i < localidsf.length; i++) {
      idc = localidsf[i].id;
      username = localidsf[i].username;
      iduser = localidsf[i].iduser;
      imgr = localidsf[i].imgr;
      textmsm = localidsf[i].textmsm;
      locat = localidsf[i].locat;
      fecha = localidsf[i].fecha;
      me = localidsf[i].me;
      stick = localidsf[i].stick;
      tableid = localidsf[i].tableid;
      datosmem = crearmsmd(idc, username, iduser, imgr, textmsm, locat, fecha, me, stick, tableid, 'YES');
      $('.' + 'chat-messages .center').append(datosmem);
    }
  }
  updatechats(id);
  var d = $('.conversation');
  d.scrollTop(d.prop("scrollHeight"));
  if (!localStorage.getItem('c' + id)) {
    $('.' + 'chat-messages .center').html('<div class="center-align nochat"><h3><span class="icon comments-alt"></span>'+Language.nomessageschat+'</h3></div>');
  }else{
    if($('.chat-messages .center').html() == ''){
      localStorage.removeItem('c' + id);
      $('.' + 'chat-messages .center').html('<div class="center-align nochat"><h3><span class="icon comments-alt"></span>'+Language.nomessageschat+'</h3></div>');
    }
  }
}

function chat(id) {
  id = id.toString();
  $('.li-chats').removeClass("active");
  $('#list-' + id).addClass("active");
  $('.chat-messages').html('<div class="center"><div id="loading-user"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div></div>');
  if ($('.input-chat').length) {
    $('.input-chat').remove();
  }
  $("input[name='txt']").keypress(function(event) {
    if (event.keyCode == 13) {
      if (!event.shiftKey) sendmsm()
    }
  });
  $(".button-send").click(function(){
    sendmsm();
  })
  loadchat(id, 'pr');
}

function deletemessage(id, tableid, med) {
  id = id.toString();
  tableid = tableid.toString();
  tabledf = JSON.parse(localStorage.getItem('c' + tableid));
  Array.prototype.removeValue = function(name, value) {
    var array = $.map(this, function(v, i) {
      return v[name] === value ? null : v;
    });
    this.length = 0; //clear original array
    this.push.apply(this, array); //push all elements except the one we want to delete
  }
  tabledf.removeValue('id', id);
  localStorage.setItem('c' + tableid, JSON.stringify(tabledf));
  if (med == 1) {
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/delete-message.php",
      data: {"id": id, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(data) {
        if (data.mensaje == 'ok') {
          console.log('Message deleted succesfully');
          $('#' + id).fadeOut(1000, function() {
            $('#' + id).remove();
          })
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
    });
  } else {
    console.log('Message deleted succesfully');
    $('#' + id).fadeOut(1000, function() {
      $('#' + id).remove();
    })
  }
  if(localStorage.getItem('c' + tableid) == '[]'){
    localStorage.removeItem('c' + tableid);
    localStorage.removeItem('lastmsmc-' + tableid);
    localStorage.removeItem('lastmsmcd-' + tableid);
    $('.' + 'chat-messages .center').html('<div class="center-align nochat"><h3><span class="icon comments-alt"></span>'+Language.nomessageschat+'</h3></div>');
  }else{
    var json = JSON.parse(localStorage.getItem('c' + tableid));
    var lend = json.length;
    var lastKey = json[lend-1];
    if(lastKey.stick != '1'){
        localStorage.setItem('lastmsmc-'+tableid, lastKey.textmsm);
    }else{
        localStorage.setItem('lastmsmc-'+tableid, '[stick]');
    }
    localStorage.setItem('lastmsmcd-'+tableid, lastKey.fecha);
  }
}

function poststick(text) {
  $('.share-moreapp').hide();
  sendchat(text, '');
}

function sendmsm() {
  var txtvalue = document.getElementsByName('txt')[0].value;
  if (document.getElementsByName('map')[0]) {
    var mapv = document.getElementsByName('map')[0].value;
  } else {
    var mapv = "";
  }
  sendchat(txtvalue, mapv);
}

function sendchat(text, map) {
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/chat.php",
      data: {"txt": text, "map": map, "id": id, "key": keyuser},
      cache: false,
      dataType: 'json',
      beforeSend: function() {
        console.log('Connecting...');
        $('input[name="txt"]').val(Language.sending);
        $('input[name="txt"]').attr('disabled', 'disabled');
      },
      complete: function() {
        console.log('Completed');
        document.getElementsByName('txt')[0].value = '';
        $('input[name="txt"]').removeAttr('disabled');
        updatechats(id, 'prs');
      },
      success: function(result) {
        console.log(result.mensaje);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod("Error");
      }
    })
};

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