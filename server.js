var http = require('http')
, qs   = require('querystring')
, fs   = require('fs')
, url = require('url')
, sql = require('sqlite3')
, port = 8080

// Value to hold on for search engine
var storeValue;

// open database
var db = new sql.Database('MCUmovies.db', sql.OPEN_READWRITE, function(issue) {
  if (issue) {console.error("Secret Database could not be read ... Hail Hydra");}
  else {console.log("Welcome Marvel Shield agent to our database.")}});

  // Initialises server
  var server = http.createServer(function (req, res) {var uri = url.parse(req.url)
    storeValue = '';

    // Search, add and delete components as well as loading CSS and Images to server
    switch (uri.pathname) {
      case '/search':
      handleSearch(req, res, uri);
      break;
      case '/':
      if (req.method == 'POST') {
          handlePost(res, req, uri)
      } else {
          deliver(res)
      }
      break
      case '/index.html':
      if (req.method == 'POST') {
        handlePost(res, req, uri)
      } else {
        deliver(res)
      }
      break
      case '/style.css':
      sendFile(res, 'style.css', 'text/css')
      break
      case '/script.js':
      sendFile(res, 'script.js', 'text/javascript')
      break
      case '/favicon.ico':
      sendFile(res, 'favicon.ico', 'image/x-icon')
      break
      default:
      res.end(uri.pathname + ' 404 not found')
    }

  })

  server.listen(process.env.PORT || port)
  console.log('listening on 8080 check LocalHost:5000 if using heroku')


  //Delivers movies to database

  function deliver(res) {
    var MarvelFilms = [];
    db.each("SELECT title FROM MCUmovies", function (issue, row) {
      MarvelFilms.push(row);}, function () {sendIndex(res, MarvelFilms);});
    }

    // Search Functionality

    function handleSearch(req, res, uri) {

    //Stored word

    storeValue = qs.parse(uri.query).storeValue;

    var MarvelFilms = [];
    db.each("SELECT title FROM MCUmovies", function (issue, row) {
      if ((row.title).indexOf(storeValue) >= 0) {MarvelFilms.push(row);}}, function () {
        if (req.method == 'POST') {
            var contentType = 'application/json'
            res.writeHead(200, { 'Content-type': contentType })
            res.end(JSON.stringify(MarvelFilms));
          } else {sendIndex(res, MarvelFilms); }
        });}

    function handlePost(res, req, uri) {

      var retrieval = '';
      req.on('data', function (d) {retrieval += d;});
      // Parse
      req.on('end', function () {var post = qs.parse(retrieval)
        // add film to database

        if (post.del && post.add) {
            var newmovie = JSON.parse(post.add);
            db.run("UPDATE MCUmovies SET title=(?) WHERE title=(?)", newmovie.title, post.del);}

        else {if (post.del) {db.run("DELETE FROM MCUmovies WHERE title=(?)", post.del);}
            // adding movie to database
            if (post.add) {
                var newmovie = JSON.parse(post.add);
                if (newmovie.title) {db.run("INSERT INTO MCUmovies VALUES ('" + newmovie.title + "')");}}}

        var contentType = 'application/json';
        var movies = [];
        db.each("SELECT title FROM MCUmovies", function (issue, row) {
              movies.push(row);

            }, function () {
              res.writeHead(200, { 'Content-type': contentType });
              res.end(JSON.stringify(movies));
              });});}

            // Note: consider this your "index.html" for this assignment
            function sendIndex(res, movies) {

              var contentType = 'text/html', html = ''

              html = html + '<html>'

              html = html + '<head>'
              html = html + '<title>MCU Movie List</title>'
              html = html + '<link rel="stylesheet" type="text/css" href="style.css" />'
              html = html + '<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">'
              html = html + '<script src="script.js"></script>'
              html = html + '</head>'

              html = html + '<body>'

              html = html + '<div class = "box" rel="stylesheet">'
              html = html + '<h1>Ultimate MCU Movie Catalog!</h1>'
              html = html + '<h2>See what MCU movies we have available?</h2>'

              // Search form
              html = html + '<form name="searchForm" action="search" method="GET">'
              html = html + '<input autocomplete="off" onkeyup="search(this);" id="test" value="' + storeValue + '" type="text" name="storeValue" > '
              html = html + '<button type="submit">Search</button>'
              html = html + '</form>'

              html = html + '<h2>Update list</h2>'
              html = html + '<p>Want to make a request, feel free to update your movies by adding and deleting titles!</p>'

              // Add Button
              html = html + '<div class="buttonwrapper">'
              html = html + '<button id="addbutton" type="button" onclick="switchAdd()">Add</button>'
              html = html + '</div>'

              // Delete Button
              html = html + '<div class="buttonwrapper">'
              html = html + '<button id="deletebutton" type="button" onclick="switchDelete()">Delete</button>'
              html = html + '</div>'

              html = html + '<br><br>'

              html = html + '<table id="movies">'
              html = html + '<tr class="headRow">'
              html = html + '<th>Movie</th>'
              html = html + '</tr>'

              var i = false;
              html = html + movies.map(function (d) {
                  if (d.title != '') {
                      var result = '<tr '
                      if (i) {
                          result = result + 'class="onRow"'
                      }
                      i = !i;
                      result = result + '> <td>'
                      result += '<a>'
                      result += d.title;
                      result += '</a></td>'
                      result += '<td style="min-width: 60px;"> <a class="linkbutton" onclick="editClick(this);"></a> </td>'
                      result += '</tr>'
                      return result;
                }
                else {
                  return ''
                }
              }).join(' ')
              html = html + '</table>'
              html = html + '<br><br>'
              html = html + '</div>'
              html = html + '</body>'
              html = html + '</html>'

              res.writeHead(200, {'Content-type': contentType})
              res.end(html, 'utf-8')
            }

            function sendFile(res, filename, contentType) {
              contentType = contentType || 'text/html'

              fs.readFile(filename, function(error, content) {
                res.writeHead(200, {'Content-type': contentType})
                res.end(content, 'utf-8')
              })

            }
