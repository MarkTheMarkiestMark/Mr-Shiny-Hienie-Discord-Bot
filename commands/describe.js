module.exports = {
  name: "describe",
  description: "Describe someone or something with this command",
  enabled: true,
  excecute(message, args) {
    const owoify = require("owoify-js").default;
    const request = require("request");
    const cheerio = require("cheerio");
    const gingerbread = require("gingerbread");
    const fullarg = args.join(" ");
    message.channel.startTyping();
    request("https://randomword.com/adjective", (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let adjective = $(`#random_word`).html();
        let answer = "";

        if (!args.length) answer = `You are ${adjective}`;
        else answer = `${fullarg.toLowerCase()} is ${adjective}`;

        gingerbread(answer, function (error, text, result, corrections) {
          if (require(`../main`).getUwU()) {
            message.channel.send(owoify(result));
            console.log("UwU is enabled");
          } else {
            message.channel.send(result);
          }
        });
      }
    });
    message.channel.stopTyping();
  },
};
