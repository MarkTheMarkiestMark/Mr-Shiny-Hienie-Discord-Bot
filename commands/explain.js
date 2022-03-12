module.exports = {
  name: "explain",
  description: "Explain someone or something!",
  excecute(message, args) {
    const request = require("request");
    const cheerio = require("cheerio");
    let fullarg = "";
    message.channel.sendTyping();
    for (var i = 0; i < args.length; i++) {
      fullarg += args[i] + " ";
    }
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
                if (!args.length)
                  message.channel.send(
                    `${noun} is ${adjective} because of ${noun2}`
                  );
                else
                  message.channel.send(
                    `${fullarg}is ${adjective} because of ${noun2}`
                  );
              }
            });
          }
        });
      }
    });
  },
};
