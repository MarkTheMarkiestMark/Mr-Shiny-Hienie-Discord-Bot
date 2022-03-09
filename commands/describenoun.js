module.exports = {
  name: "describenoun",
  description: "Describe someone or something with a noun!",
  excecute(message, args) {
    const request = require("request");
    const cheerio = require("cheerio");
    let adjnoun = "";
    let fullarg = "";
    for (var i = 0; i < args.length; i++) {
      fullarg += args[i] + " ";
    }
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
            //for some reason it wouldn't send anything if message.channel.send was outside a request ¯\_(ツ)_/¯
            if (!args.length) message.channel.send(`You are a ${adjnoun}`);
            else message.channel.send(`${fullarg}is a ${adjnoun}`);
          }
        });
      }
    });
  },
};
