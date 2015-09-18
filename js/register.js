if(localStorage.getItem('user')){
	window.location.href="index.html"
};

$("input").keypress(function(e) {
    if(e.which == 13) {
        register()
    }
});
function register() {
    var usuario = $("input[name=user]").val();
    var genre = $("select[name=genre]").val();
    var email = $("input[name=email]").val();
    var passin = $("input[name=pass]").val();
    var passinc = $("input[name=confpass]").val();
    var birthday = $("input[name=birthday]").val();
    var telf = $("input[name=telf]").val();
    if(passin == passinc){
    $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/connect/register.php",
          data: {"usuario": usuario, "genero": genre, "email": email, "password": passin, "passwordc": passinc, "cumple": birthday, "telefono": telf},
          cache:false,
          dataType: 'json',
          beforeSend: function() {
          console.log('Connecting...');
          $('#formsd').css('display','none');
          var sending = '<div id="sending-load"><img src="images/load-login.gif"></div>';
          $('.form').append(sending);
          },
          success: function(result) {
             $('#formsd').css('display','block');
             $('#sending-load').remove();
             if(result.mensaje == 'ok'){
                console.log(result.mensaje);
                var passinput = md5(passin);
	            login(usuario,passinput,'login');
             }else{
	             if(result.mensaje == 'e1'){
		            $.ajax({
                      type: "POST",
                      crossDomain: true,
                      url: "http://m2s.es/app/api/connect/signout.php",
                      data: {},
                      cache:false,
                      dataType: 'json',
                      success: function(result) {
                       if(result.mensaje == 'ok'){
	                     window.location.href="register.html"
                       }
                      }
                     })
	             };
	             if(result.mensaje == 'e2'){
	                errormod(Language.passnotmatch);
	                $('#formsd').css('display','block');
                    $('#sending-load').remove();
	             };
	             if(result.mensaje == 'e3'){
	                errormod(Language.userregisterlater);
	                $('#formsd').css('display','block');
                    $('#sending-load').remove();
	             };
	             if(result.mensaje == 'e4'){
	                errormod(Language.emailregisterlater);
	                $('#formsd').css('display','block');
                    $('#sending-load').remove();
	             };
	             if(result.mensaje == 'e6'){
	                errormod(Language.requiredfieldsnotenter);
	                $('#formsd').css('display','block');
                    $('#sending-load').remove();
	             }
             }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus+' '+XMLHttpRequest.status);
            errormod(Language.errorpetitionm2s);
            $('#formsd').css('display','block');
            $('#sending-load').remove();
          }
    })
    }else{
	    errormod(Language.passnotmatch);
    }
}