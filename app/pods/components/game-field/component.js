import Ember from 'ember';

export default Ember.Component.extend({
  game_engine: Ember.inject.service(),
  canvas_width: Ember.$(window).width(),
  canvas_height: Ember.$(window).height(),

  mapSize: [4000, 4000],

  tagName: 'canvas',

  didInsertElement() {
    this.set('client_id', this.get('game_engine.session_id'));

    // Wire up events
    let game_engine = this.get('game_engine');

    game_engine.on('state_changed', this.updateEntities.bind(this));
    game_engine.on('disconnected', () => {
      this.sendAction('disconnected');
      game_engine.off('disconnected');
      game_engine.off('state_changed');
    });

    // 3d SETUP STUFF
    //
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.x = -5;
    this.camera.position.z = 4
    this.camera.rotation.y = -1
    this.camera.rotation.z = Math.PI / 2 * 3

    this.renderer = new THREE.WebGLRenderer({ canvas: this.$()[0] });

    //this.$().append(this.renderer.domElement);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    var resizeTimer = null;
    Ember.$(window).on('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }, 250);
    });

    var grid = new THREE.GridHelper(2000, 500, 0x888888, 0x333333);
    grid.position.x = 2000;
    grid.position.y = 2000;
    grid.rotation.x = Math.PI/2;
    this.scene.add(grid);

    var axes = new THREE.AxisHelper(2);
    this.scene.add(axes);

    this.ships = {};

    this.light = this.createLight();
    this.scene.add(this.light);

    this.light = this.createLight();
    this.scene.add(this.light);

    this.renderScene();
    game_engine.joinGame();
  },

  willDestroyElement() {
    Ember.$(window).off('resize');
    this.get('game_engine').leaveGame();
  },

  renderScene() {
    requestAnimationFrame(this.renderScene.bind(this));

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
  }
});
