updateInterval = 1000/10;
maxPlayers = 12;

class Server extends ServerBase {
  constructor() {
    super();

    this.idLookup = undefined;
    this.world = undefined;

    this.createWorld();
  }

  init() {
    super.init();

    this.on("connection", (id, conn) => {      
      let player = new Ob({
        name: "Player " + id,
        id: id,
      }, [
        new Sprite("duck/1"),
        new Duck(),
        new AudioSource(),
      ]);

      this.fire("createEntity", id, this.world.id, player.serialize());
      this.send(id, "world", this.world.serialize());
    });
    this.on("disconnection", (id, conn) => {
      this.fire("removeEntity", id, id);
    });


    this.on("createEntity", (senderId, parentId, entity) => {
      let e = cloneData(entity);
      this.idLookup[parentId].appendChild(e);
      this.idLookup[e.id] = e;      

      this.sendOthers(senderId, "createEntity", parentId, entity);
    });
    this.on("removeEntity", (senderId, entityId) => {
      this.idLookup[entityId]?.remove();
      delete this.idLookup[entityId];

      this.sendOthers(senderId, "removeEntity", entityId);
    });


    //Position entity
    this.on("p", (senderId, entityId, pos, dir) => {          
      let e = this.idLookup[entityId];
      e.transform.pos.from(pos);
      e.dir = dir;

      this.sendOthers(senderId, "p", entityId, pos, dir);
    });
    //Set properties of entity
    this.on("set", (senderId, entityId, path, value) => { 
      let e = this.idLookup[entityId];
      let steps = path.split(".");
      for (let i = 0; i < steps.length - 1; i++) {
        e = e[steps[i]];
      }
      e[steps[steps.length - 1]] = value;
      if (value.type) e[steps[steps.length - 1]] = cloneData(value);
      
      this.sendOthers(senderId, "set", entityId, path, value);
    });
  }


  createWorld() {
    this.world = new Ob({name: "root"}, [], [

      new Ob({name: "text", pos: new Vec(0, -4)}, [
        new TextRenderer("[w a s d shift], [arrow keys]", {}),
      ]),

    ]);
    this.idLookup = this.world.createLookupTable();
  }
}