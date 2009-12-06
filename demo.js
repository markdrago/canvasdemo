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
        this.arena1 = new arena(this.ctx, this.canvas.width, this.canvas.height);
        for (var i = 0; i < 75; i++) {
            var x = Math.floor(Math.random() * (this.arena1.width - 10));
            //var y = Math.floor(Math.random() * (this.arena1.height - 20)) + 10;
            var y = this.arena1.height - 10;
            var item1 = new item(x, y);
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
        for (var i in this.items) {
            this.items[i].draw(this.ctx);
        }
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
    },

    draw: function(ctx) {
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(this.x, this.y, 10, 10);
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
    }
});
