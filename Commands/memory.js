const Discord = require("discord.js");
const MI = require("../Training/Interface.js");

module.exports = {
    names: ["memory"],
    async execute(Env) {
        const message = Env.message;
        var Memory = MI.memory();
        message.author.send(
            new Discord.MessageEmbed()
                .setTitle("**MEMORY**")
                .setDescription(
                    "Earliest to Latest in descending order" +
                        "\n\n" +
                        Memory.join("\n")
                )
                .setFooter("**LENGTH: " + Memory.length + "**")
        );
    },
};
