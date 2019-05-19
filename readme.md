FrameDB is a community-maintained frame database for Tekken7. By design it will be viewable by all visitors and editable by anyone with a mod account, which will be by invite only (only current mods can generate accounts for new members).

--Installation--

1. The data is stored in a MongoDB database and you will therefore need Mongodb installed on your machine.

https://docs.mongodb.com/manual/installation/

2. Run npm install

3. Navigate to './util/db.js' and un-comment the initializeDb function. Place the following line of code in the file:

setTimeout(initializeDb, 5000);

This ensures that the database has time to start up, after which it will read each file in './character-data' and generate a document for
the character within the "characters" collection of the "T7Movelists" database.

4. Now that the database is populated, remove the setTimeout line and run npm start.

--Use--

Fetching to the endpoint 'http://localhost:3000/tekken7' will return the index page from which you can navigate to any character's frame data.

Fetching directly to 'http://localhost:3000/tekken7/:character' will display a sortable movelist, allowing the user to publish changes to the move by clicking the icon to the right.

//TODO: Implement user authentication and authorization for publishing privileges.
Fetching to http://localhost:3000/dev/tekken7' or 'http://localhost:3000/dev/tekken7/:character' will instead return JSON data for all characters or a specified character, respectively, effectively serving as a T7 API.
