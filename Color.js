
function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [f(5),f(3),f(1)];       
}

function shuffleColor(c, amount) {
  let r = red(c) + random(-amount, amount);
  let g = green(c) + random(-amount, amount);
  let b = blue(c) + random(-amount, amount);
  return color(r, g, b, alpha(c));
}
