function pagefunctions(){}

if(localStorage.getItem('user')){
	window.location.href="index.html"
};
$("input").keypress(function(e) {
    if(e.which == 13) {
        logininputs()
    }
});
function logininputs() {
	var userinput = document.getElementsByName('user')[0].value;
	var passinput = document.getElementsByName('pass')[0].value;
	var passinput = md5(passinput);
	login(userinput,passinput,'login');
}
