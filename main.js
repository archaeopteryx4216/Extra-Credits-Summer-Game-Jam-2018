"use strict";

// Constants

const SPACE_CODE = 32;
const LEFT_CODE = 37;
const RIGHT_CODE = 39;
const UP_CODE = 38;
const DOWN_CODE = 40;

const PLAYER_SPEED = 100.0;

// Object type definitions

// Entity and subclasses
// Base Entity class
function Entity(px, py) {
    this.pos = {x: px, y: py};
    this.priority = -1;
    console.log("Made an entity. ps: (", this.pos.x, ", ", this.pos.y, ")");
}
Entity.prototype.draw = null;

// Group of entities entity
function EntityGroup(px, py, entities) {
    Entity.call(this, px, py);
    this.children = entities;
}
EntityGroup.prototype.draw = function(ctx) {
    this.children.forEach(function(entity) {
        entity.draw(ctx);
    });
}

// UI Element class (value string in a box)
function UIEntity(px, py, w, h) {
    Entity.call(this, px, py);
    this.width = w;
    this.height = h;
}
UIEntity.prototype.draw = function(ctx, value) {

}

// Moveable Entity class
function MEntity(px, py, sprite) {
    Entity.call(this, px, py);
    this.sprite = sprite;
    console.log("Made a mobile entity. pos: (",this.pos.x,",",this.pos.y,")");
}
MEntity.prototype.updatePosition = function(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
}
MEntity.prototype.draw = function(ctx) {
    //ctx.drawImage(this.sprite, this.pos.x, this.pos.y);
    ctx.fillStyle = "#995577";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

// Bullet class
function BulletEntity(px, py, vx, vy, sprite) {
    MEntity.call(this, px, py, sprite);
    this.vel = {x: vx, y: vy};
}
BulletEntity.prototype.draw = function() {
    //ctx.drawImage(sprite, this.pos.x, this.pos.y);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 4, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

function AircraftEntity(px, py, sprite, initialRotation) {
    MEntity.call(this, px, py, sprite);
    this.rotation = initialRotation;
    console.log("Made an aircraft. pos: (",this.pos.x,",",this.pos.y,")");
}
AircraftEntity.prototype.rotate = function(theta) {
    this.rotation += theta;
}
AircraftEntity.prototype.draw = function(ctx) {
    console.log("POS: ("+ this.pos.x + "," + this.pos.y + ")");
    ctx.save();
    ctx.rotate(-this.rotation);
    MEntity.prototype.draw.call(this, ctx);
    ctx.restore();
}

// Background class
function Background(width, height) {
    this.w = width;
    this.h = height;
    this.color = "#779955";
}
Background.prototype.draw = function(ctx) {
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.restore();
}

// Functions

var main = function() {
    console.log("In Main!");
    let canvas = document.getElementById("canvas");
    let canvas2d = canvas.getContext('2d');
    let gameState = setupLevel(canvas2d, canvas);
    initGame(gameState);
    updateGame(gameState);
    drawScreen(gameState);
}

var setupLevel = function(context, canvas) {
    return {
        ctx: context,
        enemies: new EntityGroup(0, 0, []),
        player: new AircraftEntity(canvas.width / 2, canvas.height, null, 0),
        background: new Background(canvas.width, canvas.height),
        keys: [],
        bullets: []
    };
}

var initGame = function(gameState) {
    document.onkeydown = function(e) {
        e = e ? e : window.event;
        gameState.keys[e.keyCode] = true;
    };
    document.onkeyup = function(e) {
        e = e ? e : window.event;
        gameState.keys[e.keyCode] = false;
    };
}

var drawScreen = function(gameState) {
    console.log("Drawing frame");
    // First draw the background
    gameState.background.draw(gameState.ctx);
    console.log("Drew background")
    // Second draw the enemies
    gameState.enemies.draw(gameState.ctx);
    // Third draw the bullets
    gameState.bullets.forEach(function(bullet) {
        bullet.draw(gameState.ctx);
    });
    // Fourth draw the player
    gameState.player.draw(gameState.ctx);
    // Fifth draw the UI
    //gameState.ui.draw(gameState.ctx);
    // Draw the next frame when ready
    window.setTimeout(drawScreen, 20, gameState);
}

var updateGame = function(gameState) {
    console.log("Updating game state");
    let dp = {x:0, y:0};
    // Check for button presses
    if (gameState.keys[SPACE_CODE]) {
        // Space bar is pressed
    }
    if (gameState.keys[LEFT_CODE]) {
        // Left arrow is pressed
        dp.x = -1;
        console.log("LEFT");
    }
    if (gameState.keys[RIGHT_CODE]) {
        // Right arrow is pressed
        dp.x = 1;
        console.log("RIGHT");
    }
    if (gameState.keys[UP_CODE]) {
        // Up arrow is pressed
        dp.y = -1;
        console.log("UP");
    }
    if (gameState.keys[DOWN_CODE]) {
        // Down arrow is pressed
        dp.y = 1;
        console.log("DOWN");
    }
    norm(dp);
    gameState.player.pos.x += dp.x;
    gameState.player.pos.y += dp.y;
    // Process input and advance the game state every 20 ms
    window.setTimeout(updateGame, 20, gameState);
}

var norm = function(pair) {
    let mag = Math.sqrt(pair.x * pair.x + pair.y * pair.y);
    if (Math.abs(mag) > 0.01) {
        pair.x /= mag;
        pair.y /= mag;
    }
}
