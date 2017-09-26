// handle response from XMLHttp request
function assistRes() {
    if (this.readyState != 4) {return;}
    if (this.status == 200) {redo(this.responseText);
        if (adding) {adding = false;document.getElementById("addbutton").innerHTML = "Add";}
        if (d) {d = false;document.getElementById("deletebutton").innerHTML = "Delete";}}};


// sends an add XMLHttp request
function addMovie(movie) {
    var newmovie = { title: movie};
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = assistRes;
    xhr.open("POST", "/");
    xhr.send("add=" + JSON.stringify(newmovie));
}

// delivers XMLHttp request for delete movie
function deleteMovie(movie) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = assistRes;
    xhr.open("POST", "/");
    xhr.send("del=" + movie);
}

// Refreshes table
function redo(res) {
  //Parses JSON and adds titles from database
    var movies = JSON.parse(res);
    var listTable = document.getElementById("movies");
    var headerRow = listTable.getElementsByTagName("tr")[0];
    // delete everything
    while (listTable.firstChild) {listTable.removeChild(listTable.firstChild);}
    listTable.appendChild(headerRow);
    var i = false;
    // adds each moviee
    movies.forEach(function (item) {if (item) {listTable.appendChild(slot(item, i));i = !i;}});}

// makes rows
function slot(item, i) {
    var tr = document.createElement("tr");
    if (i) {tr.className = "onRow";}
    var td = document.createElement("td");
    var a = document.createElement("a");
    a.innerHTML = item.title;
    td.appendChild(a);
    tr.appendChild(td);
    td = document.createElement("td");
    td.style.minWidth = "60px";
    a = document.createElement("a");
    a.innerHTML = "";
    a.className = "linkbutton";
    a.onclick = function () {
      editor(a)
    };
    td.appendChild(a);
    tr.appendChild(td);
    return tr;
}


// sends an XMLHttp request to seach bar
function search(el) {
    var storeValue = el.value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = assistRes;
    xhr.open("POST", "/search?storeValue=" + storeValue);
    if (storeValue == '') {history.replaceState(null, "Movie Search", "/");}
    else {history.replaceState(null, "Movie Search", "/search?storeValue=" + storeValue);}
    xhr.send();}

//controls switch for delete
var d = false;
function Dswitch() {
    var listTable = document.getElementById("movies");
    var edits;
    if (adding) {Aswitch();}
    if (d) {edits = listTable.querySelectorAll("button");}
    else {edits = listTable.querySelectorAll(".linkbutton");}
    var el;

    for (var i = 0; i < edits.length; i++) {
        el = edits[i].parentNode;
        el.removeChild(edits[i]);
        if (d) {
            a = document.createElement("a");
            a.className = "linkbutton";
            a.onclick = function () { editor(a) };
            el.appendChild(a);
        }
        else {
            var button = document.createElement("button");
            button.innerHTML = "X";
            el.appendChild(button);
            button.onclick = function () { deleteButton(this) };
        }


    }
    // change delete to confirm and vice versa
    if (d) {document.getElementById("deletebutton").innerHTML = "Delete";}
    else {document.getElementById("deletebutton").innerHTML = "Cancel";}
    d = !d;

}

function deleteButton(b) {
    var tr = b.parentNode.parentNode;
    var movie = tr.children[0].firstChild.innerHTML;
    deleteMovie(movie);
}

var adding = false;
function Aswitch() {

    if (d) {Dswitch();}

    var listTable = document.getElementById("movies");
    if (adding) {
        listTable.removeChild(document.getElementById("addingrow"));

        document.getElementById("addbutton").innerHTML = "Add";
    }
    else {
        var tr = document.createElement("tr");
        tr.id = "addingrow";
        var td = document.createElement("td");
        var movieinput = document.createElement("input");
        movieinput.type = "text";
        movieinput.className = "inlineinput";
        td.appendChild(movieinput);
        tr.appendChild(td);

        td = document.createElement("td");
        var button = document.createElement("button");
        button.innerHTML = "add";
        button.type = "button";
        button.onclick = function () { completeRequest('', tr) };
        td.appendChild(button);
        tr.appendChild(td);
        listTable.appendChild(tr);
        document.getElementById("addbutton").innerHTML = "Cancel";

        movieinput.focus();
    }
    adding = !adding;
}

// checks if the submitted movie and rating does not have empty fields and has a number for a rating
function validSubmission(movie) {
    // check fields are filled
    if (movie == '') {
        alert("Please enter movie title.")
        return false;
    }

    return true;
}

// called when an edit button pressed
function editor(a) {
    var tr = a.parentNode.parentNode;
    var movie = tr.children[0].firstChild.innerHTML;
    while (tr.firstChild) {tr.removeChild(tr.firstChild);}
    var button = document.createElement("button");
    button.innerHTML = "Confirm";
    button.type = "button";
    button.onclick = function () {completeRequest(movie, tr) };
    td.appendChild(button);
    tr.appendChild(td);
}

// called when submitting an edit
function completeRequest(oldmovie, tr) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = assistRes;
    xhr.open("POST", "/");
    var newmovie = tr.children[0].firstChild.value;
    var movie = { title: newmovie };
    if (validSubmission(newmovie)) {
        xhr.send("add=" + JSON.stringify(movie) + "&del=" + oldmovie);
    }
}
