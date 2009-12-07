function main() {
    game1 = new game();
    game1.main();
}

var game = Class.create({
    initialize: function() {
        this.fps = 30;
    
        //get canvas element and context
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
    },
   
    main: function() {
        this.arena1 = new arena(this.ctx, this.canvas.width,
                                this.canvas.height);
        for (var i = 0; i < 100; i++) {
            var item1;
            if (Math.random() < .5) {
                item1 = new circle();
            } else {
                item1 = new square();
            }
            
            this.arena1.add_item(item1);
        }
    
        setInterval("game1.draw()", 1000 / this.fps);
    },
    
    draw: function() {
        this.arena1.motion();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arena1.draw();
    }
});

var arena = Class.create({
    initialize: function(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.items = new Array();
        this.gravity_accel = 1.15;
        this.negligible_vely = .3;
    },

    add_item: function(myitem, x, y) {
        this.items.push(myitem);
        myitem.add_to_arena(this, x, y);
    },

    rm_item: function(myitem) {
        myitem.arena = null;
        var idx = this.items.indexOf(myitem);
        if (idx != undefined) {
            this.items.splice(idx, 1);
        }
    },

    draw: function() {
        var myctx = this.ctx;
        this.items.each(function(myitem) {
            myitem.draw(myctx);
        });
    },

    motion: function() {
        this.items.each(function(myitem) {
            myitem.motion();

            //remove items that are off the canvas
            if (myitem.getx() > this.width ||
                myitem.gety() > this.height) {
                this.rm_item(myitem);
            }
        });
    }
});

var item = Class.create({
    initialize: function(width, height) {
        this.setwidth(width);
        this.setheight(height);
        this.velx = .1;
        this.vely = .1;
        this.arena = null;
        this.red = Math.floor(Math.random() * 255);
        this.blue = Math.floor(Math.random() * 255);
        this.green = Math.floor(Math.random() * 255);
    },

    add_to_arena: function(arena, x, y) {
        this.arena = arena;
        if (x === undefined)
            x = Math.floor(Math.random() * (this.arena.width - this.width));
        if (y === undefined)
            y = Math.floor(Math.random() * (this.arena.height - (2 * this.width))) + this.width;

        this.x = x;
        this.y = y;
    },

    motion: function() {
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
    },

    gravity: function() {
        //inflict gravity
        var absvely = Math.abs(this.vely);
        var delta_y = Math.abs(absvely - (absvely * this.arena.gravity_accel));
        this.vely += delta_y;

        //handle the apex of a bounce
        if (Math.abs(this.vely) <= this.arena.negligible_vely)
            this.vely = this.arena.negligible_vely;
    },
    
    //set random +y velocity, random +/-x velocity
    bounce: function() {
        this.setvely(Math.random() * -75);
        this.setvelx((Math.random() * 10) - 5);
    },

    setwidth: function(width) {
        if (width === undefined)
            width = Math.floor(Math.random() * 15) + 5;
        this.width = width;
    },
    
    setheight: function(height) {
        if (height === undefined)
            height = Math.floor(Math.random() * 15) + 5;
        this.height = height;
    },

    setvely: function(vely) {
        this.vely = vely;
    },
    
    setvelx: function(velx) {
        this.velx = velx;
    },

    getx: function() {
        return this.x;
    },

    gety: function() {
        return this.y;
    },
    
    getrgb: function() {
        return "rgb(" + this.red + "," + this.blue + "," + this.green + ")";
    }
});

var square = Class.create(item, {
    initialize: function($super, width, height) {
        $super(width, height);
    },

    draw: function(ctx) {
        ctx.fillStyle = this.getrgb();
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
});

var circle = Class.create(item, {
    initialize: function($super, diameter) {
        $super(diameter, diameter);
        this.diameter = this.width;
    },

    //setwidth == setheight for circles
    setwidth: function($super, width) {
        this.diameter = width;
        $super(width);
    },
    
    setheight: function($super, height) {
        this.diameter = height;
        $super(height);
    },

    draw: function(ctx) {
        ctx.fillStyle = this.getrgb();
        ctx.beginPath();
        var r = this.diameter / 2;
        ctx.arc(this.x + r, this.y + r, r, 0, 2 * Math.PI, false);
        ctx.fill();
    }
});
