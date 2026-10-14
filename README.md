# ChatApp

A room-based chat prototype with account sign-up, login, and live messages using Express, MySQL, and Socket.IO.

## What it does

- Renders sign-up and login pages with Handlebars.
- Stores user accounts through Sequelize and MySQL, with bcrypt password handling.
- Broadcasts messages and join/leave notices to a selected chat room.
- Shows the users currently connected to each room.

## Project status

This is a prototype based on [TalkIO](https://github.com/samvillafana/talk-io), as recorded in `package.json`. Rooms and connected users are held in memory. The Socket.IO handlers accept client-supplied usernames and rooms; this is not a verified private messaging system.

## Getting started

Use Node.js, npm, and a local MySQL database. Create a `.env` file with the configuration names used by the source:

```dotenv
DB_NAME=talkio_db
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_SECRET_SESSION=replace_with_a_random_session_secret
PORT=3001
```

Alternatively, `JAWSDB_URL` can provide the database connection. Do not commit real credentials.

```bash
npm install
```

Before startup, resolve the missing `moment` dependency: `utils/messages.js` imports it, but `package.json` does not declare it.

Create the database named in `DB_NAME`. `db/schema.sql` provides a schema initialization script, but it **drops an existing `talkio_db` database** before recreating it. Use it only for a disposable development database.

```bash
npm start
```

The server defaults to `http://localhost:3001` and creates missing Sequelize tables on startup. Sign up, log in, and open the chat through the application's room selection flow. Use two browser sessions to explore room messaging after setup is repaired.

## Files

| Path | Purpose |
| --- | --- |
| `server.js` | Express app, session store, and Socket.IO handlers |
| `controllers/` | Page and account routes |
| `models/` | Sequelize user and message models |
| `config/connection` | MySQL connection configuration |
| `views/` | Handlebars pages |
| `Public/` | Browser scripts, styles, and images |
| `seeds/` | Development sample users |

Existing screenshot: [chat room](Public/images/room1.png).

## Available checks and limitations

`npm test` is a placeholder that exits with an error; there is no implemented automated suite.

`npm run seed` recreates Sequelize tables with `force: true` and replaces development data. The message creation route references `Message` without importing it, so database message persistence needs repair. Live room broadcasting does not establish durable chat history. Session cookies currently expire after 30 seconds.

## License and attribution

See the [MIT license](LICENSE), copyright **2023 Samuel villafana**. The original package metadata points to [samvillafana/talk-io](https://github.com/samvillafana/talk-io). `package.json` says ISC, which conflicts with the included MIT license and needs clarification by the owner.
