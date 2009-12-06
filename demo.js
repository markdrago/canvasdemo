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
            var x = Math.floor(Math.random() * (this.arena1.width - 10));
            var y = Math.floor(Math.random() * (this.arena1.height - 20)) + 10;

            var item1;
            if (Math.random() < .5) {
                item1 = new circle(x, y);
            } else {
                item1 = new square(x, y);
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
    },

    add_item: function(myitem) {
        this.items.push(myitem);
        myitem.arena = this;
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
    initialize: function(x, y) {
        this.x = x;
        this.y = y;
        this.velx = .1;
        this.vely = .1;
        this.width = 10;
        this.height = 10;
        this.arena = null;
        this.gravity_accel = 1.15;
        this.negligible_vely = .3;
        this.red = Math.floor(Math.random() * 255);
        this.blue = Math.floor(Math.random() * 255);
        this.green = Math.floor(Math.random() * 255);
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
        var delta_y = Math.abs(absvely - (absvely * this.gravity_accel));
        this.vely += delta_y;

        //handle the apex of a bounce
        if (Math.abs(this.vely) <= this.negligible_vely)
            this.vely = this.negligible_vely;
    },
    
    //set random +y velocity, random +/-x velocity
    bounce: function() {
        this.setvely(Math.random() * -75);
        this.setvelx((Math.random() * 10) - 5);
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
    initialize: function($super, x, y) {
        $super(x, y);
    },
    
    draw: function(ctx) {
        ctx.fillStyle = this.getrgb();
        ctx.fillRect(this.x, this.y, 10, 10);
    }
});

var circle = Class.create(item, {
    initialize: function($super, x, y) {
        $super(x, y);
        this.radius = this.width / 2;
    },
    
    draw: function(ctx) {
        ctx.fillStyle = this.getrgb();
        ctx.beginPath();
        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius,
                0, 2 * Math.PI, false);
        ctx.fill();
    }
});
