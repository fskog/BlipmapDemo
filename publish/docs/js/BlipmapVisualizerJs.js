console.log("BlipmapVisualizerJs");

var show = false;
var currentP5;
var selectedAnimation;

let lightModel = {
    isActive: true,
    animationId: "lights",
    lights: [],
    isAnimationActive: true,
    brightness: 50,
    colorShiftRate: 5,
    bpm: 120,
    framerate: 5,
    options: {
        width: 400,
        height: 400,
        lightSize: 20,
        lightRows: 5,
        lightColumns: 5,
        backgroundBrightness: 125,
        tile: {
            width: 10,
            height: 10,
            centerWidthOffset: 5,
            centerHeightOffset: 5,
        }
    },
}



export function createVisualizer() {
    const animations = [shimmer, blink, running];
    selectedAnimation = animations.find(x => x.id === lightModel.animationId) || animations[0];

    console.log("Creating Visualizer with animation " + selectedAnimation.id + ".");

    window.document.getElementById('blipmapvisualizer').innerHTML = '';


    show = true;
    if (show) {
        console.log("Importing p5js module.");
        import('../lib/p5.min');
        console.log("Creating canvas.");

        currentP5 = new p5(sketch);
    }
}

export function setAnimation(animationId) {
    console.log("Setting animation to " + animationId);
    lightModel.animationId = animationId;
    createVisualizer();
};

export function setGridSize(sizes) {
    console.log("Setting grid size: Rows = " + sizes.rows + ", Columns = " + sizes.columns + ".");
    lightModel.options.lightRows = sizes.rows;
    lightModel.options.lightColumns = sizes.columns;
    createVisualizer(selectedAnimation.id);
};

export function setActive(isActive) {
    console.log("Setting active = " + isActive);
    lightModel.isActive = isActive;
};

export function setFramerate(framerate) {
    console.log("Setting framerate to " + framerate);
    lightModel.framerate = framerate;
    currentP5.frameRate(lightModel.framerate);
};

export function setAnimationActive(isActive) {
    console.log("Setting animation active = " + isActive);
    lightModel.isAnimationActive = isActive;
};

export function setColorShiftRate(rate) {
    console.log("Setting color shift rate to " + rate);
    lightModel.colorShiftRate = rate;
};


let sketch = function (p) {
    console.log("Intializing new sketch...");
    console.log({ lightsBoard });

    p.setup = () => lightsBoard.setup(p, 'blipmapvisualizer');

    p.draw = () => lightsBoard.draw(p);

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

const blink = {
    id: "blink",
    animateFrame: () => {
        lightModel.lights.map((row, rowIndex) => {
            row.map((light, lightIndex) => {
                if (light.color.r > 0) {
                    light.color.r = 0;
                    light.color.g = 0;
                    light.color.b = 0;
                } else {
                    light.color.r = 255;
                    light.color.g = 255;
                    light.color.b = 255;
                }
            });
        });
    }
}

let running = {
    id: "running",
    state: {
        rowIndex: 0,
        columnIndex: 0,
    },
    animateFrame: () => {
        //const lightsCount = lightModel.lights.length;
        //const row = selectedAnimation.state.index lightModel
        let currRow = false;
        lightModel.lights.map((row, rowIndex) => {
            currRow = (rowIndex === selectedAnimation.state.rowIndex);

            row.map((light, lightIndex) => {
                if ((lightIndex === selectedAnimation.state.columnIndex)) {
                    //console.log("Correct light [" + lightIndex + ", " + selectedAnimation.state.rowIndex + "]");
                    light.color.r = 255;
                    light.color.g = 255;
                    light.color.b = 255;
                } else {
                    //console.log("Not correct light [" + lightIndex + ", " + rowIndex + "]");

                    light.color.r = 50;
                    light.color.g = 50;
                    light.color.b = 50;
                }
            });
        });
        selectedAnimation.state.columnIndex += 1;
        if (selectedAnimation.state.columnIndex >= lightModel.options.lightColumns) {
            selectedAnimation.state.columnIndex = 0;

            selectedAnimation.state.rowIndex += 1;
            if (selectedAnimation.state.rowIndex >= lightModel.options.lightRows) {
                selectedAnimation.state.rowIndex = 0;
            }
        }
        console.log("Index [" + selectedAnimation.state.columnIndex + ", " + selectedAnimation.state.rowIndex + "]");
    }
}

const shimmer = {
    id: "shimmer",
    state: [],
    animateFrame: () => {

        lightModel.lights.map((row, rowIndex) => {
            row.map((light, lightIndex) => {
                light.color.r = light.color.r + (lightModel.colorShiftRate * 8 * lightIndex) + (2 * rowIndex);
                if (light.color.r > 250) light.color.r = 0;
                light.color.g = light.color.g + (lightModel.colorShiftRate * 5 * lightIndex) + (5 * rowIndex);
                if (light.color.g > 250) light.color.g = 0;
                light.color.b = light.color.b + (lightModel.colorShiftRate * 2 * lightIndex) + (8 * rowIndex);
                if (light.color.b > 250) light.color.b = 0;
            });
        });
    }
}


const lightsBoard = {
    setup: function (p, elementId) {
        console.log("Setup called for Lights board...");
        console.log({ lightModel });

        var canvas = p.createCanvas(lightModel.options.height, lightModel.options.width);
        canvas.parent(elementId);
        //p.noStroke();
        p.frameRate(5);
        //p.ellipseMode(p.RADIUS);
        // Set the starting position of the shape

        const rows = lightModel.options.lightRows;
        const columns = lightModel.options.lightColumns;

        lightModel.options.tile.width = p.width / columns;
        lightModel.options.tile.height = p.height / rows;
        lightModel.options.tile.centerWidthOffset = lightModel.options.tile.width / 2;
        lightModel.options.tile.centerHeightOffset = lightModel.options.tile.height / 2;

        delete lightModel.lights;
        lightModel.lights = new Array();
        
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
            lightModel.lights.push(lightRow);
        }
        console.log("Setup complete.");
    },
    draw: function (p) {
        p.clear();
        p.background(0);
        let tile = lightModel.options.tile;
        if (!lightModel.isActive) return;
        p.fill(230);

        if (lightModel.isAnimationActive) {
            selectedAnimation.animateFrame();
        }

        lightModel.lights.map((row, rowIndex) => {
            row.map((light, lightIndex) => {
                p.fill(light.color.r, light.color.g, light.color.b);
                p.circle((tile.width * lightIndex) + tile.centerWidthOffset, (tile.height * rowIndex) + tile.centerHeightOffset, lightModel.options.lightSize);
            });
        });
    }
}
