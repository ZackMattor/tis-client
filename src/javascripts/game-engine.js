import net from './lib/net';
import keyboard from './lib/keyboard';
import BaseObject from './lib/base-object';

export default Object.assign({}, BaseObject, {
  canvas_width: $(window).width(),
  canvas_height: $(window).height(),

  mapSize: [4000, 4000],

  init() {
    net.auth('fooo', this.start.bind(this));
  },

  start() {
    keyboard.init();
    this.client_id = net.session_id;

    // Wire up events
    keyboard.on('changed', (state) => net.sendKeyboardState(state));
    net.on('state_change', this.updateEntities.bind(this));
    net.on('disconnect', () => alert('DISCONNECTED'));

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    this.camera.position.x = -50;
    this.camera.position.z = 40;
    this.camera.rotation.y = -1;
    this.camera.rotation.z = Math.PI / 2 * 3;

    this.renderer = new THREE.WebGLRenderer({ canvas: $('canvas')[0], antialias:true });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Window resize stuff
    var resizeTimer = null;
    $(window).on('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }, 250);
    });

    var grid = new THREE.GridHelper(2000, 50, 0xff8d0a, 0x555555);
    grid.position.x = 2000;
    grid.position.y = 2000;
    grid.rotation.x = Math.PI/2;
    this.scene.add(grid);

    var axes = new THREE.AxisHelper(2);
    this.scene.add(axes);

    this.ships = {};
    this.projectiles = {};

    this.light = this.createLight();
    this.scene.add(this.light);

    this.light = this.createLight();
    this.scene.add(this.light);

    this.renderScene();
    net.joinGame();
  },

  willDestroyElement() {
    $(window).off('resize');
    net.leaveGame();
  },

  renderScene() {
    requestAnimationFrame(this.renderScene.bind(this));

    this.renderer.render(this.scene, this.camera);

    this.tick++;
  },

  updateEntities() {
    let frame_data = net.current_state;
    let game_objects = frame_data.state;

    var ship_ids = Object.keys(this.ships);
    game_objects.ships.forEach((ship) => {
      if(!(ship.id in this.ships)) this.addShipObj(ship);

      this.ships[ship.id].mesh.position.x = ship.x;
      this.ships[ship.id].mesh.position.y = ship.y;
      this.ships[ship.id].mesh.rotation.z = ship.rotation + Math.PI/2;

      ship_ids.splice(ship_ids.indexOf(ship.id), 1)
    });
    ship_ids.forEach((id) => {
      this.scene.remove(this.ships[id].mesh);
      delete this.ships[id];
    });

    var projectile_ids = Object.keys(this.projectiles);
    game_objects.projectiles.forEach((projectile) => {
      console.log(projectile.id);
      if(!(projectile.id in this.projectiles)) this.addProjectileObj(projectile);

      this.projectiles[projectile.id].mesh.position.x = projectile.x;
      this.projectiles[projectile.id].mesh.position.y = projectile.y;

      projectile_ids.splice(projectile_ids.indexOf(projectile.id), 1)
    });
    projectile_ids.forEach((id) => {
      this.scene.remove(this.projectiles[id].mesh);
      delete this.projectiles[id];
    });
  },

  addShipObj(ship) {
    console.log('ADDING SHIP');

    var geometry = new THREE.BoxGeometry(20, 20, 5);
    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00});

    var mesh = new THREE.Mesh(geometry, material);

    this.ships[ship.id] = {
      id: ship.id,
      mesh: mesh
    };

    if(net.session_id == ship.id) {
      mesh.add(this.camera);
    }

    this.scene.add(mesh);
  },

  addProjectileObj(projectile) {
    var geometry = new THREE.BoxGeometry(3, 3, 3);

    var material = new THREE.MeshLambertMaterial({ color: 0xff0000});

    var mesh = new THREE.Mesh(geometry, material);

    this.projectiles[projectile.id] = {
      id: projectile.id,
      mesh: mesh
    };

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
