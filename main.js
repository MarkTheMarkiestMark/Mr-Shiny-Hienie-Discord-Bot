require("dotenv").config();
const { channel } = require("diagnostics_channel");
const Discord = require("discord.js");

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
const sqlite = require("sqlite3").verbose();
const fs = require("fs");
const sqlite3 = require("sqlite3");

const prefix = "-";

client.command = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.command.set(command.name, command);
}

client.once("ready", () => {
  console.log("Mr. Shiny Pants is Online");
});
client.on(`ready`, () => {
  console.log("online");
  let db = new sqlite.Database(
    "./socialcredit.db",
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS data(userid INTEGER NOT NULL, username TEXT NOT NULL, score INTEGER)`
  );
});
client.on(`messageCreate`, (message) => {
  let msg = message.content.toLowerCase();
  let userid = message.author.id;
  let uname = message.author.tag;
  if (message.author.bot) return;
  let db = new sqlite.Database("./socialcredit.db", sqlite.OPEN_READWRITE);

  let query = `SELECT * FROM data WHERE userid = ?`;
  db.get(query, [userid], (err, row) => {
    message.channel.sendTyping();
    if (err) {
      console.log(err);
      return;
    }
    if (row === undefined) {
      let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?)`);
      insertdata.run(userid, uname, 0);
      //let score = row.score;
      insertdata.finalize();
      db.close();
      return;
    } else {
      db.run(`UPDATE data SET score = ? WHERE userid = ?`, [
        row.score + 1,
        userid,
      ]);
      //db.close();
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === "socialcredit") {
      query = `SELECT * FROM data WHERE userid = ?`;
      db.get(query, [userid], (err) => {
        if (err) {
          throw err;
        }
        message.channel.send(
          "BING CHILLING! Your social credit score is " +
            (row.score + 1).toString()
        );
        //console.log('your social credit is ' + (row.score+1).toString());
      });
      db.close();
    } else if (command === "leaderboard") {
      query = `SELECT username, score FROM data ORDER BY score DESC`;
      db.all(query, [], (err, rows) => {
        if (err) {
          throw err;
        }
        let leaderboard = "";
        rows.forEach((row) => {
          let usernameCut = row.username.substring(
            0,
            row.username.indexOf("#")
          );
          leaderboard += usernameCut + ": " + row.score + "\n";
        });
        message.channel.send(leaderboard);
        //console.log(leaderboard);
        db.close();
      });
    } else if (command === "transfer") {
      const mention = message.mentions.users.first();

      query = `SELECT * FROM data WHERE userid = ?`;
      db.get(query, [mention], (err) => {
        if (err) {
          throw err;
        }
        //console.log('your social credit is ' + (row.score+1).toString());
      });
      if (!args.length) {
        message.channel.send("No arguments!");
      }
    }
  });
});

client.on("messageCreate", (message) => {
  message.member.roles.cache;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "bing") {
    client.command.get("bing").excecute(message, args);
  } else if (command === "help") {
    client.command.get("help").excecute(message, args, client.command);
  } else if (command === "describe") {
    client.command.get("describe").excecute(message, args);
  } else if (command === "describenoun") {
    client.command.get("describenoun").excecute(message, args);
  } else if (command === "explain") {
    client.command.get("explain").excecute(message, args);
  }
  //else if(command === 'socialcredit'){
  //     client.command.get('socialcredit').excecute(message,args);
  // }
});

client.login(process.env.BOT_TOKEN);
