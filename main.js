require("dotenv").config();
//declaring variables
const Discord = require("discord.js");

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
const sqlite = require("sqlite3").verbose();
const fs = require("fs");
const sqlite3 = require("sqlite3");
let uwu = false;

const prefix = "-";

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

//loop through all commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  //skip command if its disabled
  if (!command.enabled) continue;
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  //check if he's alive
  console.log("Mr. Shiny Pants is Online");
  //create new database
  let db = new sqlite.Database(
    "./socialcredit.db",
    sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS data(userid INTEGER NOT NULL, username TEXT NOT NULL, score INTEGER)`
  );
});
//uwu shit
client.on(`message`, (message) => {
  if (message.content.toLowerCase().includes("jackson") && !uwu) {
    uwu = true;
    setTimeout(function () {
      uwu = false;
    }, 1000 * 300); //sets timer for five minutes
  }
});
const getUwU = () => {
  return uwu;
};

//SOCIAL CREDIT
client.on(`message`, (message) => {
  //declaring variables
  let msg = message.content.toLowerCase();
  let userid = message.author.id; //discord id
  let uname = message.author.tag; //username
  if (message.author.bot) return; //ignore messages from bots
  //store database in a variable
  let db = new sqlite.Database("./socialcredit.db", sqlite.OPEN_READWRITE);
  //select everything that matches the user's userid
  let query = `SELECT * FROM data WHERE userid = ?`;
  db.get(query, [userid], (err, row) => {
    if (err) {
      console.log(err);
      return;
    }
    //check if the data doesn't exist
    if (row === undefined) {
      //insert the appropriate data into the database
      let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?)`);
      insertdata.run(userid, uname, 0);
      insertdata.finalize();
      db.close();
      return;
    } else {
      //update the user's social credit when they send a message
      db.run(`UPDATE data SET score = ? WHERE userid = ?`, [
        row.score + 1,
        userid,
      ]);
    }
    //command handling
    //MOVE TO SEPERATE COMMANDS
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === "socialcredit") {
      //get the data from the db
      query = `SELECT * FROM data WHERE userid = ?`;
      db.get(query, [userid], (err) => {
        if (err) {
          throw err;
        }
        //send their social credit score
        message.channel.send(
          "BING CHILLING! Your social credit score is " +
            (row.score + 1).toString()
        );
      });
      db.close();
    } else if (command === "leaderboard") {
      //select select the user name and socialcredit score and sort by descending order
      query = `SELECT username, score FROM data ORDER BY score DESC`;
      db.all(query, [], (err, rows) => {
        if (err) {
          throw err;
        }
        let leaderboard = "";
        //cut the username number from string
        //example: MrShinyHienie#2342 ==> MrShinyHienie
        rows.forEach((row) => {
          let usernameCut = row.username.substring(
            0,
            row.username.indexOf("#")
          );
          leaderboard += usernameCut + ": " + row.score + "\n";
        });
        message.channel.send(leaderboard);
        db.close();
      });
    }
    //AIN'T FINISHED YET
    else if (command === "transfer") {
      const mention = message.mentions.users.first();

      query = `SELECT * FROM data WHERE userid = ?`;
      db.get(query, [mention], (err) => {
        if (err) {
          throw err;
        }
      });
      if (!args.length) {
        message.channel.send("No arguments!");
      }
    }
  });
});

client.on("message", (message) => {
  //ignore messages that are sent by bots or missing the prefix -
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  //exits method if the command isn't valid
  if (!client.commands.has(command)) return;
  //try and run the command
  try {
    client.commands.get(command).excecute(message, args, client.commands, uwu);
  } catch (error) {
    //print an error message if there was an error
    console.log(error);
    message.reply("Command's Got an Error :(");
  }
});
module.exports = {
  getUwU,
};
client.login(process.env.BOT_TOKEN);
