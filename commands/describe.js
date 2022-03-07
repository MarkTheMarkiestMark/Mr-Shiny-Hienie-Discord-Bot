module.exports = {
  name: "describe",
  description: "describe",
  excecute(message, args) {
    const request = require("request");
    const cheerio = require("cheerio");
    request("https://randomword.com/adjective", (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let adjective = $(`#random_word`).html();
        //console.log(adjective);
        if (!args.length) message.channel.send(`You are ${adjective}`);
        else message.channel.send(`${args[0]} is ${adjective}`);
      }
    });
  },
};
