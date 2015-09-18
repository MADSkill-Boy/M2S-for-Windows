function login(usern,pass,type){
	  $.ajax({
          type: "POST",
          crossDomain: true,
          url: "http://m2s.es/app/api/connect/login.php",
          data: {"user": usern, "passmd5": pass},
          cache:false,
          dataType: 'json',
          beforeSend: function() {
          console.log('Connecting...');
          if(type == 'login'){
            $('#formsd').css('display','none');
            var sending = '<div id="sending-load"><img src="images/load-login.gif"></div>';
            $('.form').append(sending);
          }
          },
          success: function(result) {
            if(result.mensaje == 'OK'){
              if(type == 'key'){
	             keyuser = result.key;
                 keyuser = keyuser.replace('==','');
                 localStorage.setItem("keyuser", keyuser); 
                 var href = $(location).attr('href'); 
 	             window.location.href = href;
              }
              if(type == 'login'){
                if (localStorage) {
                  localStorage.setItem("user", usern);  
                  localStorage.setItem("passwd", pass); 
                  if(result.data.imagepr){
                    localStorage.setItem("imguse", result.data.imagepr); 
                  }
                  localStorage.setItem("emailMD5", md5(result.data.email));  
                  setInterval(function(){
                    window.location.href="index.html";
                  },4000);
                }else{
	              alert('This app needs localstorage!')
                };
              }else{ 
               if(type == 'session'){
	             $.ajax({
                   type: "POST",
                   crossDomain: true,
                   url: 'http://m2s.es/app/api/notifications.php',
                   data:{},
                   cache:false,
                   dataType: 'json',
                   success: function(data) {
                     if(data.nosession == '1'){
                       login(user,passmd5,'key');
                     }else{
	                   var href = $(location).attr('href'); 
 	                   window.location.href = href;  
                     }
                   }
                 })
               }
              }
              console.log('Completed session');
              };
            if(result.mensaje == 'e2'){
              errormod(Language.datanotenter);
              if(type == 'login'){
              $('#formsd').css('display','block');
              $('#sending-load').remove();
              }
              console.log("Data not entered");
            }
            if(result.mensaje == 'e3'){
             if(type == 'login'){
	            errormod(Language.userpassincorrect);
              $('#formsd').css('display','block');
              $('#sending-load').remove();
              $('input[name="user"]').val('');
              $('input[name="pass"]').val('');
              }else{
	              localStorage.removeItem('user');
	              localStorage.removeItem('passwd');
	              window.location.href="login.html"
              }
              console.log("The username or password are incorrect.");
            }
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.error(textStatus+' '+XMLHttpRequest.status); 
            if(type == 'login'){
              errormod(Language.errorpetitionm2s);
              $('#formsd').css('display','block');
              $('#sending-load').remove();
              $('input[name="user"]').val('');
              $('input[name="pass"]').val('');
            }else{
	          var divno = document.createElement('div');
              divno.innerHTML='<div id="list-notifications" style="text-align:center;cursor:pointer"></div>';
              divno.className='background-dark';
              var modsv = document.getElementById('modsv');
              modsv.appendChild(divno);
              $('#list-notifications').append(Language.errorconection);
              $('#list-notifications').click(function(){
                window.location.reload(); 
              })
            }  
          }
     })
	}