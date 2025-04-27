
import Polygon from './polygon'
import Circle from './circle'

describe('Polygon', () => {
  it('initializes with correct properties', () => {
    const p = new Polygon(10, 20, 30, 5)
    expect(p.x).toBe(10)
    expect(p.y).toBe(20)
    expect(p.r).toBe(30)
    expect(p.s).toBe(5)
    expect(p.speed).toEqual({ x: 0, y: 0 })
    expect(p.points).toEqual([])
    expect(p.sides).toEqual([])
    expect(p.color).toBe(' rgb(0, 0, 200)')
    expect(p.hp).toBe(3)
  })

  it('setSpeed updates speed.x and speed.y', () => {
    const p = new Polygon(0, 0, 1, 3)
    p.setSpeed(4, -7)
    expect(p.speed.x).toBe(4)
    expect(p.speed.y).toBe(-7)
  })

  it('getter radius returns r', () => {
    const p = new Polygon(0, 0, 12, 6)
    expect(p.radius).toBe(12)
  })

  describe('intersect()', () => {
    const p = new Polygon(0, 0, 1, 3)

    it('returns "collinear" for parallel segments', () => {
      const s1 = [ { x: 0, y: 0 }, { x: 10, y: 0 } ]
      const s2 = [ { x: 0, y: 5 }, { x: 10, y: 5 } ]
      expect(p.intersect(s1, s2)).toBe('collinear')
    })

    it('returns correct parameters for crossing segments', () => {
      const s1 = [ { x: 0, y: 0 }, { x: 10, y: 0 } ]
      const s2 = [ { x: 5, y: -5 }, { x: 5, y: 5 } ]
      const t = p.intersect(s1, s2)
      expect(Array.isArray(t)).toBe(true)
      // they cross at (5,0) which is halfway on each segment
      expect(t[0]).toBeCloseTo(0.5)
      expect(t[1]).toBeCloseTo(0.5)
    })
  })

  describe('collides(polygon)', () => {
    // polygon A has one side from (0,0)→(10,0)
    const a = new Polygon(0, 0, 1, 3)
    a.sides = [
      [ { x: 0, y: 0 }, { x: 10, y: 0 } ]
    ]
    // polygon B has one side crossing that at x=5
    const b = new Polygon(0, 0, 1, 3)
    b.sides = [
      [ { x: 5, y: -5 }, { x: 5, y: 5 } ]
    ]
    // polygon C has side far away
    const c = new Polygon(0, 0, 1, 3)
    c.sides = [
      [ { x: 0, y: 10 }, { x: 10, y: 10 } ]
    ]

    it('detects collision when edges intersect', () => {
      expect(a.collides(b)).toBe(true)
      expect(b.collides(a)).toBe(true)
    })

    it('returns false when edges do not intersect', () => {
      expect(a.collides(c)).toBe(false)
      expect(c.collides(a)).toBe(false)
    })
  })


  describe('collides() polygon-vs-circle', () => {

    const poly = new Polygon(0, 0, 1, 3)
    poly.sides = [
      [ { x: 0, y: 5 }, { x: 10, y: 5 } ]
    ]
  
    it('returns true when circle intersects polygon edge', () => {
      const c = new Circle(5, 2, 4)   // до линии y=5 ровно 3
      expect(poly.collides(c)).toBe(true)
    })
  
    it('returns false when circle does not reach the edge', () => {
      const c = new Circle(5, 2, 1)   // до линии y=5 расстояние 3 > 1
      expect(poly.collides(c)).toBe(false)
    })
  })
  
  describe('draw()', () => {
    beforeAll(() => {
      // мок Path2D для тестов
      global.Path2D = class {
        constructor() {
          this.commands = []
        }
        moveTo(x, y) {
          this.commands.push(['moveTo', x, y])
        }
        lineTo(x, y) {
          this.commands.push(['lineTo', x, y])
        }
        closePath() {
          this.commands.push(['closePath'])
        }
      }
    })
  
    it('invokes canvas 2D context fill with a Path2D', () => {
      const mockContext = {
        fill: jest.fn(),
        fillStyle: null
      }
      const mockCanvas = {
        getContext: jest.fn(() => mockContext)
      }
  
      const p = new Polygon(20, 30, 15, 6)
      p.draw(mockCanvas)
  
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d')
      expect(mockContext.fillStyle).toBe(p.color)
      expect(mockContext.fill).toHaveBeenCalledWith(expect.any(Path2D))
    })
  })
  
  
})
