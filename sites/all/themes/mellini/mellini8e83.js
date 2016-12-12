/*test JS for pop out menu */

function toggle(id) {
    var el = document.getElementById(id);
    var img = document.getElementById("arrow");
    var box = el.getAttribute("class");
    if(box == "hide"){
        el.setAttribute("class", "show");
        delay(img, "http://www.getty.edu/research/mellini/sites/default/files/arrowleft.png", 400);
    }
    else{
        el.setAttribute("class", "hide");
        delay(img, "http://www.getty.edu/research/mellini/sites/default/files/arrowright.png", 400);
    }
}

function delay(elem, src, delayTime){
    window.setTimeout(function() {elem.setAttribute("src", src);}, delayTime);
}

