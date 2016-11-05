import Ember from 'ember';
import Camera from 'client/utils/canvas/camera';
import starFieldGenerator from 'client/utils/canvas/star-field';
import MiniMap from 'client/utils/canvas/mini-map';


export default Ember.Component.extend({
  game_engine: Ember.inject.service(),
  canvas_width: Ember.$(window).width(),
  canvas_height: Ember.$(window).height(),

  mapSize: [4000, 4000],

  tagName: 'div',

  didInsertElement() {
    //this.setupCanvas();
    //this.setupCtx();
    this.set('client_id', this.get('game_engine.session_id'));

    // Wire up events
    let game_engine = this.get('game_engine');

    game_engine.on('state_changed', this.updateEntities.bind(this));
    game_engine.on('disconnected', () => {
      this.sendAction('disconnected');
      game_engine.off('disconnected');
      game_engine.off('state_changed');
    });

    //this.miniMap = new MiniMap(this.get('ctx'),
    //                           this.get('mapSize')[0],
    //                           this.get('mapSize')[1],
    //                           50,
    //                           50,
    //                           0.05);

    //starFieldGenerator().then((image) => {
    //  this.set('star_field', image);

    //  game_engine.joinGame();
    //});

    // 3d SETUP STUFF
    //
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.x = -5;
    this.camera.position.z = 4
    this.camera.rotation.y = -1
    this.camera.rotation.z = Math.PI / 2 * 3

    this.renderer = new THREE.WebGLRenderer();

    this.$().append(this.renderer.domElement);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    var grid = new THREE.GridHelper(2000, 500, 0x888888, 0x333333);
    grid.position.x = 2000
    grid.position.y = 2000
    grid.rotation.x = Math.PI/2
    this.scene.add(grid);

    var axes = new THREE.AxisHelper(2);
    this.scene.add(axes);

    this.ships = {};

    this.light = this.createLight();
    this.scene.add(this.light);

    this.light = this.createLight();
    this.scene.add(this.light);

    //this.player = new Player(this.scene, this.camera);
    //this.tick = 0;
    this.renderScene();
    game_engine.joinGame();
  },

  willDestroyElement() {
    Ember.$(window).off('resize');
    this.get('game_engine').leaveGame();
  },

  setupCanvas() {
    let { canvas_width,
          canvas_height } = this.getProperties('canvas_width', 'canvas_height');

    this.$().attr('width', canvas_width);
    this.$().attr('height', canvas_height);

    var resizeTimer;

    // debounced resize
    Ember.$(window).on('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.handleResize.bind(this), 250);
    });
  },

  setupCtx() {
    let c = this.$()[0];
    let ctx = c.getContext("2d");

    this.set('camera', new Camera(ctx));
    this.get('camera').zoomTo(2000);

    window.camera = this.get('camera');

    this.set('ctx', ctx);
  },


  renderScene() {
    requestAnimationFrame(this.renderScene.bind(this));
    //this.player.update();

    this.renderer.render(this.scene, this.camera);

    this.tick++;
  },

  updateEntities() {
    let frame_data = this.get('game_engine.currentState');
    let game_objects = frame_data.state;

    game_objects.ships.forEach((ship) => {
      if(!(ship.id in this.ships)) this.addShipObj(ship);

      console.log(ship.health + " | x - " + parseInt(ship.x) + " | y -" + parseInt(ship.y));
      this.ships[ship.id].mesh.position.x = ship.x;
      this.ships[ship.id].mesh.position.y = ship.y;
      this.ships[ship.id].mesh.rotation.z = ship.rotation + Math.PI/2;
    });


    // SPAWN SHIP OBJECTS
    // SPAWN PROJECTILE OBJECTS
  },

  addShipObj(ship) {
    console.log('ADDING SHIP');

    var geometry = new THREE.BoxGeometry(2, 2, 0.5);
    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00});

    var mesh = new THREE.Mesh(geometry, material);

    this.ships[ship.id] = {
      id: ship.id,
      mesh: mesh
    };

    mesh.add(this.camera);
    this.scene.add(mesh);
  },

  createLight() {
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 0, 5500 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    return spotLight;
  },

  handleResize() {
    this.set('canvas_width',  Ember.$(window).width());
    this.set('canvas_height', Ember.$(window).height());
    this.setupCanvas();
  },

  centerCamera(ships) {
    let you = ships.find((ship)=> {
      return this.get('client_id') === ship.id;
    });

    this.get('camera').moveTo(you.x, you.y);
  },

  drawBackground() {
    let { star_field,
          ctx,
          camera } = this.getProperties('star_field', 'ctx', 'camera');

    let background_width  = star_field.width;
    let background_height = star_field.height;

    let viewport_width  = camera.viewport.width;
    let viewport_height = camera.viewport.height;

    let [camera_x, camera_y] = camera.lookat;

    let number_tiles_tall = Math.ceil(viewport_height / background_height) + 1;
    let number_tiles_wide = Math.ceil(viewport_width / background_width) + 1;

    if(number_tiles_tall === 2) number_tiles_tall++;
    if(number_tiles_wide === 2) number_tiles_wide++;

    var tile_coords = {
      x: Math.floor(camera_x / background_width),
      y: Math.floor(camera_y / background_height)
    };

    let drawInGrid = function(x, y) {
      ctx.drawImage(star_field, x * background_width, y * background_height);

      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 1;
      ctx.strokeRect(x * background_width, y * background_height, background_width, background_height);
      ctx.stroke();
    };

    for(var i = -Math.floor(number_tiles_wide / 2); i < Math.ceil(number_tiles_wide / 2); i++) {
      for(var j = -Math.floor(number_tiles_tall / 2); j < Math.ceil(number_tiles_tall / 2); j++) {
        drawInGrid(tile_coords.x + i, tile_coords.y + j);
      }
    }
  },

  drawBoundries() {
    let ctx = this.get('ctx');
    let map_size = this.get('mapSize');

    ctx.beginPath();
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, map_size[0], map_size[1]);
    ctx.stroke();
  },

  drawShip(ship) {
    let is_you = this.get('client_id') === ship.id;
    let color = is_you ? '#E7711B' : '#cccccc';

    this.drawTriangle(ship.x, ship.y, 25, ship.rotation, color);
    this.drawHealth(ship.health, ship.x, ship.y);
    this.drawName(ship.name, ship.x, ship.y);
  },

  drawName(name, origin_x, origin_y) {
    let ctx = this.get('ctx');
    name = "'" + name + "'";

    ctx.fillStyle = '#ffffff';
    ctx.font = "18px sans serif";

    var text = ctx.measureText(name);

    ctx.fillText(name, origin_x - (text.width / 2), origin_y - 70);
  },

  drawHealth(health, origin_x, origin_y) {
    let ctx = this.get('ctx');
    health = "Health: " + health;

    ctx.fillStyle = '#ffffff';
    ctx.font = "18px sans serif";

    var text = ctx.measureText(health);


    ctx.fillText(health, origin_x - (text.width / 2), origin_y - 50);
  },

  drawProjectile(projectile) {
    let ctx = this.get('ctx');
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 3 ,0 , 2*Math.PI);
    ctx.stroke();
  },

  drawTriangle(x, y, length, rotation, fillStyle) {
    let ctx = this.get('ctx');

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation + -Math.PI/2);
    ctx.beginPath();
    ctx.moveTo(length * 2 * -1, 0);
    ctx.lineTo(length, length);
    ctx.lineTo(length, length * -1);
    ctx.fillStyle = fillStyle;
    ctx.fill();

    ctx.closePath();

    ctx.restore();
  }

});
