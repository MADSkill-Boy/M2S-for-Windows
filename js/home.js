function pagefunctions(){
var input = document.getElementById('search-input');
input.onkeyup = function() {
  var filter = input.value.toUpperCase();
  var lis = document.getElementsByClassName('li-chats');
  for (var i = 0; i < lis.length; i++) {
    var name = lis[i].getElementsByClassName('name')[0].innerHTML;
    if (name.toUpperCase().indexOf(filter) == 0)
      lis[i].style.display = 'block';
    else
      lis[i].style.display = 'none';
  }
}
var keyuser = localStorage.getItem('keyuser');
if(localStorage.getItem('imguse')){
	myimgs = localStorage.getItem('imguse');
}else{
	myimgs = 'images/icon-user-default.png';
}
$('.menu-bar img').attr("src", myimgs);

var divs = '';
$.ajax({
  type: "POST",
  crossDomain: true,
  url: "http://m2s.es/app/api/getfriends.php",
  data: {"key": keyuser},
  cache: false,
  dataType: 'json',
  beforeSend: function() {
      console.log('Reading list of your friends...');
      $('#list-friends').append('<div id="loading-user" id="load-idsd"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
  },
  success: function(result) {
    if (result.friends) {
      if (result.friends.length == '0') {
        $('#list-friends').append("<div class='no-friends'><h4>"+Language.nofriends+"</h4><p>"+Language.nofriendsinfo+"</p></div>");
        $('#loading-user').remove();
      }else{
      for (var i = 0; i < result.friends.length; i++) {
        id = result.friends[i].id;
        username = result.friends[i].username;
        imagepr = result.friends[i].imagepr;
        state = result.friends[i].lastmessage;
        unreadmsm = result.friends[i].unreadmsm;
        if(imagepr == null){
          imagepr = 'images/icon-user-default.png';
        }
        if(state != null){
          statemeis = result.friends[i].lastmessage.meis;
        }else{
          statemeis = 'yes';
        }
        if (unreadmsm == '0') {
          unreadmsm = '';
        }
        var localidsfdf = localStorage.getItem('lastmsmc-' + result.friends[i].id);
        if(localidsfdf != null){
            mstate = localidsfdf;
            mstated = localStorage.getItem('lastmsmcd-' + result.friends[i].id);
        }else{
            mstate = '--';
            mstated = '';
        }

        divs += '<li class="li-chats'
        if (state == null) {
            divs += '" last-date="'+mstated+'"';
        } else {
          	if(statemeis == 'yes'){
            	divs += '" last-date="'+mstated+'"';
          	}else{
            	divs += ' mark" last-date="'+state.date+'"';
          	}
        }
        divs += ' id="list-' + id + '" onclick="chatlink(' + id + ')"><img src="';
        divs += imagepr;
        divs += '" class="img"/><div class="right-info">';
        divs += '<font>'+unreadmsm+'</font>';
        divs += '<span class="icon chevron-right"></span></div><div class="right-p"><div><span class="name">';
        divs += username;
        divs += '</span><span class="state">';

        if (state == null) {
            divs += mstate;
        } else {
          if(statemeis == 'yes'){
            divs += mstate;
          }else{
            divs += state.text;
          }
        }

        divs += '</span></div></div></li>';
      };
      $('#loading-user').remove();
      $('#list-friends').append(divs);
      tinysort('#list-friends>li',{attr:'last-date',order:'desc'})
     } 
    }
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
    console.error(textStatus + ' ' + XMLHttpRequest.status);
    var divno = document.createElement('div');
    divno.innerHTML = '<div id="list-notifications" style="text-align:center;cursor:pointer"></div>';
    divno.className = 'background-dark';
    var modsv = document.getElementById('modsv');
    modsv.appendChild(divno);
    $('#list-notifications').append(Language.errorconection);
    $('#list-notifications').click(function() {
      window.location.reload();
    })
  }
});

$('#addfriend-button').click(function(){
  $('#list-friends').hide();
  $('#add-friends').show();
});

$('#close-addfriends').click(function(){
  $('#list-friends').show();
  $('#add-friends').hide();
});
}

function submitadd(){
  if (document.getElementById('person')) {
    $('#person').remove();
  }
  var valueinput = $('#search-useradd').val();
  if ($('#search-useradd').val().length != 0) {
    $('.people').html('<div id="loading-user"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/profileinfo.php",
      data: {"username": valueinput, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(data) {
        username = data.username;
        image = data.imagein;
        if(image == null){
		    image = 'images/icon-user-default.png';
	    }
        id = data.id;
        state = data.state;
        datos = crearNoticiaHtml(username, image, id, state);
        $('.' + 'people').append(datos);
      },
      complete: function() {
        if ($('#loading-user').length) {
          $('#loading-user').css('display', 'none');
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
        if ($('#loading-user').length) {
          $('#loading-user').css('display', 'none');
        }
      }
    });
  };
}

function crearNoticiaHtml(username, image, id, state) {
    if (state == '1') {
      noticiaHTML = '<div id="person">';
      noticiaHTML += '<img src="' + image + '"/>';
      noticiaHTML += '<p>' + username + '</p>';
      noticiaHTML += '<a href="javascript:addpeople(' + id + ')"><button  class="btn btn-primary" id="addfriendb">'+Language.sendrequestfriend+'</button></a></div>';
    }
    if (state == '2' || state == '5') {
      var searchinput = document.getElementById('search-useradd');
      var valueinput = searchinput.value;
      noticiaHTML = '<div id="person">' + valueinput + ' '+Language.alreadyfriend+'</div>';
    }
    if (state == '3') {
      noticiaHTML = '<div id="person">'+Language.usernotexist+'</div>';
    }
    if (state == '4') {
      noticiaHTML = '<div id="person">'+Language.addyourself+'</div>';
    }
    return noticiaHTML;
}

function addpeople(id) {
  $.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/connect/addfriend.php",
    data: {"id": id, "key": keyuser},
    cache: false,
    dataType: 'json',
    beforeSend: function() {
      console.log('Connecting...');
      $('#addfriendb').attr("href", "#");
      $('#addfriendb').html(Language.loading)
    },
    success: function(result) {
      if (result.mensaje == 'ok') {
        $('#addfriendb').html(Language.petitionfriendsend)
      } else {
        $('#addfriendb').html(Language.error);
        setInterval(function() {
          $('#addfriendb').html(Language.sendrequestfriend);
          $('#addfriendb').attr("href", "javascript:addpeople(" + id + ")");
        }, 5000);
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.error(textStatus + ' ' + XMLHttpRequest.status);
      errormod(Language.errorpetitionm2s);
      $('#addfriendb').html(Language.sendrequestfriend);
      $('#addfriendb').attr("href", "javascript:addpeople(" + id + ")");
    }
  })
}