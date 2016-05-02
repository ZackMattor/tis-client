// TODO: More maths :)
//
// Need to be able to position the map.. this means that we
// should draw everything based on the "origin" of the minimap.

export default function(ctx, state, map_size, position) {
  map_size = [4000, 4000];
  let minimap_size = [200, 200];

  ctx.beginPath();
  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 5;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, minimap_size[0], minimap_size[1]);
  ctx.strokeRect(0, 0, minimap_size[0], minimap_size[1]);

  var scale = minimap_size[0] / map_size[0];

  state.ships.forEach((ship) => {
    ctx.lineWidth = 1;
    ctx.strokeRect(scale * ship.x, scale * ship.y, 1, 1);
  });

  ctx.stroke();
}
