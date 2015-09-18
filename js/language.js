if(localStorage.getItem('lang')){
	langdefault = localStorage.getItem('lang');
}else{
    var langdefault = navigator.language.slice(0,2);
    if(langdefault != 'es' && langdefault != 'en' && langdefault != 'ca' && langdefault != 'it' && langdefault != 'fr'  && langdefault != 'pt'){
       langdefault = 'en';
    }
}
$.getJSON("lang/"+langdefault+".json", function(data) {
    Language = data;
    translatedivs();
    pagefunctions();
})

function translatedivs(){     
    $('[data-translate]').each(function(){
	   var $el = $(this);
	   var key = $el.data('translate');
      
	   if($el.is('input') || $el.is('textarea')){
	     $el.attr('placeholder', Language[key]);
	   }else{
	  	 $el.text(Language[key]);
	   }
    });
}