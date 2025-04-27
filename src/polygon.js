export default class Polygon {
    constructor(x,y,r,s) {
        this.x = x
        this.y = y
        this.r = r
        this.s = s;
        this.speed = {x: 0, y: 0}
        this.points = []
        this.sides = []
        this.color =" rgb(0, 0, 200)";
        this.hp = 3
    }

    setSpeed(x, y){
        this.speed.x = x
        this.speed.y = y
    }
    get radius() {
        return this.r
    }


    contains(point, circle) {
        let dX = point.x - circle.x;
        let dY = point.y - circle.y;
        let d = Math.sqrt(dX*dX + dY*dY);
        if (d <= circle.r)
            return true
        else return false
    }

    intersect(s1,s2) {
        if(((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)) === 0) {
            return 'collinear';
          }
          var tA =  ((s2[0].y - s2[1].y)*(s1[0].x - s2[0].x) + (s2[1].x - s2[0].x)*(s1[0].y - s2[0].y))/
                    ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)),
              tB =  ((s1[0].y - s1[1].y)*(s1[0].x - s2[0].x) + (s1[1].x - s1[0].x)*(s1[0].y - s2[0].y))/
                    ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y));
          return [tA, tB];
    }
    collides(obj){

        if(obj.sides){

            for(var i in this.sides) {
                for(var j in obj.sides) {
                  var t = this.intersect(this.sides[i],obj.sides[j]);
                  if(t === 'collinear') {continue;}
                  if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
                    return true;
                  }
                }
              }
              return false;
        }
        else {
            for (let i = 0; i < this.sides.length; i++){
                if (this.collidesLine(this.sides[i], obj))
                    return true
                    
             }
             return false
        }

    }
    collidesLine(line, circle){
        let p1 = { x: line[0].x, y: line[0].y };
        let p2 = { x: line[1].x, y: line[1].y };
        if (this.contains(p1, circle) || this.contains(p2, circle))
            return true

        let distX = p1.x - p2.x;
        let distY = p1.y - p2.y;
        let len = Math.sqrt((distX*distX) + (distY*distY) );

        let dot = (((circle.x - p1.x)*(p2.x - p1.x))+((circle.y - p1.y)*(p2.y - p1.y))) / (len*len);

        let closestX = p1.x  + (dot * (p2.x- p1.x));
        let closestY = p1.y + (dot * (p2.y - p1.y));
       
        if (!this.linePoint({x: closestX, y: closestY},line))
            return false;

        distX = closestX - circle.x;
        distY = closestY - circle.y;
        let distance = Math.sqrt((distX*distX) + (distY*distY) );
        if (distance <= circle.r)
            return true;
        else 
            return false;
    }

    linePoint(point,line){
        let p1 = { x: line[0].x, y: line[0].y };
        let p2 = { x: line[1].x, y: line[1].y };

        let distX = p1.x - p2.x;
        let distY = p1.y - p2.y;
        let len = Math.sqrt((distX*distX) + (distY*distY) );

        //расстояние от точки до точек линии
        let d1X =p1.x - point.x;
        let d1Y = p1.y - point.y;
        let d2X = p2.x - point.x;
        let d2Y = p2.y - point.y;

        let d1 = Math.sqrt((d1X*d1X) + (d1Y*d1Y));
        let d2 = Math.sqrt((d2X*d2X) + (d2Y*d2Y));

        const buf = 0.01;

        if (d1 + d2 >= len-buf && d1+d2 <= len+buf)
      //  if (d1 + d2 === len)
            return true;
        else
            return false;
    }

    draw(canvas){
        const context = canvas.getContext('2d');
        let a = Math.PI/2;
        let region = new Path2D();
        this.points = [];
        this.sides = [];

        for (let i = 0;i<=this.s;i++){
            let px = this.x + this.r*Math.cos(a), py = this.y +this.r*Math.sin(a);
            if (i === 0)
                region.moveTo(px,py);
            else {
                region.lineTo(px,py);
                this.sides.push([{x : this.points[i-1].x, y: this.points[i-1].y}, {x: px, y: py}]);
            }
            this.points.push({x: px,y:py});
            a += Math.PI*2/this.s;
        }
        region.closePath();
        
        this.points.pop();
        context.fillStyle =this.color;
        context.fill(region);
    }

   
 
}