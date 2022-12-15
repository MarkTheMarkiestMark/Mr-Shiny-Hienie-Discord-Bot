module.exports = {
  name: "dare",
  description: "I dare you to...",
  enabled: true,
  excecute(message, args) {
    const owoify = require("owoify-js").default;
    const request = require("request");
    const cheerio = require("cheerio");
    const gingerbread = require("gingerbread");
    const fullarg = args.join(" ");
    message.channel.startTyping();
    request("https://randomword.com/verb", (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let verb = $(`#random_word`).html();
        //console.log(adjective);

        request("https://randomword.com/noun", (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let noun = $(`#random_word`).html();
            let answer = "";
            //for some reason it wouldn't send anything if message.channel.send was outside a request ¯\_(ツ)_/¯
            if (!args.length) answer = `I dare you to ${verb} ${noun}`;
            else answer = `I dare ${fullarg.toLowerCase()} to ${verb} ${noun}`;
            console.log(answer);
            if (require(`../main`).getUwU()) {
              message.channel.send(owoify(answer));
              console.log("UwU is enabled");
            } else {
              message.channel.send(answer);
            }
          }
        });
      }
    });
    message.channel.stopTyping();
  },
};
