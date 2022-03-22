module.exports = {
  name: "play",
  description: "Joins and plays a video from youtube",
  enabled: false,

  async excecute(message, args) {
    const ytdl = require("ytdl-core");
    const ytsearch = require("yt-search");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "You need to be in a channel to excecute this command"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send("You dont have the correct permissions");
    if (!permissions.has("SPEAK"))
      return message.channel.send("You dont have the correct permissions");
    if (!args.length) return message.channel.send("Where are your arguments?");

    const connection = await voiceChannel.join();
    const videoFinder = async (query) => {
      const videoResult = await ytsearch(query);
      return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    };
    const video = await videoFinder(args.join(" "));

    if (video) {
      const stream = ytdl(video.url, { filter: "audioonly" });
      connection.play(stream, { seek: 0, volume: 1 }).on("finish", () => {
        voiceChannel.leave();
      });

      await message.reply(`Now playing ***${video.title}***`);
    } else {
      message.channel.send("No video found");
    }
  },
};
