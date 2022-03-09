module.exports = {
  name: "help",
  description: "Help me",
  excecute(message, args, commands) {
    let commandList = "";
    commands.forEach((command) => {
      commandList += "`-" + command.name + "`  " + command.description + "\n";
    });
    commandList +=
      "`-socialcredit`  Display your social credit \n `-leaderboard`  See the social credit leaderboard";
    message.channel.send(commandList);
  },
};
