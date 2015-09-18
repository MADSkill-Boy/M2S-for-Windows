   if (!localStorage.getItem('user')) {
       window.location.href = "login.html"
   }
   var user = localStorage.getItem('user');
   var passmd5 = localStorage.getItem('passwd');
   var keyuser = localStorage.getItem('keyuser');

   navigator.geolocation = {};
   navigator.geolocation.getCurrentPosition = function(callback) {
    $.get('https://maps.googleapis.com/maps/api/browserlocation/json?browser=chromium&sensor=true', function(data) { 
        var position = {
            coords : {
                latitude : data.location.lat,
                longitude : data.location.lng
            }
        };
        callback(position);
    });
  };
   function datahours() {
       var now = new Date();
       var hour = 60 * 60 * 1000;
       var min = 60 * 1000;
       var madrid = new Date(now.getTime() + (now.getTimezoneOffset() * min) + ('1' * hour)).getHours();
       var d = new Date();
       var local = d.getHours();
       var diference = madrid - local;
       if (diference < '0') {
           var diferencenew = diference *= -1;
       } else {
           if (diference != '0') {
               var diferencenew = '-' + diference;
           } else {
               var diferencenew = '0';
           }
       }
       if (localStorage) {
           localStorage.setItem("datehours", diferencenew);
       }
   }


   function convert(data) {
       if (localStorage.getItem('datehours')) {
           var diferenced = parseInt(localStorage.getItem('datehours'));
       } else {
           if (localStorage) {
               datahours();
               var diferenced = parseInt(localStorage.getItem('datehours'));
           } else {
               datahours();
               var diferenced = parseInt(diferencenew);
           }
       }
       t = data.split(' ');
       r = new Object;
       r.dia = t[0].substr(8, 2);
       r.mes = t[0].substr(5, 2);
       r.ano = t[0].substr(0, 4);
       r.hora = parseInt(t[1].substr(0, 2));
       r.minutos = t[1].substr(3, 2);
       d = new Date(r.ano, r.mes, r.dia, r.hora + diferenced, r.minutos);
       resdia = ("0" + d.getDate()).slice(-2);
       resmes = ("0" + d.getMonth()).slice(-2);
       resano = d.getFullYear();
       reshora = ("0" + d.getHours()).slice(-2);
       resminutos = ("0" + d.getMinutes()).slice(-2);
       ret = resdia + "/" + resmes + "/" + resano + " "+Language.at+" " + reshora + ":" + resminutos;
       return ret;
   };

   function linkscom(textdf) {
       var str = textdf;
       var exp = /((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?=([^"']*["'][^"']*["'])*[^"']*$)/ig;
       var exp2 = /((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]+\.(?:jpe?g|gif|png))(?=([^"']*["'][^"']*["'])*[^"']*$)/ig;
       var exp3 = /(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/ig;
       var instag = /(?:http:\/\/)?(?:www\.)?(?:instagram\.com)\/(?:p)\/?(.+)\/(?:([^"']*["'][^"']*["'])*[^"']*$)/ig;
       var images = str.replace(exp2, "<div class='imagechat "+langdefault+"' style='background-image:url($1)' alt='$1'></div>");
       var youtube = images.replace(exp3, "<div id='maxwidthyo'><div class='videoWrapper'><iframe frameborder='0' allowfullscreen src='http://www.youtube.com/embed/$1'/></div></div>");
       var linksd = youtube.replace(instag, "<style>.embed-container {position: relative; padding-bottom: 110%; height: 0; overflow: hidden;} .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container' ><iframe src='http://instagram.com/p/$1/embed/' frameborder='0' scrolling='no' allowtransparency='true'></iframe></div>");
       var links = linksd.replace(exp, "<a href='#' class='nolink'>$1</a>");
       return links
   }

   function chatlink(id) {
     id = id.toString();
     if(localStorage.getItem('ChatOpened'+id) == '0'){}else{
       localStorage.setItem('ChatOpened'+id, '0');
       eval("var chatsw" + id + " = gui.Window.open('chat.html?id='+id, {position: 'center',title: 'M2S: Chat',min_width: 600,min_height: 500,width: 600,height: 500,toolbar:false,frame:false,transparent: true})");
       if($('#list-'+id+' .right-info font')){
        $('#list-'+id+' .right-info font').remove();
       }
       if($('.background-dark')){
         $('.chmsmb-'+id).remove();
         if($('#list-notifications').html() == ''){
           $('.background-dark').remove();
           $('.notifications-alert').remove();
         }
       }
     }
   }

   function chatgrlink(id) {
     id = id.toString();
     if(localStorage.getItem('ChatgrOpened'+id) == '0'){}else{
       localStorage.setItem('ChatgrOpened'+id, '0');
        eval("var chatgrsw" + id + " = gui.Window.open('chatgr.html?id='+id, {position: 'center',title: 'M2S: Chat',min_width: 600,min_height: 500,width: 600,height: 500,toolbar:false,frame:false,transparent: true})");
     }
     if($('.background-dark')){
       $('.chgrmsmb-'+id).remove();
       if($('#list-notifications').html() == ''){
          $('.background-dark').remove();
          $('.notifications-alert').remove();
       }
     }
   }

   function acceptgrj(idgroup, id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/acceptpjg.php",
           data: {"id": idgroup, "iduser": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#acceptpeogroup-' + id).attr('disabled', true);
               $('#acceptpeogroup-' + id).html(Language.loading)
           },
           success: function (result) {
               if (result.mensaje == 'ok') {
                   setInterval(function () {
                       $('#fgr-' + id).fadeOut(500, function () {
                           $('#fgr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                   }, 3000);
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   }

   function blockgrj(idgroup, id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/blockpjg.php",
           data: {"id": idgroup, "iduser": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#blockpeogroup-' + id).attr('disabled', true);
               $('#blockpeogroup-' + id).html(Language.loading)
           },
           success: function (result) {
               if (result.mensaje == 'ok') {
                   setInterval(function () {
                       $('#fgr-' + id).fadeOut(500, function () {
                           $('#fgr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                   }, 3000);
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   }

   function acceptfriend(id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/acceptfriend.php",
           data: {"id": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#acceptfriend-' + id).attr('disabled', true);
               $('#acceptfriend-' + id).html(Language.loading)
           },
           success: function (result) {
               if (result.mensaje == 'ok') {
                   setInterval(function () {
                       $('#fr-' + id).fadeOut(500, function () {
                           $('#fr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                       if (document.location.pathname.indexOf("index.html") != 0) {
                           document.location.href = 'index.html';
                       }
                   }, 3000);
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   };

   function blockuser(id) {
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/connect/blockuser.php",
           data: {"recid2": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           beforeSend: function () {
               console.log('Connecting...');
               $('#blockuser-' + id).attr('disabled', true);
               $('#blockuser-' + id).html(Language.loading)
           },
           success: function (result) {
               console.log(result.mensaje);
               if (result.mensaje == 'ok') {
                  if($('#closenotifications')){
                   setInterval(function () {
                       $('#fr-' + id).fadeOut(500, function () {
                           $('#fr-' + id).remove();
                       })
                       if ($('#list-notifications .item').length == '0') {
                           $('.background-dark').remove();
                       }
                   }, 3000);
                  }else{
                    var pathname = window.location.pathname;
                    if(pathname == '/chat.html'){
                      var win = gui.Window.get();
                      win.close()
                    }
                  }
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               if ($('#list-notifications .item').length == '0') {
                   $('.background-dark').remove();
               }
               errormod(Language.errorpetitionm2s);
           }
       })
   };
   function deletefriend(id){
      $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/connect/deletefriend.php",
          data: {"id": id, "key": keyuser},
          cache: false,
          dataType: 'json',
          beforeSend: function () {
              console.log('Connecting to delete friend...');
          },
          success: function (result) {
              if (result.mensaje == 'ok') {
                  infomod(Language.succesdeletefriend);
                  var pathname = window.location.pathname;
                  if(pathname == '/myfriends.html'){
                     $('#list-'+id).remove();
                  }
                  if(pathname == '/chat.html'){
                    var win = gui.Window.get();
                    win.close()
                  }
                  if(pathname == '/prfmod.html'){
                    document.location.href= 'prfmod.html?id='+id;
                  }
              }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
              console.error(textStatus + ' ' + XMLHttpRequest.status);
              errormod(Language.errorpetitionm2s);
          }
      })
   }
   function notifications() {
       console.log('Checking notifications...');
       $.ajax({
           type: "POST",
           crossDomain: true,
           url: 'http://m2s.es/app/api/notifications.php',
           data: {"key": keyuser},
           cache: false,
           dataType: 'json',
           success: function (result) {
               if (result.listnotify != null) {
                   function litsnotify() {
                       if($('.background-dark').length != '0'){
                         $('.background-dark').remove();
                       }
                       var divno = document.createElement('div');
                       divno.innerHTML = '<span class="icon remove" id="closenotifications"></span><div id="list-notifications"></div>';
                       divno.className = 'background-dark';
                       var modsv = document.getElementById('modsv');
                       modsv.appendChild(divno);
                       for (var i = 0; i < result.listnotify.length; i++) {
                           id = result.listnotify[i].id;
                           username = result.listnotify[i].username;
                           imgp = result.listnotify[i].imgp;
                           if(imgp == null){
						   		imgp = 'images/icon-user-default.png';
			        	   }
                           type = result.listnotify[i].type;
                           if (type == 'friend-request') {
                               itemlist = '<div class="item" id="fr-' + id + '">';
                           } else {
                               if (type == 'addgroup-request') {
                                   itemlist = '<div class="item" id="fgr-' + id + '">';
                               } else {
                                   if(type == 'message'){
                                     itemlist = '<div class="item chmsmb-' + id + '">';
                                   }else{
                                     if(type == 'message-group'){
                                       itemlist = '<div class="item chgrmsmb-' + id + '">';
                                     }else{
                                       itemlist = '<div class="item">';
                                     }
                                 }
                               }
                           }
                           itemlist += '<img src="' + imgp + '"/>';
                           itemlist += '<div class="right-img">';
                           itemlist += '<span>' + username + '</span>';
                           if (type == 'friend-request') {
                               itemlist += ' '+Language.wantsyourfriend;
                               itemlist += '<button id="acceptfriend-' + id + '" class="btn btn-lg btn-info" onclick="acceptfriend(' + id + ')">'+Language.accept+'</button>';
                               itemlist += '<button id="blockuser-' + id + '"  class="btn btn-lg btn-danger" onclick="blockuser(' + id + ')">'+Language.block+'</button>';
                           };
                           if (type == 'message') {
                               msm = result.listnotify[i].msm;
                               itemlist += ' '+Language.saidyou+': ' + msm;
                               var url = 'javascript:chatlink(' + id +')';
                               itemlist += '<a href="' + url + '" id="close-click"><button class="btn btn-lg btn-info">'+Language.read+'</button></a>';
                           };
                           if (type == 'message-group') {
                               msm = result.listnotify[i].msm;
                               namegroup = result.listnotify[i].namegroup;
                               itemlist += ' '+Language.saidingroup+' ' + namegroup + ': ' + msm;
                               itemlist += '<a href="javascript:chatgrlink(' + id + ')"><button class="btn btn-lg btn-info">'+Language.read+'</button></a>';
                           }
                           if (type == 'addgroup-request') {
                               idgroup = result.listnotify[i].idgroup;
                               namegroup = result.listnotify[i].namegroup;
                               itemlist += ' '+Language.joinyourgroup+' ' + namegroup;
                               itemlist += '<button onclick="acceptgrj(' + idgroup + ',' + id + ')" id="acceptpeogroup-' + id + '" class="btn btn-lg btn-info">'+Language.accept+'</button>';
                               itemlist += '<button onclick="blockgrj(' + idgroup + ',' + id + ')" id="blockpeogroup-' + id + '" class="btn btn-lg btn-danger">'+Language.block+'</button>';
                           }
                           itemlist += '</div></div>';
                           $('#list-notifications').append(itemlist);
                       }
                       $('#closenotifications').click(function () {
                           $('.background-dark').remove();
                       })
                       $('#close-click').click(function () {
                           $('.background-dark').remove();
                       })
                   }
               }
               if (result.mensaje == 'nologin') {
                   console.log('No session');
                   login(user, passmd5, 'session');
               } else {
                   if (result.newnotication != '0') {
                       $('#audio_notifications')[0].play();
                       window.LOCAL_NW.desktopNotifications.notify('./images/icon.png', 'M2S', Language.havenewnotifications, function(){win.show(); win.setShowInTaskbar(true); litsnotify()});
                   }
                   if (result.notification != '0') {
                        if(!$('.notifications-alert').is(':visible')){
                          $('.notifications-alert').css('display','block');
                          $('.notifications-alert').click(function(){
                              litsnotify();
                          });
                          console.log('You have notifications!');
                        }
                   } else {
                       $('.notifications-alert').css('display','none');
                       console.log('No notifications!');
                   }
               }
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
           }
       })
   }


   function signout() {
      vex.dialog.confirm({
         message: Language.suresignout,
         callback: function(value) {
            if(value == true){
           localStorage.clear();
           if (keyuser) {
               window.location.href = "login.html"
           }
           $.ajax({
               type: "POST",
               crossDomain: true,
               url: "http://m2s.es/app/api/connect/signout.php",
               data: {},
               cache: false,
               dataType: 'json',
               success: function (result) {
                   if (result.mensaje == 'ok') {
                       localStorage.clear();
                       window.location.href = "login.html"
                   } else {
                       console.log('Error to sign out')
                   }
               },
               error: function (XMLHttpRequest, textStatus, errorThrown) {
                   console.error(textStatus + ' ' + XMLHttpRequest.status);
                   errormod(Language.errorpetitionm2s);
               }
           })
       }
     }
   });
   }

   function infogroup(id) {
      var groupmod = gui.Window.open('grfmod.html?id='+id, {
        position: 'center',
        min_width: 360,
        min_height: 400,
        width: 360,
        height: 400,
        toolbar:false,
        frame:false,
        resizable: true
      });    
       
   }

   function infouser(id) {
      var usermod = gui.Window.open('prfmod.html?id='+id, {
        position: 'center',
        min_width: 360,
        min_height: 400,
        width: 360,
        height: 400,
        toolbar:false,
        frame:false,
        resizable: true
      });    
   }

   function admingroup(id) {
      var admingrmod = gui.Window.open('admingr.html?id='+id, {
        position: 'center',
        min_width: 360,
        min_height: 400,
        width: 360,
        height: 400,
        toolbar:false,
        frame:false,
        resizable: true
      });  
   }
