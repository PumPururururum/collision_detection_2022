
import Circle from './circle'
import Polygon from './polygon'

describe('Circle', () => {
  it('initializes with correct properties', () => {
    const c = new Circle(10, 20, 5)
    expect(c.x).toBe(10)
    expect(c.y).toBe(20)
    expect(c.r).toBe(5)
    expect(c.speed).toEqual({ x: 0, y: 0 })
    expect(c.color).toBe(' rgb(245, 41, 65)')
    expect(c.hp).toBe(3)
  })

  it('setSpeed updates speed.x and speed.y', () => {
    const c = new Circle(0, 0, 1)
    c.setSpeed(7, -4)
    expect(c.speed.x).toBe(7)
    expect(c.speed.y).toBe(-4)
  })

  it('getter radius returns r', () => {
    const c = new Circle(0, 0, 12)
    expect(c.radius).toBe(12)
  })

  describe('contains()', () => {
    const c = new Circle(0, 0, 10)

    it('returns true for a point at center', () => {
      expect(c.contains({ x: 0, y: 0 })).toBe(true)
    })

    it('returns true for a point on the boundary', () => {
      expect(c.contains({ x: 10, y: 0 })).toBe(true)
    })

    it('returns false for a point outside', () => {
      expect(c.contains({ x: 10.1, y: 0 })).toBe(false)
    })
  })

  describe('collides() circle-vs-circle', () => {
    it('returns true when circles overlap', () => {
      const c1 = new Circle(0, 0, 10)
      const c2 = new Circle(15, 0, 10)  // distance 15, sum radii 20
      expect(c1.collides(c2)).toBe(true)
      expect(c2.collides(c1)).toBe(true)
    })

    it('returns false when circles just separate', () => {
      const c1 = new Circle(0, 0, 10)
      const c2 = new Circle(21, 0, 10)  // distance 21, sum radii 20
      expect(c1.collides(c2)).toBe(false)
    })
  })

  describe('draw()', () => {
    it('invokes canvas 2D context methods', () => {
      // create fake context
      const mockContext = {
        beginPath: jest.fn(),
        arc: jest.fn(),
        closePath: jest.fn(),
        fill: jest.fn(),
        fillStyle: null
      }
      const mockCanvas = {
        getContext: jest.fn(() => mockContext)
      }

      const c = new Circle(5, 6, 7)
      c.draw(mockCanvas)

      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
      expect(mockContext.beginPath).toHaveBeenCalled()
      expect(mockContext.arc).toHaveBeenCalledWith(5, 6, 7, 0, 2 * Math.PI)
      expect(mockContext.closePath).toHaveBeenCalled()
      expect(mockContext.fillStyle).toBe(c.color)
      expect(mockContext.fill).toHaveBeenCalled()
    })
  })

  
  describe('collides() circle-vs-polygon ', () => {
    const poly = new Polygon(0, 0, 1, 3)
    poly.sides = [
      [ { x: 0, y: 5 }, { x: 10, y: 5 } ]
    ]
  
    it('returns true when circle intersects that polygon edge', () => {
      const c = new Circle(5, 2, 4)    // до линии y=5 ровно 3
      expect(c.collides(poly)).toBe(true)
    })
  
    it('returns false when circle does not reach the edge', () => {
      const c = new Circle(5, 2, 1)    // до линии y=5 — расстояние 3, радиус 1
      expect(c.collides(poly)).toBe(false)
    })
  })
})
