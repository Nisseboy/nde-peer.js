class Duck extends Component {
  constructor() {
    super();
  }

  start() {
    this.lastPos = new Vec(0, 0);
    this.vel = new Vec(0, 0);
    
    this.audioSource = this.getComponent(AudioSource);
    this.sprite = this.getComponent(Sprite);

    this.sprite.tex = new StateMachineImg(
      new StateMachineNodeCondition(()=>{return (this.vel.x != 0 || this.vel.y != 0)}, 
        new StateMachineNodeResult(nde.tex["duck/walk"]),
        new StateMachineNodeResult(nde.tex["duck/1"]),
      )
    );

    //From "duck/walk" when thats the state
    this.on("step", (angle) => {
      this.transform.dir += angle;
      this.audioSource.play(nde.aud[`duck/step/${Math.floor(Math.random() * 4 + 1)}`]);
    })
  }
  
  update(dt) {
    this.vel.from(this.transform.pos).subV(this.lastPos).mul(1/dt);
    this.lastPos.from(this.transform.pos);

    this.sprite.speed = this.vel.mag() / 4;   
    
    if (this.vel.sqMag() != 0) {
      let diff = getDeltaAngle((Math.atan2(this.vel.y, this.vel.x)), this.transform.dir);
      this.transform.dir -= diff * 20 * dt;
    }        
  }
}