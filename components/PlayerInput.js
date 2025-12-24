class PlayerInput extends Component {
  constructor() {
    super();

    this.speed = 4;
  }

  start() {}
  
  update(dt) {
    let speedMult = nde.getKeyPressed("Run") ? 2 : 1;

    this.transform.pos.addV(new Vec(
      nde.getKeyPressed("Move Right") - nde.getKeyPressed("Move Left"),
      nde.getKeyPressed("Move Down") - nde.getKeyPressed("Move Up"),
    ).normalize().mul(this.speed * speedMult * dt));
  }

  from(data) {
    super.from(data);

    this.speed = data.speed;

    return this;
  }
}