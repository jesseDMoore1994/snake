var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../node_modules/excalibur/dist/excalibur.d.ts" />
var cell_size = 25;
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
var game = new ex.Engine({
    width: 800,
    height: 600
});
var Fruit = /** @class */ (function (_super) {
    __extends(Fruit, _super);
    function Fruit(x, y, w, h) {
        var _this = _super.call(this, x, y, w, h, ex.Color.Red) || this;
        _this.body.collider.type = ex.CollisionType.Active;
        return _this;
    }
    return Fruit;
}(ex.Actor));
;
var Snake = /** @class */ (function (_super) {
    __extends(Snake, _super);
    function Snake(x, y, w, h) {
        var _this = _super.call(this, x, y, w, h, ex.Color.Green) || this;
        _this._dir = Direction.Down;
        _this._accumulated_time = 0;
        _this.body.collider.type = ex.CollisionType.Passive;
        return _this;
    }
    Snake.prototype._move = function () {
        if (this._accumulated_time < 250) {
            return;
        }
        switch (this._dir) {
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
                console.log('Unknown Direction Encountered');
                break;
        }
        this._accumulated_time = 0;
    };
    Snake.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
        this._accumulated_time += delta;
        if (engine.input.keyboard.wasPressed(ex.Input.Keys.W)) {
            this._dir = Direction.Up;
            this._move();
        }
        else if (engine.input.keyboard.wasPressed(ex.Input.Keys.A)) {
            this._dir = Direction.Left;
            this._move();
        }
        else if (engine.input.keyboard.wasPressed(ex.Input.Keys.S)) {
            this._dir = Direction.Down;
            this._move();
        }
        else if (engine.input.keyboard.wasPressed(ex.Input.Keys.D)) {
            this._dir = Direction.Right;
            this._move();
        }
        else {
            this._move();
        }
    };
    return Snake;
}(ex.Actor));
;
var level = new ex.Scene(game);
var fruit = new Fruit(game.drawWidth - cell_size / 2, game.drawHeight - cell_size / 2, cell_size, cell_size);
var snake = new Snake(cell_size / 2, cell_size / 2, cell_size, cell_size);
level.add(fruit);
level.add(snake);
game.add('level', level);
// uncomment loader after adding resources
game.start().then(function () {
    game.goToScene('level');
});
