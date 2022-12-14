module.exports = {
  name: "ask",
  description: "yes or no",
  enabled: true,
  excecute(message, args) {
    let answer = Math.floor(Math.random() * 2);
    console.log(answer);
    if (answer == 1) {
      message.channel.send("Yes");
    } else {
      message.channel.send("No");
    }
  },
};
