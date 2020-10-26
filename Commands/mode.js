const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["mode"],
    execute(Env) {
        const message = Env.message;
        const args = Env.args;

        if (message.author.id != "325447731676184576") {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**Insufficient Permission**")
                .setDescription("No");
            return message.channel.send(ErrorEmbed);
        }

        if (!args[1]) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("Specify mode [pattern, response]");
            return message.channel.send(ErrorEmbed);
        }

        if (!["pattern", "response"].includes(args[1])) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("mode can only be [pattern, response]");
            return message.channel.send(ErrorEmbed);
        }

        var Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));
        Meta.type = args[1];
        Fs.writeFileSync("./Training/Meta.json", JSON.stringify(Meta));
        const Embed = new Discord.MessageEmbed()
            .setTitle("**SUCCESS**")
            .setDescription("Successfully changed mode");
        message.channel.send(Embed);
    }
}