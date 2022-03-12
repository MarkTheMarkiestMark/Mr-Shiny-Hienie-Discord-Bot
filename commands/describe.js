module.exports = {
  name: "describe",
  description: "Describe someone or something with this command",
  excecute(message, args) {
    const request = require("request");
    const cheerio = require("cheerio");
    const gingerbread = require("gingerbread");
    const fullarg = args.join(" ");
    message.channel.sendTyping();
    request("https://randomword.com/adjective", (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let adjective = $(`#random_word`).html();
        //console.log(adjective);
        let answer = "";

        if (!args.length) answer = `You are ${adjective}`;
        else answer = `${fullarg.toLowerCase()}is ${adjective}`;

        gingerbread(answer, function (error, text, result, corrections) {
          message.channel.send(result);
        });
      }
    });
  },
};
