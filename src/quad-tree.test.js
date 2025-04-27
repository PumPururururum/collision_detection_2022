import Rectangle from './rectangle'
import QuadTree from './quad-tree'
import Circle from './circle'

describe('QuadTree', () => {
    it('should be empty in the initial state', () => {
        const boundary = new Rectangle(0, 0, 100, 100)
        const tree = new QuadTree(boundary)

        expect(tree._objects).toHaveLength(0)
        expect(tree._nodes).toHaveLength(0)
    })

    it('should throw an exception when boundary has not been passed', () => {
        expect(() => {
            const tree = new QuadTree()
        }).toThrow(TypeError)
    })

    it('should throw an exception when boundary is not a Rectangle', () => {
        expect(() => {
            const tree = new QuadTree(42)
        }).toThrow(TypeError)
    })
})
it('inserts one rectangle and retrieve returns it', () => {
    const boundary = new Rectangle(0, 0, 100, 100)
    const tree = new QuadTree(boundary, /*capacity*/4, /*max_levels*/1)
    const r = new Rectangle(10, 10, 20, 20)

    tree.insert(r)
    const found = tree.retrieve(r)

    expect(found).toContain(r)
    expect(found).toHaveLength(1)
  })

  it('clear() removes all objects and children', () => {
    const boundary = new Rectangle(0, 0, 100, 100)
    const tree = new QuadTree(boundary, 1, 1)
    const r1 = new Rectangle(10, 10, 10, 10)
    const r2 = new Rectangle(80, 80, 10, 10)

    tree.insert(r1)
    tree.insert(r2)    // capacity=1 → должен сплититься
    expect(tree._nodes.length).toBe(4)
    tree.clear()
    expect(tree._objects).toHaveLength(0)
    expect(tree._nodes).toHaveLength(0)
  })

  it('splits into 4 quadrants when capacity exceeded', () => {
    const boundary = new Rectangle(0, 0, 100, 100)
    const tree = new QuadTree(boundary, /*capacity*/1, /*max_levels*/2)
    const r1 = new Rectangle(10, 10, 5, 5)
    const r2 = new Rectangle(80, 10, 5, 5)

    tree.insert(r1)
    // после первой вставки _objects=[r1]
    expect(tree._objects).toHaveLength(1)
    tree.insert(r2)
    // capacity=1, level=0 < max_levels → split
    expect(tree._nodes.length).toBe(4)
    // после split корневой _objects очищается
    expect(tree._objects).toHaveLength(0)
  })

  it('retrieve returns only objects in the same quadrant and de-duplicates', () => {
    const boundary = new Rectangle(0, 0, 100, 100)
    const tree = new QuadTree(boundary, /*capacity*/1, /*max_levels*/2)
    const r1 = new Rectangle(10, 10, 5, 5)   // попадёт в quad 1
    const r2 = new Rectangle(12, 12, 5, 5)   // тоже в quad 1
    const r3 = new Rectangle(80, 80, 5, 5)   // в quad 3

    tree.insert(r1)
    tree.insert(r2)
    tree.insert(r3)

    // проверим retrieve для r1 (кандидаты: r1 и r2, но не r3)
    const found1 = tree.retrieve(r1)
    expect(found1).toContain(r1)
    expect(found1).toContain(r2)
    expect(found1).not.toContain(r3)

    // проверим retrieve для r3
    const found3 = tree.retrieve(r3)
    expect(found3).toContain(r3)
    expect(found3).not.toContain(r1)
  })

  it('supports inserting and retrieving Circles', () => {
    const boundary = new Rectangle(0, 0, 200, 200)
    const tree = new QuadTree(boundary, 2, 2)
    const c1 = new Circle(50, 50, 10)
    const c2 = new Circle(150, 50, 10)
    tree.insert(c1)
    tree.insert(c2)

    // оба круга лежат в пределах корня
    const all = tree.retrieve(new Circle(100, 100, 150))
    expect(all).toHaveLength(2)
    expect(all).toContain(c1)
    expect(all).toContain(c2)
  })