module.exports = {
  name: "explain",
  description: "Explain someone or something!",
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
        request("https://randomword.com/noun", (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let noun = $(`#random_word`).html();
            //console.log(adjective);

            request("https://randomword.com/noun", (error, response, html) => {
              if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let noun2 = $(`#random_word`).html();
                //console.log(noun);
                //for some reason it wouldn't send anything if message.channel.send was outside a request ¯\_(ツ)_/¯

                let answer = "";
                if (!args.length)
                  answer = `${noun} is ${adjective} because of ${noun2}`;
                else
                  answer = `${fullarg.toLowerCase()} is ${adjective} because of ${noun2}`;

                gingerbread(
                  answer,
                  function (error, text, result, corrections) {
                    message.channel.send(result);
                  }
                );
              }
            });
          }
        });
      }
    });
  },
};
