let potrace = require('potrace');
let fs = require('fs');

let posterizer = potrace.Posterize();

posterizer.loadImage('zen-of-perfect-fit.jpg', function(err) {
  if (err) throw err;
  
  posterizer.setParameter({
    color: '#ccc',
    background: '#222',
    steps: 3,
    threshold: 200,
    fillStrategy: potrace.Posterize.FILL_MEAN
  });
  
  let mySVG = posterizer.getSVG();
  console.log(mySVG);
  fs.writeFileSync('./zen-of-perfect-fit.poster.svg', mySVG);
});