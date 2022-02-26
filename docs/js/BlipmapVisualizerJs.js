console.log("BlipmapVisualizerJs");

var show = false;
var currentP5;
var selectedAnimation;

export function createVisualizer(animationId) {
    console.log("Creating Visualizer with animation " + animationId + ".");
    const animations = [lightsBoard, animation0, animationA];

    window.document.getElementById('blipmapvisualizer').innerHTML = '';

    selectedAnimation = animations.find(x => x.id === animationId) || animations[0];

    show = true;
    if (show) {
        console.log("Importing p5js module.");
        import('../lib/p5.min');
        console.log("Creating canvas.");

        currentP5 = new p5(sketch);
    }
}


export function setGridSize(sizes) {
    console.log("Setting grid size: Rows = " + sizes.rows + ", Columns = " + sizes.columns + ".");
    selectedAnimation.options.lightRows = sizes.rows;
    selectedAnimation.options.lightColumns = sizes.columns;
    createVisualizer(selectedAnimation.id);
};

export function setActive(isActive) {
    console.log("Setting active = " + isActive);
    selectedAnimation.state.isActive = isActive;
};

export function setFramerate(framerate) {
    console.log("Setting framerate to " + framerate);
    selectedAnimation.state.framerate = framerate;
    currentP5.frameRate(selectedAnimation.state.framerate);
};

export function setAnimationActive(isActive) {
    console.log("Setting animation active = " + isActive);
    selectedAnimation.state.isAnimationActive = isActive;
};

export function setColorShiftRate(rate) {
    console.log("Setting color shift rate to " + rate);
    selectedAnimation.state.colorShiftRate = rate;
};


let sketch = function (p) {
    console.log("Intializing new sketch...");
    console.log({ selectedAnimation });

    p.setup = () => selectedAnimation.setup(p, 'blipmapvisualizer');

    p.draw = () => selectedAnimation.draw(p);

};


//const lights = {
//    id: "DefaultCircle",
//    name: "Default Circle",
//    state: {
//        bg: 0,
//    },
//    setup: function (p) {
//        console.log("Setup called.");
//        var canvas = p.createCanvas(400, 400);
//        canvas.parent('blipmapvisualizer');
//    },
//    draw: function (p) {
//        p.background(this.state.bg);
//        p.fill(255);
//        p.circle(50, 50, 50);
//    }
//}



const animation0 = {
    id: "DefaultCircle",
    name: "Default Circle",
    state: {
        bg: 0,
    },
    setup: function (p) {
        console.log("Setup called.");
        var canvas = p.createCanvas(400, 400);
        canvas.parent('blipmapvisualizer');
    },
    draw: function (p) {
        p.background(this.state.bg);
        p.fill(255);
        p.circle(50, 50, 50);
    }
}

const animationA = {
    id: "Bounce",
    name: "Bounce",
    state: {
        rad: 30, // Width of the shape
        xpos: 0,
        ypos: 0, // Starting position of shape
        xspeed: 2.8, // Speed of the shape
        yspeed: 2.2, // Speed of the shape
        xdirection: 1, // Left or Right
        ydirection: 1, // Top to Bottom
    },
    setup: function (p, elementId) {
        console.log("Setup called for animationA");
        var canvas = p.createCanvas(400, 400);
        canvas.parent(elementId);
        p.noStroke();
        p.frameRate(30);
        p.ellipseMode(p.RADIUS);
        // Set the starting position of the shape
        this.state.xpos = p.width / 2;
        this.state.ypos = p.height / 2;
        console.log("Setup complete.");

    },
    draw: function (p) {
        p.clear();
        p.background(102);

        // Update the position of the shape
        this.state.xpos = this.state.xpos + this.state.xspeed * this.state.xdirection;
        this.state.ypos = this.state.ypos + this.state.yspeed * this.state.ydirection;

        // Test to see if the shape exceeds the boundaries of the screen
        // If it does, reverse its direction by multiplying by -1
        if (this.state.xpos > p.width - this.state.rad || this.state.xpos < this.state.rad) {
            this.state.xdirection *= -1;
        }
        if (this.state.ypos > this.state.height - this.state.rad || this.state.ypos < this.state.rad) {
            this.state.ydirection *= -1;
        }

        // Draw the shape
        p.ellipse(this.state.xpos, this.state.ypos, this.state.rad, this.state.rad);
    }
}


const lightsBoard = {
    id: "Lights",
    name: "Lights",
    state: {
        animationId: "lights",
        lights: [],
        isActive: true,
        isAnimationActive: true,
        brightness: 50,
        colorShiftRate: 5,
        bpm: 120,
        framerate: 5,
    },
    options: {
        tile: {
            width: 10,
            height: 10,
            centerWidthOffset: 5,
            centerHeightOffset: 5,
        },
        lightSize: 20,
        lightRows: 3,
        lightColumns: 3,
    }
    ,
    setup: function (p, elementId) {
        console.log("Setup called for Lights board");
        var canvas = p.createCanvas(400, 400);
        canvas.parent(elementId);
        //p.noStroke();
        p.frameRate(5);
        //p.ellipseMode(p.RADIUS);
        // Set the starting position of the shape
        console.log("Setup complete.");

        const rows = this.options.lightRows;
        const columns = this.options.lightColumns;

        this.options.tile.width = p.width / columns;
        this.options.tile.height = p.height / rows;
        this.options.tile.centerWidthOffset = this.options.tile.width / 2;
        this.options.tile.centerHeightOffset = this.options.tile.height / 2;

        for (var row = 0; row < rows; row++) {
            var lightRow = [];
            for (var column = 0; column < columns; column++) {
                lightRow.push({
                    isActive: true,
                    brightness: 50,
                    bpm: 120,
                    color: {
                        r: 100,
                        g: 200,
                        b: 50
                    }
                });
            }
            this.state.lights.push(lightRow);
        }
    },
    draw: function (p) {
        p.clear();
        p.background(0);
        if (!this.state.isActive) return;
        p.fill(230);
        this.state.lights.map((row, rowIndex) => {
            row.map((light, lightIndex) => {
                p.fill(light.color.r, light.color.g, light.color.b);
                p.circle((this.options.tile.width * lightIndex) + this.options.tile.centerWidthOffset, (this.options.tile.height * rowIndex) + this.options.tile.centerHeightOffset, this.options.lightSize);

                if (this.state.isAnimationActive) {
                    light.color.r = light.color.r + (this.state.colorShiftRate * 8 * lightIndex) + (2 * rowIndex);
                    if (light.color.r > 250) light.color.r = 0;
                    light.color.g = light.color.g + (this.state.colorShiftRate * 5 * lightIndex) + (5 * rowIndex);
                    if (light.color.g > 250) light.color.g = 0;
                    light.color.b = light.color.b + (this.state.colorShiftRate * 2 * lightIndex) + (8 * rowIndex);
                    if (light.color.b > 250) light.color.b = 0;
                }
            });
        });
    }
}
