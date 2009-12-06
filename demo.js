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
        for (var i = 0; i < 75; i++) {
            var x = Math.floor(Math.random() * (this.arena1.width - 10));
            //var y = Math.floor(Math.random() * (this.arena1.height - 20)) + 10;
            var y = this.arena1.height - 10;
            var item1 = new item(x, y);
            this.arena1.add_item(item1);
        }
    
        setInterval("game1.draw()", 1000 / this.fps);
    }
    
    this.draw = function() {
        this.arena1.motion();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arena1.draw();
    }
}

function arena(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.items = new Array();

    this.add_item = function(myitem) {
        this.items.push(myitem);
        myitem.arena = this;
    }

    this.rm_item = function(myitem) {
        myitem.arena = null;
        var idx = this.items.indexOf(myitem);
        if (idx != undefined) {
            this.items.splice(idx, 1);
        }
    }

    this.draw = function() {
        for (var i in this.items) {
            this.items[i].draw(this.ctx);
        }
    }

    this.motion = function() {
        for (var i in this.items) {
            this.items[i].motion();

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
    this.velx = .1;
    this.vely = .1;
    this.width = 10;
    this.height = 10;
    this.arena = null;
    const gravity_accel = 1.15;
    const negligible_vely = .3;

    this.draw = function(ctx) {
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(this.x, this.y, 10, 10);
    }

    this.motion = function() {
        this.gravity();
        
        this.y += this.vely;
        this.x += this.velx;
        
        //randomly bounce off the bottom
        if (this.y >= this.arena.height - this.height) {
            this.y = this.arena.height - this.height;
            this.bounce();
        }
        
        //bounce off right wall
        if (this.x >= this.arena.width - this.width) {
            this.x = this.arena.width - this.width;
            this.velx *= -1;
        }
        
        //bounce off left wall
        if (this.x <= 0) {
            this.x = 0;
            this.velx *= -1;
        }
    }

    this.gravity = function() {
        //inflict gravity
        var absvely = Math.abs(this.vely);
        var delta_y = Math.abs(absvely - (absvely * gravity_accel));
        this.vely += delta_y;

        //handle the apex of a bounce
        if (Math.abs(this.vely) <= negligible_vely)
            this.vely = negligible_vely;
    }
    
    //set random +y velocity, random +/-x velocity
    this.bounce = function() {
        this.setvely(Math.random() * -75);
        this.setvelx((Math.random() * 10) - 5);
    }    

    this.setvely = function(vely) {
        this.vely = vely;
    }
    
    this.setvelx = function(velx) {
        this.velx = velx;
    }

    this.getx = function() {
        return this.x;
    }

    this.gety = function() {
        return this.y;
    }
}
