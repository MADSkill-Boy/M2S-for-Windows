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
  url: "http://m2s.es/app/api/getmygroups.php",
  data: {"key": keyuser},
  cache: false,
  dataType: 'json',
  beforeSend: function() {
      console.log('Reading list of your groups...');
      $('#list-friends').append('<div id="loading-user" class="load-idsd"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
  },
  success: function(result) {
    if (result.groups) {
      if (result.groups == 'no') {
        $('#list-friends').append("<div class='no-friends'><h4>"+Language.nogroupsjoin+"</h4><p>"+Language.nogroupsjoininfo+"</p></div>");
        $('.load-idsd').remove();
      }else{
      for (var i = 0; i < result.groups.length; i++) {
        id = result.groups[i].id;
        namegroup = result.groups[i].namegroup;
        official = result.groups[i].official;
        imagepr = result.groups[i].imagepr;
        state = result.groups[i].lastmessage;
        statedate = result.groups[i].lastmessagedate;
        unreadmsm = result.groups[i].unreadmsm;
        var localidsfdf = localStorage.getItem('lastmsmcgr-' + result.groups[i].id);
        if(localidsfdf != null){
            mstate = localidsfdf;
            mstated = localStorage.getItem('lastmsmcgrd-' + result.groups[i].id);
        }else{
            mstate = '--';
            mstated = '';
        }

        if (unreadmsm == '0') {
          unreadmsm = '';
        }
        divs += '<li class="li-chats'; 
        if (state == null) {
            divs += '" last-date="'+mstated;
        }else{
            divs += ' mark" last-date="'+statedate;
        }
        divs += '" id="list-' + id + '" onclick="chatgrlink(' + id + ')">';
        if (imagepr != null) {
          divs += '<img src="' + imagepr + '" class="img"/>';
        } else {
          var namesplit = namegroup.split(' ');
          abv1 = namesplit[0].charAt(0);
          if (namesplit[1]) {
            abv2 = namesplit[1].charAt(0);
            abv = abv1 + abv2;
          } else {
            abv = abv1;
          }
          divs += '<div class="img" style="background-color:#777"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>';
        }
        divs += '<div class="right-info">';
        divs += '<font>'+unreadmsm+'</font>';
        if (official == 'yes') {
          divs += '<span class="icon ok"></span>';
        }
        divs += '<span class="icon chevron-right"></span></div><div class="right-p"><div><span class="name">';
        divs += namegroup;
        divs += '</span><span class="state">';

        if(state == null) {
            divs += mstate;
        }else{
            divs += state;
        }

        divs += '</span></div></div></li>';
      }
      $('.load-idsd').remove();
      if($('#list-'+id).length == '0'){
        $('#list-friends').append(divs);
      }
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
    $('#list-notifications').append('<b>Error:</b> '+Language.errorconection);
    $('#list-notifications').click(function() {
      window.location.reload();
    })
  }
});

$('#searchgroup-button').click(function(){
  $('#list-friends').hide();
  $('#search-groups').show();
  if($('.search-group-ul .officials')){
    $('.search-group-ul .officials').remove();
    $('.search-group-ul .news').remove();
    $('.search-group-ul .intgr').remove();
    $('#search-items').remove();
  }  
  $('.' + 'search-group-ul').append('<div id="loading-user"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
  $.ajax({
    type: "POST",
    crossDomain: true,
    url: "http://m2s.es/app/api/searchgroups.php",
    data: {"key": keyuser},
    cache: false,
    dataType: 'json',
    success: function(result) {
      $('#loading-user').remove();
      $('.search-group-ul').append('<div class="officials"></div>');
      for (var i = 0; i < result.officialgr.length; i++) {
        id = result.officialgr[i].id;
        namegroup = result.officialgr[i].namegroup;
        official = result.officialgr[i].official;
        imagepr = result.officialgr[i].imagepr;
        state = result.officialgr[i].state;
        grsearchitem = searchmount(id, namegroup, official, imagepr, state);
        $('.search-group-ul .officials').append(grsearchitem);
      }
      $('.search-group-ul').append('<div class="news"></div>');
      for (var i = 0; i < result.newgr.length; i++) {
        id = result.newgr[i].id;
        namegroup = result.newgr[i].namegroup;
        official = result.newgr[i].official;
        imagepr = result.newgr[i].imagepr;
        state = result.newgr[i].state;
        grsearchitem = searchmount(id, namegroup, official, imagepr, state);
        $('.search-group-ul .news').append(grsearchitem);
      }
      $('.search-group-ul').append('<div class="intgr"></div>');
      for (var i = 0; i < result.intgr.length; i++) {
        id = result.intgr[i].id;
        namegroup = result.intgr[i].namegroup;
        official = result.intgr[i].official;
        imagepr = result.intgr[i].imagepr;
        state = result.intgr[i].state;
        grsearchitem = searchmount(id, namegroup, official, imagepr, state);
        $('.search-group-ul .intgr').append(grsearchitem);
      }
      $('.officials').addClass(langdefault);
      $('.news').addClass(langdefault);
      $('.intgr').addClass(langdefault);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.error(textStatus + ' ' + XMLHttpRequest.status);
      errormod(Language.errorpetitionm2s);
      $('#loading-user').remove();
    }
  });
});

$('#creategroup-button').click(function(){
  $('#list-friends').hide();
  $('#create-group').show();
});


$('#close-tabss').click(function(){
  $('#list-friends').show();
  $('#search-groups').hide();
  $('#create-group').hide();
});

$('#close-tabs').click(function(){
  $('#list-friends').show();
  $('#search-groups').hide();
  $('#create-group').hide();
});

$('#sharelocat-cr').click(function() {
  if ($('#sharelocat-cr').hasClass("btn-default")) {
    if (navigator.geolocation) {
      $('#sharelocat-cr').attr('disabled', 'disabled');
      $('#sharelocat-cr').html(Language.locationloading);
      navigator.geolocation.getCurrentPosition(function(pods) {
        var latitud = pods.coords.latitude;
        var longitud = pods.coords.longitude;
        $('#location-cr').val(latitud + ' ' + longitud);
        $('#sharelocat-cr').removeAttr('disabled');
        $('#sharelocat-cr').addClass('btn-desactivate');
        $('#sharelocat-cr').removeClass('btn-default');
        $('#sharelocat-cr').html(Language.removelocation);
      });
    } else {
      alert("Your browser doesn't the location API");
    }
  } else {
    $('#sharelocat-cr').html(Language.sharelocation);
    $('#sharelocat-cr').removeClass('btn-desactivate');
    $('#sharelocat-cr').addClass('btn-default');
    $('#location-cr').val('');
  }
})

$('#creategroup-cr').click(function() {
  namegr = $('#namegroup-cr').val();
  if ($('#namegroup-cr').val()) {
    descgr = $('#descriptiongroup-cr').val();
    locgr = $('#location-cr').val();
    if ($('#privategroup-cr').is(':checked')) {
      privategr = 'yes';
    } else {
      privategr = 'no';
    }
    if ($('#showcreator-cr').is(':checked')) {
      showcreatr = 'yes';
    } else {
      showcreatr = 'no';
    }
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/connect/creategroup.php",
      data: {
        'name': namegr,
        'description': descgr,
        'location': locgr,
        'private': privategr,
        'showcreator': showcreatr
      },
      cache: false,
      dataType: 'json',
      success: function(data) {
        if (data.mensaje == 'ok') {
          document.location.href = 'groups.html';
        }
        if(data.mensaje == 'e2'){
          errormod(Language.errormatchgroup);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
      }
    })
  } else {
    errormod(Language.erroremptygroup);
  }
})
}

function submitsearch() {
  $('.search-group-ul').append('<div id="loading-user"><img src="images/loading.gif" width="25px" height="25px"/> <span>'+Language.loading+'</span></div>');
  $('.search-group-ul .officials').hide();
  $('.search-group-ul .news').hide();
  $('.search-group-ul .intgr').hide();
  if (document.getElementById('search-items')) {
    $('#search-items').remove();
  }
  $('.search-group-ul').append('<div id="search-items"></div>');
  var valueinput = $('#search-useradd').val();
  if (valueinput != '') {
    $.ajax({
      type: "POST",
      crossDomain: true,
      url: "http://m2s.es/app/api/searchgroups.php",
      data: {"s": valueinput, "key": keyuser},
      cache: false,
      dataType: 'json',
      success: function(data) {
        if (data.search.length == 0) {
          $('.search-group-ul #search-items').append("<p class='centeral'>"+Language.noresultsearch+"</p>");
        }
        for (var i = 0; i < data.search.length; i++) {
          id = data.search[i].id;
          namegroup = data.search[i].namegroup;
          official = data.search[i].official;
          imagepr = data.search[i].imagepr;
          state = data.search[i].state;
          grsearchitem = searchmount(id, namegroup, official, imagepr, state);
          $('.search-group-ul #search-items').append(grsearchitem);
        }
      },
      complete: function() {
        if ($('#loading-user').length) {
          $('#loading-user').remove()
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.error(textStatus + ' ' + XMLHttpRequest.status);
        errormod(Language.errorpetitionm2s);
        $('#loading-user').remove();
      }
    });
  }else{
    $('#loading-user').remove();
    $('.search-group-ul .officials').show();
    $('.search-group-ul .news').show();
    $('.search-group-ul .intgr').show();
  };
}

function searchmount(id, namegroup, official, imagepr, state) {
  searchdiv = '';
  searchdiv += '<li class="li-chats" onclick="infogroup(' + id + ')">';
  if (imagepr != null) {
    searchdiv += '<img src="' + imagepr + '" class="img"/>';
  } else {
    var namesplit = namegroup.split(' ');
    abv1 = namesplit[0].charAt(0);
    if (namesplit[1]) {
      abv2 = namesplit[1].charAt(0);
      abv = abv1 + abv2;
    } else {
      abv = abv1;
    }
    searchdiv += '<div class="img" style="background-color:#777"><p unselectable="on" onselectstart="return false;" onmousedown="return false;">' + abv + '</p></div>';
  }
  searchdiv += '<div class="right-info">';
  if (official == 'yes') {
    searchdiv += '<span class="icon ok"></span>';
  }
  searchdiv += '<span class="icon chevron-right"></span></div><div class="right-p"><div><span class="name">';
  searchdiv += namegroup;
  searchdiv += '</span><span class="state">';
  if (state == '') {
    searchdiv += '--';
  } else {
    searchdiv += state;
  }
  searchdiv += '</span></div></div></li>';
  return searchdiv;
};