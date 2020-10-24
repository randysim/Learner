const Discord = require("discord.js");
const client = new Discord.Client();
const Fs = require("fs");
const Config = require("./config.js");

/* HANDLERS */
Fs.readdir("./Commands", (err, files) => {
    if (err) throw new Error(err);
    var Commands = [];

    files.forEach((file) => {
        Commands.push(require(`./Commands/${file}`));
    });
    client.commands = Commands;
});
Fs.readdir("./Events", (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
        var data = require(`./Events/${file}`);
        client.on(data.event, data.receive.bind(client));
    });
});

client.login(Config.TOKEN);
