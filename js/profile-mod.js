var keyuser = localStorage.getItem('keyuser');
var id = getGET().id;
var win = gui.Window.get();

function pagefunctions(){
$.ajax({
           type: "POST",
           crossDomain: true,
           url: "http://m2s.es/app/api/profileinfo.php",
           data: {"id": id, "key": keyuser},
           cache: false,
           dataType: 'json',
           success: function (data) {
               username = data.username;
               imagein = data.imagein;
               if(imagein == null){
			   		imagein = 'images/icon-user-default.png';
			   }
               id = data.id;
               state = data.state;
               timeago = data.timeago;
               genre = data.genre;
               telf = data.telf;
               birth = data.birt;
               email = data.email;
               $('.user-profcontent').html('');
               $('.app-title').html(Language.profileof+username);
               win.title = 'M2S: '+Language.profileof+username;
               var modaluser = '';
               modaluser += '<div class="head"><img src="' + imagein + '"/><div class="info-profile">';
               modaluser += '<h3 class="selecton">' + username + '</h3><p id="read_more">' + timeago + '</p></div>';
               if (state == '1') {
                   modaluser += '<a id="chatbutton" class="btn btn-default">'+Language.chat+'</a>';
                   modaluser += '<a id="blockfriendbutton" class="btn btn-danger">'+Language.block+'</a>';
                   modaluser += '<a id="deletefriendbutton" class="btn btn-danger">'+Language.deletefriend+'</a>';
               } else {
                   if (state == '23') {
                       modaluser += '<a class="btn btn-default" disabled>'+Language.waitaccept+'</a>';
                   }
                   if (state == '5') {
                       modaluser += '<a id="addfriendbutton" class="btn btn-default">'+Language.addfriend+'</a>';
                   }
               }
               modaluser += '</div>';
               if (state == '1' || state == '4') {
                   if (data.states != '') {
                       modaluser += '<div class="states">';
                       for (var i = 0; i < data.states.length; i++) {
                           idt = data.states[i].id;
                           text = data.states[i].text;
                           date = data.states[i].date;
                           locationgg = data.states[i].location;
                           if (state != '4') {
                               mens = '';
                           } else {
                               mens = 'me';
                           }
                           imaged = '<img src="' + imagein + '" class="img"/>';
                           if (locationgg.latitude != '') {
                               longitud = locationgg.longitud;
                               locatisn = '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locationgg.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
                           } else {
                               locatisn = '';
                           }
                           modaluser += '<div class="sms ' + mens + '" id="' + idt + '"><blockquote><p class="selecton">' + linkscom(text) + '</p>' + locatisn + '<div class="foot">' + convert(date) + '</div></blockquote></div>';
                       }
                       modaluser += '</div>';
                   }
               }
               $('.user-profcontent').append(modaluser);
               $('.imagechat').attr('onclick', 'var urlimg = $(this).attr("alt");imagemod(urlimg)');
               $('.nolink').attr('onclick', 'var nw = require("nw.gui");linken = $(this).html();nw.Shell.openExternal(linken);');
               var heightstate = $(window).height() - 225;
               $('.states').css('height', heightstate);
               $(window).resize(function(){
                 var heightstate = $(window).height() - 225;
                $('.states').css('height', heightstate);
               })
               $('#chatbutton').click(function () {
                   chatlink(id);
               });
               $('#deletefriendbutton').click(function () {
                   vex.dialog.confirm({
                      message: Language.removefriend,
                      callback: function(value) {
                         if(value == true){
                            deletefriend(id);
                         }
                      }
                   })
               })
               $('#blockfriendbutton').click(function () {
                   vex.dialog.confirm({
                      message: Language.blockfriendsu,
                      callback: function(value) {
                         if(value == true){
                            blockuser(id);
                         }
                      }
                   })
               })
               $('#addfriendbutton').click(function () {
                   $.ajax({
                       type: "POST",
                       crossDomain: true,
                       url: "http://m2s.es/app/api/connect/addfriend.php",
                       data: {"id": id, "key": keyuser},
                       cache: false,
                       dataType: 'json',
                       beforeSend: function () {
                           console.log('Connecting to send petition of friend...');
                           $('#addfriendbutton').attr('disabled', 'disabled');
                           $('#addfriendbutton').html(Language.sending);
                       },
                       success: function (result) {
                           if (result.mensaje == 'ok') {
                               $('#addfriendbutton').html(Language.waitaccept);
                           } else {
                               errormod(Language.errorpetitionm2s);
                           }
                       },
                       error: function (XMLHttpRequest, textStatus, errorThrown) {
                           console.error(textStatus + ' ' + XMLHttpRequest.status);
                           errormod(Language.errorpetitionm2s);
                       }
                   })
               })
           },
           error: function (XMLHttpRequest, textStatus, errorThrown) {
               console.error(textStatus + ' ' + XMLHttpRequest.status);
               errormod(Language.errorpetitionm2s);
           }
       });
}