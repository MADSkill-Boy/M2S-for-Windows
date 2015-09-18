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
        $('.user-profcontent').html('');
        $('.app-title').html(Language.profileofgr+name);
        win.title = 'M2S: '+Language.profileofgr+ name;
        var modaluser = '';
        modaluser += '<div class="head">';
        if (image != null) {
            modaluser += '<img src="' + image + '"/><div class="info-profile">';
        }else{
            var namesplit = name.split(' ');
            abv1 = namesplit[0].charAt(0);
            if (namesplit[1]) {
                abv2 = namesplit[1].charAt(0);
                abv = abv1 + abv2;
            }else{
                abv = abv1;
            }
            modaluser += '<div class="img" style="background-color:#777"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>';
            modaluser += '<div class="info-profile">';
        }
        modaluser += '<h3 class="selecton">' + name;
        if (official == 'yes') {
            modaluser += '<span class="icon ok"></span>'
        }
        modaluser += '</h3>';
        modaluser += '<p id="read_more">' + decription + '</p>';
        if (local.longitud) {
            modaluser += '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + local.latitude + ',' + local.longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
        }
        modaluser += '</div>';
        if (result.yourstate == '1') {
            modaluser += '<a id="chatbutton" class="btn btn-default">'+Language.chat+'</a>';          
            if(mutegroup == 'no'){
              modaluser += '<a id="mutegroupbutton" class="btn btn-default">'+Language.mutegroup+'</a>';
            }else{
              modaluser += '<a id="mutegroupbutton" class="btn btn-default">'+Language.unmutegroup+'</a>';
            }
            if (admininfo != 'me') {
                modaluser += '<a id="leavegroupbutton" class="btn btn-default">'+Language.leavegroup+'</a>';
            }else{
            	modaluser += '<a id="admingroupbutton" class="btn btn-default">'+Language.admingroup+'</a>';
            }
            modaluser += '</div>';
            if (result.states != '') {
                modaluser += '<div class="states">';
                for (var i = 0; i < result.states.length; i++) {
                    idt = result.states[i].id;
                    text = result.states[i].text;
                    date = result.states[i].date;
                    locationgg = result.states[i].location;
                    if (admininfo != 'me') {
                        mens = '';
                    }else{
                        mens = 'me';
                    }
                    if (locationgg.latitude != '') {
                        longitud = locationgg.longitud;
                        locatisn = '<iframe marginheight="0" marginwidth="0" src="http://maps.google.com/maps?client=safari&ll=' + locationgg.latitude + ',' + longitud + '&z=14&output=embed" frameborder="0" scrolling="no" style="height: 24%;max-height: 200px;max-width: 700px;width: 100%;"></iframe>';
                    }else{
                        locatisn = '';
                    }
                    modaluser += '<div class="sms ' + mens + '" id="' + idt + '"><blockquote><p class="selecton">' + linkscom(text) + '</p>' + locatisn + '<div class="foot">' + convert(date) + '</div></blockquote></div>';
                }
                modaluser += '</div>';
            }
        }
        if (result.yourstate == null || result.yourstate == '0') {
            if (!result.yourstate) {
                modaluser += '<a id="joingroupbutton" class="btn btn-default">'+Language.jointhisgroup+'</a>';
            }else{
                modaluser += '<a class="btn btn-default" disabled> '+Language.waitadminacceptyou+'</a>';
            }
            modaluser += '</div>';
            if (admininfo != null || peoplejoin != '0') {
                modaluser += '<div class="footbutton">';
                if (admininfo != null) {
                    modaluser += '<div class="leftb">';
                    if(admininfo.imagein == null){
			   			admimagein = 'images/icon-user-default.png';
			        }else{
				        admimagein = admininfo.imagein;
			        }
                    modaluser += '<img src="' + admimagein + '"/>';
                    modaluser += '<i>'+Language.createdby+'</i>';
                    modaluser += '<b class="selecton">' + admininfo.username + '</b></div>';
                }
                if (peoplejoin != '0') {
                    if (admininfo == null) {
                        modaluser += '<div class="centerb">';
                    }else{
                        modaluser += '<div class="rightb">';
                    }
                    modaluser += '<i>'+Language.peoplejoined+'</i> <b>' + peoplejoin + '</b></div>';
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
            chatgrlink(id);     
        })
        if (!result.yourstate) {
            $('#joingroupbutton').click(function () {
                $.ajax({
                    type: "POST",
                    crossDomain: true,
                    url: 'http://m2s.es/app/api/connect/joingroup.php',
                    data: {"id": id, "key": keyuser},
                    cache: false,
                    dataType: 'json',
                    beforeSend: function () {
                        console.log('Connecting...');
                        $('#joingroupbutton').attr('disabled', 'disabled');
                        $('#joingroupbutton').html(Language.loading);
                    },
                    success: function (data) {
                        if (data.mensaje == 'ok') {
                            if (private == 'no') {
                                infomod(Language.congjoingroup);
                                $('.vex .vex-dialog-buttons input').click(function(){
                                    document.location.href= 'grfmod.html?id='+id;
                                })
                            }else{
                                infomod(Language.waitadminacceptyou);
                                $('.vex .vex-dialog-buttons input').click(function(){
                                    document.location.href= 'grfmod.html?id='+id;
                                })
                            }
                        }else{
                            console.error('Error to join to the group: ' + data.mensaje);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(textStatus + ' ' + XMLHttpRequest.status);
                        errormod(Language.errorpetitionm2s);
                    }
                })
            });
        }	
        $('#leavegroupbutton').click(function () {
            vex.dialog.confirm({
                message: Language.sureleavegroup,
                    callback: function(value) {
                        if(value == true){
                            $.ajax({
                                type: "POST",
                                crossDomain: true,
                                url: 'http://m2s.es/app/api/connect/leavegroup.php',
                                data: {"id": id, "key": keyuser},
                                cache: false,
                                dataType: 'json',
                                beforeSend: function () {
                                    console.log('Connecting...');
                                    $('#leavegroupbutton').attr('disabled', 'disabled');
                                    $('#leavegroupbutton').html(Language.loading);
                                },
                                success: function (data) {
                                    if (data.mensaje == 'ok') {
                                        infomod(Language.leftgroup);
                                        $('.vex .vex-dialog-buttons input').click(function(){
                                           document.location.href= 'grfmod.html?id='+id;
                                        })
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    console.error(textStatus + ' ' + XMLHttpRequest.status);
                                    errormod(Language.errorpetitionm2s);
                                }
                            })
                        }
                    }
            })
        })

        $('#mutegroupbutton').click(function(){
            $.ajax({
                type: "POST",
                crossDomain: true,
                url: 'http://m2s.es/app/api/connect/mutegroup.php',
                data: {"id": id, "key": keyuser},
                cache: false,
                dataType: 'json',
                beforeSend: function () {
                    console.log('Connecting...');
                    $('#mutegroupbutton').attr('disabled', 'disabled');
                    $('#mutegroupbutton').html(Language.loading);
                },
                success: function (data) {
                    if (data.mensaje == 'ok') {
                       if($('#mutegroupbutton').html() == Language.unmutegroup){
                          $('#mutegroupbutton').html(Language.mutegroup)
                       }else{
                          $('#mutegroupbutton').html(Language.unmutegroup)
                       }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(textStatus + ' ' + XMLHttpRequest.status);
                    errormod(Language.errorpetitionm2s);
                }
            })
        })

        $('#admingroupbutton').click(function () {
            admingroup(id);
        })
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
    }
})
}