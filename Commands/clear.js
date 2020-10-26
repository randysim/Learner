const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["clear"],
    execute(Env) {
        const message = Env.message;
        const args = Env.args;

        if (message.author.id != "325447731676184576") {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**Insufficient Permission**")
                .setDescription("No");
            return message.channel.send(ErrorEmbed);
        }

        if (args[1] != "confirm") {
            return message.channel.send(
                "Please type confirm as the first argument to clear dataset."
            );
        }

        Fs.writeFileSync("./Convo/Dataset.json", JSON.stringify({
            "greeting": {
                "patterns": [],
                "responses": []
            },
            "goodbye": {
                "patterns": [],
                "responses": []
            },
            "insult": {
                "patterns": [],
                "responses": []
            },
            "compliment": {
                "patterns": [],
                "responses": []
            }
        }));
        Fs.writeFileSync(
            "./Convo/Stats.json",
            JSON.stringify({
                "greeting": 0,
                "goodbye": 0,
                "insult": 0,
                "compliment": 0,
                "users": {}
            })
        );

        const Embed = new Discord.MessageEmbed()
            .setTitle("**SUCCESS**")
            .setDescription("Data has been wiped");
        message.channel.send(Embed);
    },
};
