const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

let songs = [
    {
        rank: 355, 
        artist: 'Ke$ha', 
        track: 'Tik-Toc', 
        published: '1/1/2009'
    },
    {
        rank: 356, 
        artist: 'Gene Autry', 
        track: 'Rudolph, the Red-Nosed Reindeer', 
        published: '1/1/1949'
    },
    {
        rank: 357, 
        artist: 'Oasis', 
        track: 'Wonderwall', 
        published: '1/1/1996'
    }
];

// new stuff below
router.get('/', (req, res) => {
    // res.send(songs);
    let queryText = 'SELECT * FROM "songs" ORDER BY "rank";';
    pool.query(queryText)
        .then((result) =>{
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('AY! error in GET query', error);
            res.sendStatus(500);
        })
});





// how to get stuff using params from a table of songs
// example: /songs/id/3

// router.get('/:id', (req, res) => {
//     // res.send(songs);
//     let idToGet = req.params.id; // same as in URL
//     let queryText = 'SELECT * FROM "songs" WHERE "id" = $1 ;';
//     pool.query(queryText, [idToGet])
//         .then((result) =>{
//             res.send(result.rows);
//         })
//         .catch((error) => {
//             console.log('AY! error in GET query', error);
//             res.sendStatus(500);
//         })
// });





// how to get stuff using params from a table of artists
// example: /songs/artist/Mahmoud
// this wont get hit in this project file because it dont exist
router.get('/artists/:artist', (req, res) => {
    // res.send(songs);
    let artistToGet = req.params.artist; // same as in URL
    let queryText = 'SELECT * FROM "songs" WHERE "artist" = $1 ;';
    pool.query(queryText, [artistToGet])
        .then((result) =>{
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('AY! error in GET query', error);
            res.sendStatus(500);
        })
});




router.post('/', (req, res) => {
    // songs.push(req.body);
    // res.sendStatus(200);
    // new stuff below
    const newSong = req.body;
    const queryText = `
        INSERT INTO "songs" ("artist", "track", "published", "rank")
        VALUES ($1, $2, $3, $4);
    `;
    // INSERT INTO "songs" ("artist", "track", "published", "rank")
    pool.query(queryText, [newSong.artist, newSong.track, newSong.published, newSong.rank])
    .then((result)=>{
        res.sendStatus(201);
    }).catch((error)=>{
        console.log('AY! error posting to db', error);
        res.sendStatus(500)
    })
});


router.delete('/:id', (req, res) => {
    let reqId = req.params.id
    console.log(`A delete request has been sent for ID ${reqId}`);
    let queryText = 'DELETE FROM "songs" WHERE "id" = $1;';
    pool.query(queryText, [reqId])
        .then(() =>{
            console.log('song deleted');
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(`AY! error deleting with query ${queryText}: ${error}`);
            res.sendStatus(500); // a good server always responds
        })
});

//change rank on a song
router.put('/rank/:id', (req, res) => {
    let songId = req.params.id;
    // expect direction to be up or down
    let direction = req.body.direction;

    let queryText;
    if(direction === 'up'){
        queryText = 'UPDATE "songs" SET rank = rank-1 WHERE "id" = $1;';
    }else if(direction === 'down'){
        queryText = 'UPDATE "songs" SET rank = rank+1 WHERE "id" = $1;';
    }else{
        // if we dont get an expected direction
        res.sendStatus(500)
        return;
    }

    pool.query(queryText, [songId])
    .then((dbResponse)=>{
        res.send(dbResponse.rows)
    })
    .catch((error)=>{
        console.log(`AY! error updating with query ${queryText}: ${error}`);
        res.sendStatus(500);
    })
})

module.exports = router;
    // VALUES ('Paul Simon', 'Graceland', '1986-10-25', 5); DELETE FROM "songs";--"")