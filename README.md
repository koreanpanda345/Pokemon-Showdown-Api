# Pokemon Showdown API
This is the unofficial Pokemon Showdown API package. Its more of a client library, than api, but just go with it for now.

```js
const {PokemonShowdownClient} = require("pokemon-showdown-api");

const client = new PokemonShowdownClient({
	server: "showdown",
	ip: "sim.smogon.com",
	port: 8000,
	credentials: {
		username: "YOUR_CLIENT_USERNAME",
		password: "YOUR_CLIENT_PASSWORD"
	}
});

client.on("ready", (data) => {
	console.log("Client is online");
});

client.on("message", (message) => {
	if(message.content.toLowerCase().trim().startsWith("!")) {
		if(message.content.toLowerCase().trim() === "!ping") {
			message.send(message.by, "pong");
		}
	}
})


client.connect();
```

# Events
### noinit

### init

### ready
When the client is ready.
### message
when the client receives a message.
### battle
when the client is in a battle.
### updateuser
when the client receives data for a user that was updated.
### pm
when the client recevies a private message.

# Joining a battle

```js
client.joinBattle("battle_id");

client.on("battle", (data) => {
	console.log(data);
	if(data.startsWith("|win|")) {
		console.log("Leaving Battle");
		client.leaveBattle("battle_id");
	}
});
```

