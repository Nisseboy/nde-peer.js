let idLookup;

class SceneGame extends Scene {
  constructor() {
    super();

    this.cam = new Camera(new Vec(0, 0));
    this.cam.w = 16;
    this.cam.renderW = nde.w;
  }

  setupListeners() {
    client.on("world", world => {
      this.loadWorld(cloneData(world));
    });

    client.on("createEntity", (parentId, entity) => {
      let e = cloneData(entity);
      idLookup[parentId].appendChild(e);
      idLookup[e.id] = e;      
    });
    client.on("removeEntity", (entityId) => {
      idLookup[entityId]?.remove();
      delete idLookup[entityId];
    });

    //Position entity smoothly
    client.on("p", (entityId, pos, dir) => {      
      let e = idLookup[entityId];

      let diffPos = new Vec().from(pos).subV(e.transform.pos).mul(1000/updateInterval);
      let diffDir = getDeltaAngle(dir, e.dir) / updateInterval;
      
      if (e.pTimer) e.pTimer.stop();
      let lastDt = 1;
      e.pTimer = new TimerTime(updateInterval * 0.001, (dt) => {
        e.transform.pos.addV(diffPos.mul(dt / lastDt))
        e.dir += diffDir * dt;

        lastDt = dt;
      });
      
    });
    //Set properties of entity
    client.on("set", ( entityId, path, value) => { 
      let e = idLookup[entityId];
      let steps = path.split(".");
      for (let i = 0; i < steps.length - 1; i++) {
        e = e[steps[i]];
      }
      e[steps[steps.length - 1]] = value;
      if (value.type) e[steps[steps.length - 1]] = cloneData(value);
    });
  }
  loadWorld(w) {
    this.world = w;    

    idLookup = this.world.createLookupTable();

    this.player = idLookup[client.id];
    this.player.addComponent(
      new PlayerInput(),
      new Tracker(),
    );
  }

  start() {
    
  }

  inputdown(key) {
    if (nde.getKeyEqual(key,"Pause")) {
      nde.transition = new TransitionSlide(scenes.mainMenu, new TimerTime(0.2));
    }
  }
  inputup(key) {
    
  }

  update(dt) {  
    this.world.update(dt);

    this.cam.pos.from(this.player.transform.pos);
    moveListener(this.cam.pos);
  }

  render() {
    let cam = this.cam;
    cam.renderW = nde.w;


    renderer._(()=>{
      renderer.set("fill", "rgb(100, 100, 50)");
      renderer.rect(vecZero, new Vec(nde.w, nde.w / 16 * 9));
    });



    cam._(renderer, () => {
      this.world.render();
    });
  }
}