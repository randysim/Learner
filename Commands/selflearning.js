const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["selflearning", "sfl"],
    execute(Env) {
        const message = Env.message;
        if (message.author.id != "325447731676184576") {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**Insufficient Permission**")
                .setDescription("No");
            return message.channel.send(ErrorEmbed);
        }

        var Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));
        Meta.selflearning = !Meta.selflearning;
        Fs.writeFileSync("./Training/Meta.json", JSON.stringify(Meta));

        if (Meta.selflearning) {
            let Embed = new Discord.MessageEmbed()
                .setTitle("**SUCCESS**")
                .setDescription("Self learning mode has been enabled");
            message.channel.send(Embed);
        } else {
            let Embed = new Discord.MessageEmbed()
                .setTitle("**SUCCESS**")
                .setDescription("Self learning mode has been disabled");
            message.channel.send(Embed);
        }
    }
}