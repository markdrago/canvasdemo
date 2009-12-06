function main() {
    game1 = new game();
    game1.main();
}

function game() {
    this.fps = 30;
    
    //get canvas element and context
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
   
    this.main = function() {
        this.arena1 = new arena(this.ctx, this.canvas.width, this.canvas.height);
        for (var i = 0; i < 50; i++) {
            var x = Math.floor(Math.random() * (this.arena1.width - 10));
            var y = Math.floor(Math.random() * (this.arena1.height - 20)) + 10;
            var item1 = new item(x, y);
            this.arena1.add_item(item1);
        }
    
        setInterval("game1.draw()", 1000 / this.fps);
    }
    
    this.draw = function() {
        this.arena1.gravity();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arena1.draw();
    }
}

function arena(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.items = new Array();

    this.add_item = function(item) {
        this.items.push(item);
        item.arena = this;
    }

    this.rm_item = function(item) {
        item.arena = null;
        var idx = this.items.indexOf(item);
        if (idx) {
            this.items.splice(idx, 1);
            alert('removed item: ' + idx);
        }
    }

    this.draw = function() {
        for (var i in this.items) {
            this.items[i].draw(this.ctx);
        }
    }

    this.gravity = function() {
        for (var i in this.items) {
            //inflict gravity
            this.items[i].gravity();

            //remove items that are off the canvas
            if (this.items[i].getx() > this.width ||
                this.items[i].gety() > this.height) {
                this.rm_item(this.items[i]);
            }
        }
    }
}

function item(x, y) {
    this.gravity_accel = 1.15;
    this.x = x;
    this.y = y;
    this.velx = .1;
    this.vely = .1;
    this.width = 10;
    this.height = 10;
    this.arena = null;

    this.draw = function(ctx) {
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (this.x, this.y, 10, 10);
    }

    this.gravity = function() {
        this.vely *= this.gravity_accel;
        this.y += this.vely;
        if (this.y >= this.arena.height - this.height)
            this.y = this.arena.height - this.height;
    }

    this.getx = function() {
        return this.x;
    }

    this.gety = function() {
        return this.y;
    }
}
