// The function, populateDatabase(), does exactly what you think it does, it populates the pouchDB local DB with 'dummy' data
// to simulate actual users.

function populateDatabase() {
    for (let i = 0; i < DUMMY_ENTRIES; i++) {
        let newDoc = { // We define a new 'doc' JSON object with randomized geolocational data
            _id: "Song_name_" + i,
            "Recent Songs": "api",
            "Playlists": "api", //axel: fixed Playslists to Playlist, hope that didnt break anything!
            "Displayname": "api",
            "location" : {
                "latitude" : (Math.random() * 180) - 90,
                "longitude" : (Math.random() * 360) - 180,
            },
            "friends list": "Internal file",
            "mood": "api",
        }

        // Here we push it into the pouchDB, leaving us with DUMMY_ENTRIES number of entries in our database.

        db.put(newDoc).then((response) => { 
            console.log(response);
        }).catch((err) => {
            return;
        });
    }
}

// This asynchronous function finds all listeners i.e. returns a promise whose resolved value (promise.then((value)))
// is a JSON representation of all users within the DB, probably not good for scaling, but it will work for now.

// ISSUE: Scaling is scary :(

async function findAllListeners() {
    try {
        var result = await db.allDocs({
            include_docs: true,
            attachments: true,
        });
    } catch (err) {
        console.log(err);
    }
    return result;
}

// The function below updates the pouchDB entries by modifying only their geolocational data by completely 
// randomizing it, not the best but its what we got going.

function periodicDBUpdate() {
    for (let i = 0; i < DUMMY_ENTRIES; i++) {
        db.get('Song_name_' + i).then((doc) => {
            doc.location = {
                "latitude" : (Math.random() * 180) - 90,
                "longitude" : (Math.random() * 360) - 180,
            };
            return db.put(doc);
        });
    }
}