/// <reference path="../node_modules/excalibur/dist/excalibur.d.ts" />

var cell_size = 37.5;
var board_width = 1200;
var board_height = 900;

enum Direction {
    Up,
    Left,
    Down,
    Right
}

var game = new ex.Engine({
    width: board_width,
    height: board_height,
    backgroundColor: ex.Color.fromRGB(0,0,0) 
});

function getRandomColor(): ex.Color {
    //let r: number = Math.floor(Math.random() * 256);
    //let g: number = Math.floor(Math.random() * 256);
    //let b: number = Math.floor(Math.random() * 256);
    // return ex.Color.fromRGB(r, g, b);
    let palette: ex.Color[] = [
        ex.Color.fromRGB(143, 0, 242),
        ex.Color.fromRGB(0, 207, 251),
        ex.Color.fromRGB(92, 255, 0),
        ex.Color.fromRGB(253, 251, 0),
        ex.Color.fromRGB(253, 174, 50),
        ex.Color.fromRGB(255, 12, 18)
    ] 
    return palette[Math.floor(Math.random() * palette.length)];
}

class Fruit extends ex.Actor {
    constructor(x: number, y: number, w: number, h:number) {
        super(x, y, w, h, ex.Color.Red);
        this.body.collider.type = ex.CollisionType.Active;
        this._move()
        this.on('collisionstart', (evt: ex.CollisionStartEvent) => {
            console.log('Fruit collision detected')
            if (!(evt.other instanceof Fruit)) {
                this._move();
            }
        })
    }

    private _move() {
        let rows: number = board_height / cell_size;
        let columns: number = board_width / cell_size;
        let new_row = Math.floor(Math.random() * rows);
        let new_column = Math.floor(Math.random() * columns);
        this.pos.x = (new_column * cell_size) + cell_size/2;
        this.pos.y = (new_row * cell_size) + cell_size/2;
    }
};

class SnakeBody extends ex.Actor {
    constructor(x: number, y: number, w: number, h:number) {
        super(x, y, w, h);
        this.color = ex.Color.Green;
        this.body.collider.type = ex.CollisionType.Passive;
    }
};

class SnakeHead extends ex.Actor {
    private _dir: Direction = Direction.Down;
    private _accumulated_time: number = 0;
    private _body_segments: SnakeBody[] = [];
    private _updated_this_interval: boolean = false;

    constructor(x: number, y: number, w: number, h:number) {
        super(x, y, w, h);
        this.color = getRandomColor();
        this.body.collider.type = ex.CollisionType.Passive;
        this.on('collisionstart', (evt: ex.CollisionStartEvent) => {
            if (evt.other instanceof Fruit) {
                this._grow_tail();
            }
            else if (evt.other instanceof SnakeBody) {
                game.goToScene('game-over');
            }
        })
    }

    private _grow_tail() {
        let segment = new SnakeBody(-100, -100, cell_size, cell_size);
        this._body_segments.push(segment);
        level.add(segment);
    }

    private _move_tail(x: number, y: number, c: ex.Color) {
        let nextx = x;
        let nexty = y;
        let nextc = c;
        for(let i = 0; i < this._body_segments.length; i++) {
            let oldx = this._body_segments[i].pos.x;
            let oldy = this._body_segments[i].pos.y;
            let oldc = this._body_segments[i].color;
            this._body_segments[i].pos.x = nextx;
            this._body_segments[i].pos.y = nexty;
            this._body_segments[i].color = nextc;
            nextx = oldx;
            nexty = oldy;
            nextc = oldc;
        }
    }

    private _out_of_bounds() {
        if (this.pos.x < 0 || this.pos.x > game.drawWidth) {
            return true;
        }
        else if (this.pos.y < 0 || this.pos.y > game.drawHeight) {
            return true;
        }
        return false;
    }
    
    private _move() {
        if (this._accumulated_time < 100) {
            return;
        }

        let oldx = this.pos.x;
        let oldy = this.pos.y;
        let oldcolor = this.color;

        switch(this._dir) {
            case Direction.Up:
                this.pos.y -= cell_size;
                break;
            case Direction.Left:
                this.pos.x -= cell_size;
                break;
            case Direction.Down:
                this.pos.y += cell_size;
                break;
            case Direction.Right:
                this.pos.x += cell_size;
                break;
            default:
                console.log('Unknown Direction Encountered')
                break;
        }

        if (this._out_of_bounds()) {
            game.goToScene('game-over');
        }

        this.color = getRandomColor();
        this._move_tail(oldx, oldy, oldcolor);
        this._accumulated_time = 0;
        this._updated_this_interval = false;
    }
    
    public update(engine: ex.Engine, delta: number) {
        super.update(engine, delta);
        this._accumulated_time += delta;

        if (!this._updated_this_interval) {
            if ( engine.input.keyboard.wasPressed(ex.Input.Keys.W) ) {
                if (this._dir != Direction.Down) {
                    this._dir = Direction.Up;
                    this._updated_this_interval = true;
                }
            }
            else if ( engine.input.keyboard.wasPressed(ex.Input.Keys.A) ) {
                if (this._dir != Direction.Right) {
                    this._dir = Direction.Left;
                    this._updated_this_interval = true;
                }
            }
            else if ( engine.input.keyboard.wasPressed(ex.Input.Keys.S) ) {
                if (this._dir != Direction.Up) {
                    this._dir = Direction.Down;
                    this._updated_this_interval = true;
                }
            }
            else if ( engine.input.keyboard.wasPressed(ex.Input.Keys.D) ) {
                if (this._dir != Direction.Left) {
                    this._dir = Direction.Right;
                    this._updated_this_interval = true;
                }
            }
        }
        this._move();
    }
};

const level = new ex.Scene(game);
const fruit = new Fruit(game.drawWidth - cell_size/2, game.drawHeight - cell_size/2, cell_size, cell_size);
const snake = new SnakeHead(cell_size/2, cell_size/2, cell_size, cell_size);

level.add(fruit);
level.add(snake);

game.add('level', level);

const gameOver = new ex.Scene(game);
game.add('game-over', gameOver);

// uncomment loader after adding resources
game.start().then(() => {
    game.goToScene('level')
});
