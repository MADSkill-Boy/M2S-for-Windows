var keyuser = localStorage.getItem('keyuser');
var id = getGET().id;
var win = gui.Window.get();

function pagefunctions(){
$.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/groupinfo.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    success: function (result) {
        id = result.id;
        name = result.groupname;
        image = result.imagein;
        private = result.private;
        admininfo = result.admininfo;
        official = result.official;
        local = result.local;
        decription = result.description;
        peoplejoin = result.peoplejoined;
        mutegroup = result.mute;
        $('.app-title').append(name);
        win.title = 'M2S: '+Language.admingroup+' '+ name;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
    }
});


$('.tributtons #state-gr').click(function(){
	if($('.tributtons #state-gr.active').length == '0'){
        $('.content-trib div.dvb').hide();
        $('.content-trib .state-gr').show();
        $('.tributtons .active').removeClass('active');
        $('.tributtons #state-gr').addClass('active')
	}
});

$('.tributtons #blockpe-gr').click(function(){
	if($('.tributtons #blockpe-gr.active').length == '0'){
        $('.content-trib div.dvb').hide();
        $('.content-trib .blockpe-gr').show();
        $('.tributtons .active').removeClass('active');
        $('.tributtons #blockpe-gr').addClass('active')
	}
});

$('.tributtons #edit-gr').click(function(){
	if($('.tributtons #edit-gr.active').length == '0'){
        $('.content-trib div.dvb').hide();
        $('.content-trib .edit-gr').show();
        $('.tributtons .active').removeClass('active');
        $('.tributtons #edit-gr').addClass('active')
	}
});

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

$('.send-state').click(function(){
    sendmsm();
})

$('.blockuser-buttond').click(function(){
    var nameuserblock = $('.nameuserblock').val();
    vex.dialog.confirm({
         message: Language.blockusergrsu1+nameuserblock+Language.blockusergrsu2,
         callback: function(value) {
            if(value == true){
               $.ajax({
                 type: "POST",
                 crossDomain: true,
                 url: "http://m2s.es/app/api/connect/blockpjg.php",
                 data: {"id": id, "nameuser": nameuserblock, "key": keyuser},
                 cache: false,
                 dataType: 'json',
                 success: function(result) {
                    if(result.mensaje == 'ok'){
                        loadblockuserslist();
                        $('.nameuserblock').val('');
                    }
                 },
                 error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.error(textStatus + ' ' + XMLHttpRequest.status);
                    errormod("Error");
                 }
               })
            }
         }
    })
})

loadblockuserslist();

$.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/groupinfo.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    success: function (result) {
       descriptiongroup = result.description;
       locationgroup = result.local;
       privategroup = result.private;
       namegroupd = result.groupname;
       showcreatorgroup = result.showcreator;
       $('.namegroup-input').val(namegroupd);
       $('.decription-input').val(descriptiongroup);
       if(privategroup == 'yes'){
         $('.private-input').attr('checked','checked');
       }
       if(showcreatorgroup == 'yes'){
         $('.showcreator-input').attr('checked','checked');
       }
       if(locationgroup.latitude){
         $('.locationinfo-button').html(Language.removelocation);
         $('.locationinfo-button').attr('onclick', 'quitlocationgroup()');
       }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
    }
});

$('.savechanges-button').click(function(){
    if ($('.namegroup-input').val() != '') {
    if ($('.decription-input').val() != '') {
    if(namegroupd == $('.namegroup-input').val()){
        newnamegroupd = '';
    }else{
        newnamegroupd = $('.namegroup-input').val();
    }
    if(descriptiongroup == $('.decription-input').val()){
        newdescriptiongroup = '';
    }else{
        newdescriptiongroup = $('.decription-input').val();
    }
    if(showcreatorgroup == 'yes' && $('.showcreator-input').is(':checked') || showcreatorgroup == 'no' && !$('.showcreator-input').is(":checked")){
        newshowcreator = '';
    }else{
        if($('.showcreator-input').is(':checked')){
           newshowcreator = 'yes'; 
        }else{
           newshowcreator = 'no'; 
        }
    }
    if(privategroup == 'yes' && $('.private-input').is(':checked') || privategroup == 'no' && !$('.private-input').is(":checked")){
        newprivategroup = '';
    }else{
        if($('.private-input').is(':checked')){
           newprivategroup = 'yes'; 
        }else{
           newprivategroup = 'no'; 
        }
    }
    newlocationgroup = $('.mapgroups').val();
    if(newlocationgroup == '' && locationgroup.latitude != null){
       newlocationgroup = 'quit';
    }
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/editgroup.php",
      data: {
        'id': id,
        'name': newnamegroupd,
        'description': newdescriptiongroup,
        'location': newlocationgroup,
        'private': newprivategroup,
        'showcreator': newshowcreator
      },
      cache: false,
      dataType: 'json',
      success: function(data) {
         if (data.mensaje == 'ok') {
            infomod(Language.changesaved);
         }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
    })
}}
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
      url: "http://m2s.es/app/api/connect/write-state-group.php",
      data: {"txt": text, "map": map, "id": id, "key": keyuser},
      cache: false,
      dataType: 'json',
      beforeSend: function() {
        console.log('Connecting...');
      },
      success: function(writers) {
        if(writers.mensaje == 'ok'){
            document.getElementsByName('txt')[0].value = '';
            infomod(Language.statesendok);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
   })
}

function loadblockuserslist(){
    $('.userblocklist').html('<div id="loading-user" style="top:50px" id="load-idsd"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
    $.ajax({
        type: "POST",
        crossDomain: true,
        url: "http://m2s.es/app/api/blockgroupuserblock.php",
        data: {"id": id, "key": keyuser},
        cache: false,
        dataType: 'json',
        success: function(result) {
            if(result.mensaje){
               if(result.mensaje == 'noblockusers'){
                  $('.userblocklist').html("<p>"+Language.noblockugr+"</p>");
               }
            }else{
                if(result.list){
                  $('.userblocklist').html('');
                  for (var i = 0; i < result.list.length; i++) {
                    idg = result.list[i].id;
                    username = result.list[i].name;
                    imageprofile = result.list[i].imagepr;
                    $('.userblocklist').append('<div class="userblockgrouplist" id="'+idg+'"><img src="'+imageprofile+'"/><div class="left-jk"><b>'+username+'</b> <button onclick="unblockgr('+idg+')">'+Language.unblock+'</button> <span onclick="infouser('+idg+')">'+Language.viewhisprofile+'</span> </div></div>');
                  }
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus + ' ' + XMLHttpRequest.status);
            errormod(Language.errorpetitionm2s);
        }
    })
}

function unblockgr(idus){
    $('.userblockgrouplist#'+idus+' button').attr('disabled', 'disabled');
    $.ajax({
        type: "POST",
        crossDomain: true,
        url: "http://m2s.es/app/api/connect/acceptpjg.php",
        data: {"id": id, "iduser": idus, "key": keyuser},
        cache: false,
        dataType: 'json',
        success: function(result) {
           if(result.mensaje == 'ok'){
             $('.userblockgrouplist#'+idus).remove();
             if($('.userblockgrouplist').length == '0'){
                $('.userblocklist').html("<p>"+Language.noblockugr+"</p>");
             }
           }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus + ' ' + XMLHttpRequest.status);
            errormod(Language.errorpetitionm2s);
        }
    })
}

function quitlocationgroup(){
    if($('.mapgroups').length == '0'){
        $('.edit-gr').append($(document.createElement("input")).attr("value", "quit").attr('name', 'mapf').attr('type', 'hidden').attr('class', 'mapgroups'));
    }else{
        $('.edit-gr').append($(document.createElement("input")).attr("value", "").attr('name', 'mapf').attr('type', 'hidden').attr('class', 'mapgroups'));
    }
    $('.locationinfo-button').attr('onclick', 'sharelocationgroup()');
    $('.locationinfo-button').html(Language.sharelocation);
}

function sharelocationgroup(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log('Loading location...');
            var latitudgr = position.coords.latitude;
            var longitudgr = position.coords.longitude;
            var newlocationgroup = latitudgr + ' ' + longitudgr;
            if($('.mapgroups').length == '0'){
               $('.edit-gr').append($(document.createElement("input")).attr("value", newlocationgroup).attr('name', 'mapf').attr('type', 'hidden').attr('class', 'mapgroups'));
            }else{
               $('.mapgroups').val(newlocationgroup);
            }
            $('.locationinfo-button').html(Language.removelocation);
            $('.locationinfo-button').attr('onclick', 'quitlocationgroup()');
        }, function(error) {
            alert('Error occurred. Error code: ' + error.code);         
        },{timeout:5000});
    }else{
        alert("Your browser doesn't the location API");
    }
}