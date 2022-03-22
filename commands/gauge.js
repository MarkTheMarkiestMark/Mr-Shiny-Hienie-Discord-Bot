module.exports = {
  name: "gauge",
  description:
    "gauge someone or something \n example: `-gauge Bigweld Sexy`\nexample 2:`-gauge My brain /filled with information`",
  enabled: true,
  excecute(message, args) {
    const gingerbread = require("gingerbread");
    let randomNum = Math.floor(Math.random() * 101);
    let fullarg = args.join(" ");
    let arguments = "";
    if (!fullarg.includes("/")) {
      for (let i = 0; i < args.length - 1; i++) {
        arguments += args[i] + " ";
      }
      let answer = `${arguments}is ${randomNum}% ${args[args.length - 1]}`;
      if (!args.length || args.length < 2) {
        message.channel.send("Missing arguments!");
        return;
      }
      gingerbread(answer, function (error, text, result, corrections) {
        message.channel.send(result);
      });
    } else {
      //splits arguments
      arguments = fullarg.split("/");
      answer = `${arguments[0]}is ${randomNum}% ${arguments[1]}`;
      if (!args.length || args.length < 2) {
        message.channel.send("Missing arguments!");
        return;
      }
      gingerbread(answer, function (error, text, result, corrections) {
        message.channel.send(result);
      });
    }
  },
};
