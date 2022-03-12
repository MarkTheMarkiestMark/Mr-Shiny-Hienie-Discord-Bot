module.exports = {
  name: "describenoun",
  description: "Describe someone or something with a noun!",
  excecute(message, args) {
    const request = require("request");
    const cheerio = require("cheerio");
    const gingerbread = require("gingerbread");
    let adjnoun = "";
    const fullarg = args.join(" ");
    message.channel.sendTyping();
    request("https://randomword.com/adjective", (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let adjective = $(`#random_word`).html();
        adjnoun += adjective + " ";
        //console.log(adjective);

        request("https://randomword.com/noun", (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let noun = $(`#random_word`).html();
            adjnoun += noun + " ";
            //console.log(noun);
            let answer = "";
            //for some reason it wouldn't send anything if message.channel.send was outside a request ¯\_(ツ)_/¯
            if (!args.length) answer = `You are a ${adjnoun}`;
            else answer = `${fullarg.toLowerCase()}is a ${adjnoun}`;

            gingerbread(answer, function (error, text, result, corrections) {
              message.channel.send(result);
            });
          }
        });
      }
    });
  },
};
