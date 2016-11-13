import BaseObject from './base-object';
import ObjLoader from './obj-loader';

var MeshManager = function(mesh_data) {
  if(mesh_data) this.meshes = mesh_data;
};

MeshManager.prototype = Object.assign({}, BaseObject, {
  loaded_count: 0,

  meshes: {
    space_frigate: {
      path: 'meshes/space_frigate.obj',
      object: null
    }
  },

  load(callback) {
    this.loaded_callback = callback;
    var loader = new ObjLoader();

    for(var mesh_name in this.meshes) {
      var mesh = this.meshes[mesh_name];

      loader.load(
        mesh.path,
        this._loaded.bind({callback: callback, self: this, mesh_name: mesh_name}),
        this._progress.bind(this),
        this._error.bind(this)
      );
    }
  },

  _loaded(object) {
    var self     = this.self;
    var callback = this.callback;
    var mesh_name = this.mesh_name;

    self.meshes[mesh_name].object = object;

    // Let the caller know if we hve all meshes loaded
    if(self.loaded_count == Object.keys(self.meshes).length-1) callback();

    self.loaded_count++;
  },

  _progress(xhr) {
    console.log('progress or soemthing: ' + xhr.loaded);
  },

  _error(err) {
    console.error('Failed to load something...');
  }
});

export default MeshManager;
