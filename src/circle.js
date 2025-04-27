export default class Circle {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.speed = {x: 0, y: 0}
        this.color = " rgb(245, 41, 65)";
        this.hp = 3;
    }

    setSpeed(x, y){
        this.speed.x = x
        this.speed.y = y
    }
    get radius() {
        return this.r
    }


    contains(point) {
        let dX = point.x - this.x;
        let dY = point.y - this.y;
        let d = Math.sqrt(dX*dX + dY*dY);
        if (d <= this.r)
            return true
        else return false
    }

    collidesLine(line){
        let p1 = { x: line[0].x, y: line[0].y };
        let p2 = { x: line[1].x, y: line[1].y };
        if (this.contains(p1) || this.contains(p2))
            return true

        let distX = p1.x - p2.x;
        let distY = p1.y - p2.y;
        let len = Math.sqrt((distX*distX) + (distY*distY) );

        let dot = (((this.x - p1.x)*(p2.x - p1.x))+((this.y - p1.y)*(p2.y - p1.y))) / (len*len);

        let closestX = p1.x  + (dot * (p2.x - p1.x));
        let closestY = p1.y + (dot * (p2.y - p1.y));
       
        if (!this.linePoint({x: closestX, y: closestY},line))
            return false;

        distX = closestX - this.x;
        distY = closestY - this.y;
        let distance = Math.sqrt((distX*distX) + (distY*distY) );
        if (distance <= this.r)
            return true;
        else 
            return false;
    }

    collides(obj){
        if (obj.sides){
            for (let i = 0; i < obj.sides.length; i++){
                if (this.collidesLine(obj.sides[i]))
                    return true
            }
            return false
        }
        else {
            let a = this.x - obj.x;
            let b = this.y - obj.y;
            let c = (a*a)+(b*b);
            let radii = this.r + obj.r;
            
            return radii*radii >=c;
        }

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
        //if (d1 + d2 === len)
            return true;
        else
            return false;
    }

    draw(canvas){
        const context = canvas.getContext('2d');
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        context.closePath();
        context.fillStyle =this.color;
        context.fill()
    }

}