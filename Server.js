updateInterval = 1000/10;
maxPlayers = 12;
url = "nisseboy.github.io/nde-peer.js";

class Server extends ServerBase {
  constructor() {
    super();
  }

  init() {
    super.init();
    scenes.game.loadWorld(createWorld());

    this.on("connection", (id, conn) => {      
      let player = EntityDuck.copy();
      player.name += " " + id;
      player.id = id;

      this.fire("createEntity", id, world.id, player.serialize());
      this.send(id, "world", world.serialize());
    });
    this.on("disconnection", (id, conn) => {
      this.fire("removeEntity", id, id);
    });


    this.on("*", (eventName, senderId, ...args) => {
      this.sendOthers(senderId, eventName, ...args);
    });
  }

  //Runs on updateInterval
  update(dt) {

  }
  
}



function createWorld() {
  let player0 = EntityDuck.copy();
  player0.name += " 0";
  player0.id = 0;

  let w = new Ob({name: "root"}, [], [

    new Ob({name: "text", pos: new Vec(0, -4)}, [
      new TextRenderer("[w a s d shift], [arrow keys]", {}),
    ]),

    player0,
  ]);
  
  return w;
}