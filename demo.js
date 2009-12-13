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
        this.arena1.set_has_gravity(false);

        //for (var i = 0; i < 50; i++) {
        //    var star1 = new star();
        //    this.arena1.add_item(star1);
        //}
        
        setInterval("game1.draw()", 1000 / this.fps);
    },
    
    draw: function() {
        if (Math.random() < .8) {
            var star1 = new star();
            var x = ((Math.random() * 100) - 50) + (this.arena1.width / 2);
            var y = ((Math.random() * 100) - 50) + (this.arena1.height / 2);
            this.arena1.add_item(star1, x, y);
        }     
        
        this.arena1.motion();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arena1.draw();
        //this.arena1.detect_collisions();
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
        this.has_gravity = false;
        this.has_zoom = true;
    },

    add_item: function(myitem, x, y) {
        this.items.push(myitem);
        myitem.add_to_arena(this, x, y);
    },

    rm_item: function(myitem) {
        var idx = this.items.indexOf(myitem);
        if (idx != undefined) {
            myitem.arena = null;
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
        var myarena = this;
        var rm_items = new Array();
        this.items.each(function(myitem) {
            myitem.motion();

            //remove items that are off the canvas
            if (myitem.getx() >= myarena.width ||
                myitem.getx() <= 0 ||
                myitem.gety() >= myarena.height ||
                myitem.gety() <= 0) {
                rm_items.push(myitem);
            }
        });
        
        rm_items.each(function(myitem) {
            myarena.rm_item(myitem);
        });
    },
    
    set_has_gravity: function(value) {
        this.has_gravity = value;
    },
    
    detect_collisions: function() {
        for (var i = 0; i < this.items.length - 1; i++) {
            var item1 = this.items[i];
            var x1_left = item1.x;
            var x1_right = item1.x + item1.width;
            var y1_top = item1.y;
            var y1_bot = item1.y + item1.height;
            
            for (var j = i + 1; j < this.items.length; j++) {
                var item2 = this.items[j];
                var x2_left = item2.x;
                var x2_right = item2.x + item2.width;
                var y2_top = item2.y;
                var y2_bot = item2.y + item2.height;
                
                if (((x1_left >= x2_left && x1_left <= x2_right) ||
                     (x1_right >= x2_left && x1_right <= x2_right) ||
                     (x2_left >= x1_left && x2_left <= x1_right) ||
                     (x2_right >= x1_left && x2_right <= x1_right)) &&
                    ((y1_top >= y2_top && y1_top <= y2_bot) ||
                     (y1_bot >= y2_top && y1_bot <= y2_bot) ||
                     (y2_top >= y1_top && y2_top <= y1_bot) ||
                     (y2_bot >= y1_top && y2_bot <= y1_bot))) {
                    //item1.collide(item2);
                    //item2.collide(item1);
                    //alert("collision");
                }
            }
        }
    }
});

var item = Class.create({
    initialize: function(width, height) {
        this.setwidth(width);
        this.setheight(height);
        this.velx = 0;
        this.vely = 0;
        this.arena = null;
        this.setcolor();
        this.wall_bounce = false;
    },

    add_to_arena: function(arena, x, y) {
        this.arena = arena;
        if (x === undefined)
            x = Math.floor(Math.random() * (this.arena.width - this.width));
        if (y === undefined)
            y = Math.floor(Math.random() * (this.arena.height - (2 * this.width))) + this.width;

        this.x = x;
        this.y = y;
        
        if (this.arena.has_zoom)
            this.speed = (Math.random() * .5) + .1;
    },

    zoom: function() {
        var multiplier = .2;
        var max_diam = 4;
        
        this.velx = this.speed * multiplier * (this.x - (this.arena.width / 2));
        this.vely = this.speed * multiplier * (this.y - (this.arena.height / 2));
        
        if (this.diameter >= max_diam)
            return;
        
        //slower moving items will scale faster
        var scale_factor = 1 - ((this.speed * 2) - 1);
        
        //items closer to sides scale faster
        var x_dist = Math.max(1, Math.abs((this.arena.width / 2) - this.x));
        x_dist /= this.arena.width;
        var y_dist = Math.max(1, Math.abs((this.arena.height / 2) - this.y));
        y_dist /= this.arena.height;

        var avg_dist = (x_dist + y_dist) / 2;
        var scale = scale_factor * avg_dist * 5;
        
        this.diameter = Math.min(max_diam, scale * this.width);
    },
    
    motion: function() {
        if (this.arena.has_gravity)
            this.gravity();
        else if (this.arena.has_zoom)
            this.zoom();
        
        this.y += this.vely;
        this.x += this.velx;
        
        if (this.wall_bounce)
            this.bounce();
    },

    bounce: function() {
        //bounce off top
        if (this.y <= 0) {
            this.y = 0;
            this.vely *= -1;
        }
        
        //bounce off the bottom
        if (this.y >= this.arena.height - this.height) {
            this.y = this.arena.height - this.height;
            this.vely *= -1;
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
    
    setcolor: function(red, green, blue) {
        if (red === undefined)
            red = Math.floor(Math.random() * 255);
        if (green === undefined)
            green = Math.floor(Math.random() * 255);
        if (blue === undefined)
            blue = Math.floor(Math.random() * 255);

        this.red = red;
        this.green = green;
        this.blue = blue;
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
        return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
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

var star = Class.create(circle, {
    initialize: function($super, diameter, x, y) {
        if (diameter == undefined)
            //diameter = Math.floor(Math.random() * 3) + 2;
            diameter = 3;
        $super(diameter);
        this.setcolor(250, 250, 250);
    }
});

