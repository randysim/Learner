module.exports = {
    event: "ready",
    async receive() {
        console.log("Bot is now on!");
        this.user.setActivity("Ready to Learn!");
    },
};
