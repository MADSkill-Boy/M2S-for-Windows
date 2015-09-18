function urlast(){
    var loc = document.location.href;
    var astString = loc.split('#')[1];
       if(astString==undefined){
          return undefined;
       }else{
          return loc.split('#')[1];
       }
}