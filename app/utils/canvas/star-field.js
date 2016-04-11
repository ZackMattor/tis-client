import Ember from 'ember';

export default function() {
  let width = 1024,
      height = 768,
      num_stars = 100;


  var $canvas = Ember.$('<canvas></canvas>');
  $canvas.attr({
    width: 1024,
    height: 768,
  });

  Ember.$('body').append($canvas);

  var ctx=$canvas[0].getContext("2d");
  ctx.fillStyle="#000000";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle="#FFFFFF";

  for(var i = 0; i < num_stars; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * width,Math.random() * height,1,0,2*Math.PI);
    ctx.stroke();
  }

  return new Ember.RSVP.Promise(function(resolve) {
    let data = $canvas[0].toDataURL();
    $canvas.remove();
    let image = new Image();

    image.onload = function() {
      resolve(image);
    };

    image.src = data;
  });
}
