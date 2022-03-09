module.exports = {
  name: "describe",
  description: "Describe someone or something with this command",
  excecute(message, args) {
    const request = require("request");
    const cheerio = require("cheerio");
    let fullarg = "";
    for (var i = 0; i < args.length; i++) {
      fullarg += args[i] + " ";
    }
    request("https://randomword.com/adjective", (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let adjective = $(`#random_word`).html();
        //console.log(adjective);
        if (!args.length) message.channel.send(`You are ${adjective}`);
        else message.channel.send(`${fullarg}is ${adjective}`);
      }
    });
  },
};
