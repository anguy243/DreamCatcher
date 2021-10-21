title = "DREAM CATCHER";

description = `
avoid Z's to keep sleeping!

[CLICK]
  Accelerate

`;

characters = [
`
 bbbbB
rrrrRR
rrrrRR
l    l
`,`
pppppp
   pp
  pp
 pp
pppppp
`,
];

const G = {
	WIDTH: 200,
	HEIGHT: 150,

    STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
    

    ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0
};

options = {
	    viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isCapturing: true,
  // isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
  seed: 1,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "crt"
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star [] }
 */
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

let isPressing;



function update() {

	if (!ticks) {
		stars = times(20, () => {
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            return {
                pos: vec(posX, posY),
                speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
            };
        });

        player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
        };

        isPressing = false; 
        enemies = [];
        waveCount = 0;
	}

    // Spawning enemies
    if (enemies.length === 0) {
        currentEnemySpeed =
            rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * difficulty;
        for (let i = 0; i < 25; i++) {
            const posX = rnd(0, G.WIDTH);
            const posY = -rnd(i * G.HEIGHT * 0.1);
            enemies.push({ pos: vec(posX, posY) })
        }

      waveCount++
    }

    // Update for Star
    stars.forEach((s) => {
        s.pos.x -= s.speed;
        if (s.pos.x < 0) s.pos.x = G.WIDTH;
        color("light_yellow")
        box(s.pos, 1);
    });

    // Updating and drawing the player
    player.pos.clamp(0, G.WIDTH, G.HEIGHT - G.HEIGHT/5, 0);
    player.pos.x -= 1/2

    if (input.isJustPressed)
    {
      play("laser");
      player.pos.x += 10
      color("light_black");
      particle(
          player.pos.x - 3, // x coordinate
          player.pos.y + 1, // y coordinate
          10, // The number of particles
          2, // The speed of the particles
          -PI, // The emitting angle
          PI/4  // The emitting width
      );
    }

    // player
    color ("black");
    char("a", player.pos);


    remove(enemies, (e) => {
        e.pos.y += currentEnemySpeed;
        color("black");
        char("b", e.pos);

        const isCollidingWithPlayer = char("b", e.pos).isColliding.char.a;

        if (isCollidingWithPlayer) {
          end();
          play("explosion"); 
        }
        
        return (e.pos.y > G.HEIGHT);
    });


    if (player.pos.x == 0)
    {
      play("explosion");
      end();
    }

    addScore(10/60 * waveCount);
}
