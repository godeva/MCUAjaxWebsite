var sql = require('sqlite3');


var db = new sql.Database('MCUmovies.db', function (err) {
    if (err) {
        console.error("Could not create database.");
    }
    else {
        console.log("Built MCUmovies database.")
    }
});

db.serialize(function () {
    db.run("CREATE TABLE MCUmovies (title varchar(300))");

    db.run("INSERT INTO MCUmovies VALUES ('Iron Man')");
    db.run("INSERT INTO MCUmovies VALUES ('The Incredible Hulk')");
    db.run("INSERT INTO MCUmovies VALUES ('Iron Man 2')");
    db.run("INSERT INTO MCUmovies VALUES ('Thor')");
    db.run("INSERT INTO MCUmovies VALUES ('Captain America: The First Avenger')");
    db.run("INSERT INTO MCUmovies VALUES ('The Avengers')");
    db.run("INSERT INTO MCUmovies VALUES ('Iron Man 3')");
    db.run("INSERT INTO MCUmovies VALUES ('Thor: The Dark World')");
    db.run("INSERT INTO MCUmovies VALUES ('Captain America: The Winter Soldier')");
    db.run("INSERT INTO MCUmovies VALUES ('Guardians of the Galaxy')");
    db.run("INSERT INTO MCUmovies VALUES ('Avengers: Age of Ultron')");
    db.run("INSERT INTO MCUmovies VALUES ('Ant-Man')");
    db.run("INSERT INTO MCUmovies VALUES ('Captain America: Civil War')");
    db.run("INSERT INTO MCUmovies VALUES ('Doctor Strange')");
    db.run("INSERT INTO MCUmovies VALUES ('Guardians of the Galaxy Vol. 2')");
    db.run("INSERT INTO MCUmovies VALUES ('Spider-Man: Homecoming')");

    db.each("SELECT title FROM MCUmovies", function (err, row) {
        console.log(row.title);
    });
});

db.close();
