const Config = require("../config.js");
const MI = require("../Training/Interface.js");

/* MODULES */

module.exports = {
    event: "message",
    async receive(message) {
        /* ERROR */
        if (message.author.bot) return;
        if (
            message.member &&
            message.member.roles.cache.find(
                (r) => r.id == Config.Roles["Pending"]
            )
        )
            return;

        if (message.content.startsWith(Config.PREFIX)) {
            // Command Variables
            var Env = {
                client: this,
                message: message,
                args: message.content
                    .substr(Config.PREFIX.length)
                    .toLowerCase()
                    .split(" "),
            };

            // Executor
            for (let Command of this.commands) {
                if (Command.names.includes(Env.args[0]))
                    return Command.execute(Env);
            }
        }
        if (message.channel.id == "722621224470970370") {
            MI.receive(message);
        }
    },
};
