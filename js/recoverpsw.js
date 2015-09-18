if(localStorage.getItem('user')){
	window.location.href="index.html"
};
$("input").keypress(function(e) {
    if(e.which == 13) {
        recover()
    }
});
function recover() {
    var email = $("input[name=email]").val();
    $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/recoverpassword.php",
          data: {"email": email},
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
                infomod(Language.recpasswsu)
             }else{
	             if(result.mensaje == 'e1'){
                  errormod(Language.emailnoti);
                  $('#formsd').css('display','block');
                  $('#sending-load').remove();
	             };
	             if(result.mensaje == 'e4'){
	                errormod(Language.emailnotr);
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
}