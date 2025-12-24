class Tracker extends Component {
  constructor() {
    super();
  }

  start() {
    this.oldPos = this.transform.pos.copy();
    this.oldDir = this.transform.dir;
  }
  
  update(dt) {
    if (!this.transform.pos.isEqualTo(this.oldPos) || this.oldDir != this.transform.dir) {
      this.oldPos.from(this.transform.pos);
      this.oldDir = this.transform.dir;

      client.sendLater("p", this.ob.id, this.oldPos, this.oldDir);
    }
  }
}