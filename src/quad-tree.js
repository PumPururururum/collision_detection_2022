import Rectangle from './rectangle'
import Circle from './circle'

export default class QuadTree {
    constructor(boundary, capacity = 4, max_levels = 5, level = 0) {
        if (!boundary) {
            throw TypeError('boundary is null or undefined')
        }

        if (!(boundary instanceof Rectangle)) {
            throw TypeError('boundary should be a Rectangle')
        }


        this._capacity = capacity
        this._max_levels = max_levels;
        this._level = level;

        this._boundary = boundary


        this._objects = []
        this._nodes = []

    }

    // todo
    insert(rect) {
        let i = 0,
            indexes;

        if(this._nodes.length){
            indexes = this._getIndex(rect)

            for(i = 0; i < indexes.length; i++){
                this._nodes[indexes[i]].insert(rect);
            }
            return;
        }

        this._objects.push(rect);
        if(this._objects.length > this._capacity && this._level < this._max_levels){
            if(!this._nodes.length){
                this._split();
            }

            for(i = 0; i <this._objects.length; i++) {
                indexes = this._getIndex(this._objects[i]);
                for(var k = 0; k < indexes.length; k++) {
                    this._nodes[indexes[k]].insert(this._objects[i]);
                }
            }

            //clean up this node
            this._objects = [];
        }


    }
    

   retrieve(rect){
    var indexes = this._getIndex(rect),
            returnObjects = this._objects;
            
        //if we have subnodes, retrieve their objects
        if(this._nodes.length) {
            for(var i=0; i<indexes.length; i++) {
                returnObjects = returnObjects.concat(this._nodes[indexes[i]].retrieve(rect));
            }
        }

        //remove duplicates
        if(this._level === 0) {
            return Array.from(new Set(returnObjects));
        }
     
        return returnObjects;
   }

    _getIndex(figure) {
    let indexes = [];
    let verticalMidpoint = this._boundary.x + (this._boundary.w / 2);
    let horizontalMidpoint = this._boundary.y + (this._boundary.h / 2);

    let left, right, top, bottom;

    if (figure instanceof Circle || figure.r !== undefined) {
        // Объект — круг или полигон с радиусом
        left = figure.x - figure.r;
        right = figure.x + figure.r;
        top = figure.y - figure.r;
        bottom = figure.y + figure.r;
    } else {
        // Объект — прямоугольник
        left = figure.x;
        right = figure.x + figure.w;
        top = figure.y;
        bottom = figure.y + figure.h;
    }

    const startIsNorth = top < horizontalMidpoint;
    const startIsWest = left < verticalMidpoint;
    const endIsEast = right > verticalMidpoint;
    const endIsSouth = bottom > horizontalMidpoint;

    if (startIsNorth && endIsEast) {
        indexes.push(0);
    }
    if (startIsWest && startIsNorth) {
        indexes.push(1);
    }
    if (startIsWest && endIsSouth) {
        indexes.push(2);
    }
    if (endIsEast && endIsSouth) {
        indexes.push(3);
    }

    return indexes;
}


    // todo call if the number of elements is too big
    _split() {
        let nextLevel = this._level + 1,
            subWidth = this._boundary.w/2,
            subHeight = this._boundary.h/2,
            x = this._boundary.x,
            y = this._boundary.y;

            let r = new Rectangle(x + subWidth,y,subWidth,subHeight)
            //top right node
        this._nodes[0] = new QuadTree(r, this._capacity, this._max_levels, nextLevel);
        
        //top left node
        r = new Rectangle(x,y,subWidth,subHeight)
        this._nodes[1] = new QuadTree(r, this._capacity, this._max_levels, nextLevel);
        
        
        //bottom left node
        r = new Rectangle(x,y+ subHeight,subWidth,subHeight)
        this._nodes[2] = new QuadTree(r, this._capacity, this._max_levels, nextLevel);
        
        
        //bottom right node
        r = new Rectangle(x+ subWidth,y+ subHeight,subWidth,subHeight)
        this._nodes[3] = new QuadTree(r, this._capacity, this._max_levels, nextLevel);
        

    }

    clear() {
        this._objects = [];
     
        for(var i=0; i < this._nodes.length; i++) {
            if(this._nodes.length) {
                this._nodes[i].clear();
              }
        }

        this._nodes = [];
    }
}
