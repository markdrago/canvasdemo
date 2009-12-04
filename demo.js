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
        this.room1 = new room(this.ctx, this.canvas.width, this.canvas.height);
        var item1 = new item(20, 20);
        this.room1.add_item(item1);
    
        setInterval("game1.draw()", 1000 / this.fps);
    }
    
    this.draw = function() {
        this.room1.gravity();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.room1.draw();
    }
}

function room(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.items = new Array();

    this.add_item = function(item) {
        this.items.push(item);
    }

    this.rm_item = function(item) {
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
    this.x = x;
    this.y = y;
    this.velx;
    this.vely;

    this.draw = function(ctx) {
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (this.x, this.y, 10, 10);
    }

    this.gravity = function() {
        this.y = this.y + 2;
    }

    this.getx = function() {
        return this.x;
    }

    this.gety = function() {
        return this.y;
    }
}
