function pagefunctions(){}

$(document).ready(function(){
    $('#file_input').on('change', function(e){
        readFile(this.files[0], function(e) {
            jsonlist = atob(e.target.result);
            jsonlist = JSON.parse(jsonlist);
            if(jsonlist.emailMD5 == localStorage.emailMD5){
              console.log(jsonlist);
              localStorage.clear();
              var data = jsonlist;
              for (var key in data) {
                localStorage[key] = data[key];
              }
              document.location.href='/myfriends.html';
            }
        });
        
    });
});
    
function readFile(file, callback){
    var reader = new FileReader();
    reader.onload = callback
    reader.readAsText(file);
}

$('.cancelimport').click(function(){
    document.location.href= '/settings.html';
})