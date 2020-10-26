const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["blacklist", "bl"],
    execute(Env) {
        const message = Env.message;
        if (message.author.id != "325447731676184576") {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**Insufficient Permission**")
                .setDescription("No");
            return message.channel.send(ErrorEmbed);
        }

        var Mentioned = message.mentions.members.first();
        if (!Mentioned) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("Please mention a user to blacklist");
            return message.channel.send(ErrorEmbed);
        }
        var Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));
        Meta.blacklisted.push(Mentioned.id);
        Fs.writeFileSync("./Training/Meta.json", JSON.stringify(Meta));

        let Embed = new Discord.MessageEmbed()
            .setTitle("**SUCCESS**")
            .setDescription("Blacklisted " + Mentioned);
        message.channel.send(Embed);
    }
}