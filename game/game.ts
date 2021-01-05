/// <reference path="../node_modules/excalibur/dist/excalibur.d.ts" />

var cell_size = 25;

enum Direction {
    Up,
    Left,
    Down,
    Right
}

var game = new ex.Engine({
    width: 800,
    height: 600
});

class Fruit extends ex.Actor {
    constructor(x: number, y: number, w: number, h:number) {
        super(x, y, w, h, ex.Color.Red);
	this.body.collider.type = ex.CollisionType.Active;
	
    }
};

class Snake extends ex.Actor {

    private _dir = Direction.Down;
    private _accumulated_time = 0;

    constructor(x: number, y: number, w: number, h:number) {
        super(x, y, w, h, ex.Color.Green);
	this.body.collider.type = ex.CollisionType.Passive;
    }
    
    private _move() {
	if (this._accumulated_time < 250) {
	    return;
	}

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
	this._accumulated_time = 0;
    }
    
    public update(engine: ex.Engine, delta: number) {
	super.update(engine, delta);

	this._accumulated_time += delta;

        if ( engine.input.keyboard.wasPressed(ex.Input.Keys.W) ) {
            this._dir = Direction.Up;
            this._move();
        }
	else if ( engine.input.keyboard.wasPressed(ex.Input.Keys.A) ) {
            this._dir = Direction.Left;
            this._move();
        }
	else if ( engine.input.keyboard.wasPressed(ex.Input.Keys.S) ) {
            this._dir = Direction.Down;
            this._move();
        }
	else if ( engine.input.keyboard.wasPressed(ex.Input.Keys.D) ) {
            this._dir = Direction.Right;
            this._move();
        }
	else {
	    this._move();
	}
    }
};

const level = new ex.Scene(game);
const fruit = new Fruit(game.drawWidth - cell_size/2, game.drawHeight - cell_size/2, cell_size, cell_size);
const snake = new Snake(cell_size/2, cell_size/2, cell_size, cell_size);

level.add(fruit);
level.add(snake);

game.add('level', level);

// uncomment loader after adding resources
game.start().then(() => {
    game.goToScene('level')
});
