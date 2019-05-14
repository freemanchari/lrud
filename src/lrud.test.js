/* eslint-env jest */

const { Lrud } = require('./index')

describe('lrud', () => {
  describe('registerNode()', () => {
    test('registering the very first registered node sets it to the root node', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', {
        selectAction: true
      })

      expect(navigation.rootNodeId).toEqual('root')
      expect(navigation.tree).toMatchObject({
        root: {
          selectAction: true
        }
      })
    })

    test('registering a node (after the root node) without a parent puts it under the root node', () => {
      const navigation = new Lrud()

      navigation.registerNode('alpha', { z: 1 })
      navigation.registerNode('beta', { x: 1 })
      navigation.registerNode('charlie', { x: 2 })

      expect(navigation.tree).toMatchObject({
        alpha: {
          z: 1,
          children: {
            beta: { x: 1 },
            charlie: { x: 2 }
          }
        }
      })
    })

    test('registering a node with a nested parent', () => {
      const navigation = new Lrud()

      navigation.registerNode('alpha', { a: 1 })
      navigation.registerNode('beta', { b: 2 })
      navigation.registerNode('charlie', { c: 3, parent: 'beta' })

      expect(navigation.tree).toMatchObject({
        alpha: {
          a: 1,
          children: {
            beta: {
              b: 2,
              parent: 'alpha',
              children: {
                charlie: { c: 3, parent: 'beta' }
              }
            }
          }
        }
      })
    })

    test('registering a node with a deeply nested parent', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('region-a', { parent: 'root' })
      navigation.registerNode('region-b', { parent: 'root' })
      navigation.registerNode('content-grid', { parent: 'region-b' })
      navigation.registerNode('PID-X', { parent: 'content-grid' })
      navigation.registerNode('PID-Y', { parent: 'content-grid' })
      navigation.registerNode('PID-Z', { parent: 'content-grid' })

      expect(navigation.tree).toMatchObject({
        root: {
          children: {
            'region-a': {
              parent: 'root'
            },
            'region-b': {
              parent: 'root',
              children: {
                'content-grid': {
                  parent: 'region-b',
                  children: {
                    'PID-X': {
                      parent: 'content-grid'
                    },
                    'PID-Y': {
                      parent: 'content-grid'
                    },
                    'PID-Z': {
                      parent: 'content-grid'
                    }
                  }
                }
              }
            }
          }
        }
      })
    })

    // reword this
    test('registering a new node with a parent that has no children sets its parent.activeChild to itself', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('alpha', { parent: 'root' })
      navigation.registerNode('beta', { parent: 'root' })
      navigation.registerNode('charlie', { parent: 'alpha' })
      navigation.registerNode('delta', { parent: 'charlie' })
      navigation.registerNode('echo', { parent: 'root' })

      // 'root' should have 3 children and its activeChild should be 'alpha'
      // 'alpha' should have 1 children and its activeChild should be 'charlie'
      // 'charlie' should have 1 children and its activeChild should be 'delta'

      expect(navigation.getNode('root').activeChild).toEqual('alpha')
      expect(navigation.getNode('alpha').activeChild).toEqual('charlie')
      expect(navigation.getNode('charlie').activeChild).toEqual('delta')
    })

    test('registering a node should add the index to the node', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a')

      navigation.registerNode('b')
      navigation.registerNode('b-1', { parent: 'b' })
      navigation.registerNode('b-2', { parent: 'b' })

      navigation.registerNode('c')

      expect(navigation.getNode('a').index).toEqual(0)
      expect(navigation.getNode('b').index).toEqual(1)
      expect(navigation.getNode('b-1').index).toEqual(0)
      expect(navigation.getNode('b-2').index).toEqual(1)
      expect(navigation.getNode('c').index).toEqual(2)
    })

    test('can chain registers together', () => {
      const navigation = new Lrud()

      navigation
        .registerNode('root')
        .registerNode('a')
        .registerNode('b')
        .registerNode('c')

      expect(navigation.tree).toMatchObject({
        root: {
          id: 'root',
          activeChild: 'a',
          children: {
            a: {
              id: 'a',
              parent: 'root',
              index: 0
            },
            b: {
              id: 'b',
              parent: 'root',
              index: 1
            },
            c: {
              id: 'c',
              parent: 'root',
              index: 2
            }
          }
        }
      })
    })
  })

  describe('getRootNode()', () => {
    test('return the root node', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')

      const node = navigation.getRootNode()

      expect(node.id).toEqual('root')
    })
  })

  describe('getNode()', () => {
    test('get a nested node with no children by id', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('region-a', { parent: 'root' })
      navigation.registerNode('region-b', { parent: 'root' })
      navigation.registerNode('content-grid', { parent: 'region-b' })
      navigation.registerNode('PID-X', { action: 1, parent: 'content-grid' })
      navigation.registerNode('PID-Y', { action: 2, parent: 'content-grid' })
      navigation.registerNode('PID-Z', { action: 3, parent: 'content-grid' })

      const node = navigation.getNode('PID-X')

      expect(node).toMatchObject({
        action: 1,
        parent: 'content-grid'
      })
    })

    test('get a nested node with children by id and make sure the entire tree comes with it', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('region-a', { parent: 'root' })
      navigation.registerNode('DEAD-X', { action: 1, parent: 'region-a' })
      navigation.registerNode('DEAD-Y', { action: 2, parent: 'region-a' })
      navigation.registerNode('DEAD-Z', { action: 3, parent: 'region-a' })
      navigation.registerNode('region-b', { parent: 'root' })
      navigation.registerNode('content-grid', { parent: 'region-b' })
      navigation.registerNode('PID-X', { action: 1, parent: 'content-grid' })
      navigation.registerNode('PID-Y', { action: 2, parent: 'content-grid' })
      navigation.registerNode('PID-Z', { action: 3, parent: 'content-grid' })

      const node = navigation.getNode('region-b')

      expect(node).toMatchObject({
        parent: 'root',
        children: {
          'content-grid': {
            parent: 'region-b',
            children: {
              'PID-X': {
                parent: 'content-grid'
              },
              'PID-Y': {
                parent: 'content-grid'
              },
              'PID-Z': {
                parent: 'content-grid'
              }
            }
          }
        }
      })
    })
  })

  describe('isDirectionAndOrientationMatching()', () => {
    const navigation = new Lrud()
    test('vertical and up is true', () => {
      expect(navigation.isDirectionAndOrientationMatching('vertical', 'up')).toEqual(true)
    })
    test('vertical and down is true', () => {
      expect(navigation.isDirectionAndOrientationMatching('vertical', 'down')).toEqual(true)
    })
    test('horizontal and left is true', () => {
      expect(navigation.isDirectionAndOrientationMatching('horizontal', 'left')).toEqual(true)
    })
    test('horizontal and right is true', () => {
      expect(navigation.isDirectionAndOrientationMatching('horizontal', 'right')).toEqual(true)
    })
    test('vertical and left is false', () => {
      expect(navigation.isDirectionAndOrientationMatching('vertical', 'left')).toEqual(false)
    })
    test('vertical and right is false', () => {
      expect(navigation.isDirectionAndOrientationMatching('vertical', 'right')).toEqual(false)
    })
    test('horizontal and up is false', () => {
      expect(navigation.isDirectionAndOrientationMatching('horizontal', 'up')).toEqual(false)
    })
    test('horizontal and down is false', () => {
      expect(navigation.isDirectionAndOrientationMatching('horizontal', 'down')).toEqual(false)
    })
  })

  describe('pickNode()', () => {
    test('pick a nested node', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { selectAction: 1 })
      navigation.registerNode('BOX_A', { selectAction: 2 })
      navigation.registerNode('NODE_1', { selectAction: 11, parent: 'BOX_A' })
      navigation.registerNode('NODE_2', { selectAction: 12, parent: 'BOX_A' })
      navigation.registerNode('NODE_3', { selectAction: 13, parent: 'BOX_A' })

      const node2 = navigation.pickNode('NODE_2')

      expect(node2).toMatchObject({ selectAction: 12, parent: 'BOX_A' })
      expect(navigation.tree).toMatchObject({
        root: {
          selectAction: 1,
          children: {
            BOX_A: {
              selectAction: 2,
              parent: 'root',
              children: {
                NODE_1: {
                  selectAction: 11,
                  parent: 'BOX_A'
                },
                NODE_3: {
                  selectAction: 13,
                  parent: 'BOX_A'
                }
              }
            }
          }
        }
      })
    })
  })

  describe('assignFocus()', () => {
    test('assigning focus should set the `activeChild` of all the nodes back up the tree', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('region-a', { parent: 'root' })
      navigation.registerNode('region-b', { parent: 'root' })
      navigation.registerNode('content-grid', { parent: 'region-b' })
      navigation.registerNode('PID-X', { selectAction: 1, parent: 'content-grid' })
      navigation.registerNode('PID-Y', { selectAction: 2, parent: 'content-grid' })
      navigation.registerNode('PID-Z', { selectAction: 3, parent: 'content-grid' })

      navigation.assignFocus('PID-Y')

      expect(navigation.getNode('content-grid').activeChild).toEqual('PID-Y')
      expect(navigation.getNode('region-b').activeChild).toEqual('content-grid')
      expect(navigation.getNode('root').activeChild).toEqual('region-b')
    })

    test('assigning focus should set the currentFocusNodeId of the instance', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { parent: 'root', isFocusable: true })
      navigation.registerNode('b', { parent: 'root', isFocusable: true })
      navigation.registerNode('c', { parent: 'root', isFocusable: true })

      navigation.assignFocus('b')

      expect(navigation.currentFocusNodeId).toEqual('b')
      expect(navigation.getNode('root').activeChild).toEqual('b')
    })
  })

  describe('climbUp()', () => {
    test('scan up the tree 1 level', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'vertical' })
      navigation.registerNode('BOX_A', { parent: 'root', orientation: 'horizontal' })
      navigation.registerNode('BOX_B', { parent: 'root', orientation: 'horizontal' })
      navigation.registerNode('NODE_1', { parent: 'BOX_B', isFocusable: true })
      navigation.registerNode('NODE_2', { parent: 'BOX_B', isFocusable: true })
      navigation.registerNode('NODE_3', { parent: 'BOX_B', isFocusable: true })

      navigation.assignFocus('NODE_2')

      const nextActionableNode = navigation.climbUp(navigation.getNode('NODE_2'), 'right')

      expect(nextActionableNode.id).toEqual('BOX_B')
    })

    test('scan up the tree 2 levels', () => {
      const navigation = new Lrud()
      navigation.registerNode('root', { orientation: 'vertical' })
      navigation.registerNode('page', { parent: 'root', orientation: 'horizontal' })
      navigation.registerNode('BOX_A', { parent: 'page', orientation: 'vertical' })
      navigation.registerNode('BOX_B', { parent: 'page', orientation: 'vertical' })
      navigation.registerNode('NODE_1', { parent: 'BOX_A', isFocusable: true })
      navigation.registerNode('NODE_2', { parent: 'BOX_A', isFocusable: true })
      navigation.registerNode('NODE_3', { parent: 'BOX_A', isFocusable: true })
      navigation.registerNode('NODE_4', { parent: 'BOX_B', isFocusable: true })
      navigation.registerNode('NODE_5', { parent: 'BOX_B', isFocusable: true })
      navigation.registerNode('NODE_6', { parent: 'BOX_B', isFocusable: true })

      navigation.assignFocus('NODE_1')

      const nextActionableNode = navigation.climbUp(navigation.getNode('NODE_1'), 'right')

      // the parent of NODE_1 is BOX_A but we couldn't dig up to that because it was horizontal
      // and the next thing that was horizontal was the page
      expect(nextActionableNode.id).toEqual('page')
    })
  })

  describe('getNextChildInDirection()', () => {
    test('with no order values, get the next child of a node', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'horizontal' })
      navigation.registerNode('alpha', { id: 'alpha', parent: 'root', isFocusable: true })
      navigation.registerNode('beta', { id: 'beta', parent: 'root', isFocusable: true })
      navigation.registerNode('charlie', { id: 'charlie', parent: 'root', isFocusable: true })

      // default active child of 'root' is 'alpha'
      let nextChild = navigation.getNextChildInDirection(navigation.getNode('root'), 'right')

      expect(nextChild.id).toEqual('beta')

      // so then we assign focus to 'beta' and go again
      navigation.assignFocus('beta')
      nextChild = navigation.getNextChildInDirection(navigation.getNode('root'), 'right')

      expect(nextChild.id).toEqual('charlie')
    })

    test('with no order values, if the activeChild is the last child, just return that', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'horizontal' })
      navigation.registerNode('alpha', { id: 'alpha', parent: 'root', isFocusable: true })
      navigation.registerNode('beta', { id: 'beta', parent: 'root', isFocusable: true })
      navigation.registerNode('charlie', { id: 'charlie', parent: 'root', isFocusable: true })

      navigation.assignFocus('charlie')

      // we're already focused on the last child of root, so it should return that
      let nextChild = navigation.getNextChildInDirection(navigation.getNode('root'), 'right')
      expect(nextChild.id).toEqual('charlie')
    })

    test('horizontal list, direction: right', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'horizontal' })
      navigation.registerNode('a')
      navigation.registerNode('b')
      navigation.registerNode('c')

      const child = navigation.getNextChildInDirection(navigation.getNode('root'), 'right')

      expect(child.id).toEqual('b')
    })

    test('horizontal list, direction: left', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'horizontal' })
      navigation.registerNode('a', { isFocusable: true })
      navigation.registerNode('b', { isFocusable: true })
      navigation.registerNode('c', { isFocusable: true })

      navigation.assignFocus('b')

      const child = navigation.getNextChildInDirection(navigation.getNode('root'), 'left')

      expect(child.id).toEqual('a')
    })

    test('vertical list, direction: down', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'vertical' })
      navigation.registerNode('a')
      navigation.registerNode('b')
      navigation.registerNode('c')

      const child = navigation.getNextChildInDirection(navigation.getNode('root'), 'down')

      expect(child.id).toEqual('b')
    })

    test('vertical list, direction: up', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'vertical' })
      navigation.registerNode('a', { isFocusable: true })
      navigation.registerNode('b', { isFocusable: true })
      navigation.registerNode('c', { isFocusable: true })

      navigation.assignFocus('b')

      const child = navigation.getNextChildInDirection(navigation.getNode('root'), 'up')

      expect(child.id).toEqual('a')
    })
  })

  describe('digDown()', () => {
    test('dig down 2 levels', () => {
      const navigation = new Lrud()

      navigation.registerNode('root', { orientation: 'horizontal' })

      navigation.registerNode('left_column', { parent: 'root', orientation: 'vertical' })
      navigation.registerNode('right_column', { parent: 'root', orientation: 'vertical' })

      navigation.registerNode('NODE_A', { id: 'NODE_A', parent: 'left_column', isFocusable: true })
      navigation.registerNode('NODE_B', { id: 'NODE_B', parent: 'left_column', isFocusable: true })

      navigation.registerNode('NODE_C', { id: 'NODE_C', parent: 'right_column', isFocusable: true })
      navigation.registerNode('NODE_D', { id: 'NODE_D', parent: 'right_column', isFocusable: true })

      // first focusable of 'root' should be 'NODE_A'
      const root = navigation.getNode('root')
      const focusable = navigation.digDown(root)
      expect(focusable.id).toEqual('NODE_A')
    })
  })

  describe('getNextChild()', () => {
    test('get the next child when children were added without indexes', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { isFocusable: true })
      navigation.registerNode('b', { isFocusable: true })
      navigation.registerNode('c', { isFocusable: true })
      navigation.registerNode('d', { isFocusable: true })

      navigation.assignFocus('b')

      const root = navigation.getNode('root')

      expect(navigation.getNextChild(root).id).toEqual('c')
    })

    test('get the next child when children were added with indexes, out of order', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { index: 2, isFocusable: true })
      navigation.registerNode('b', { index: 4, isFocusable: true })
      navigation.registerNode('c', { index: 3, isFocusable: true })
      navigation.registerNode('d', { index: 1, isFocusable: true })

      navigation.assignFocus('d')

      const root = navigation.getNode('root')

      expect(navigation.getNextChild(root).id).toEqual('a')
    })

    test('if node is already focused on the last child, regardless of index, return that child', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { index: 2, isFocusable: true })
      navigation.registerNode('b', { index: 4, isFocusable: true })
      navigation.registerNode('c', { index: 3, isFocusable: true })
      navigation.registerNode('d', { index: 1, isFocusable: true })

      navigation.assignFocus('b')

      const root = navigation.getNode('root')

      expect(navigation.getNextChild(root).id).toEqual('b')
    })
  })

  describe('getPrevChild()', () => {
    test('get the prev child when children were added without indexes', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { isFocusable: true })
      navigation.registerNode('b', { isFocusable: true })
      navigation.registerNode('c', { isFocusable: true })
      navigation.registerNode('d', { isFocusable: true })

      navigation.assignFocus('c')

      const root = navigation.getNode('root')

      expect(navigation.getPrevChild(root).id).toEqual('b')
    })

    test('get the prev child when children were added with indexes, out of order', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { index: 2, isFocusable: true })
      navigation.registerNode('b', { index: 4, isFocusable: true })
      navigation.registerNode('c', { index: 3, isFocusable: true })
      navigation.registerNode('d', { index: 1, isFocusable: true })

      navigation.assignFocus('b')

      const root = navigation.getNode('root')

      expect(navigation.getPrevChild(root).id).toEqual('c')
    })

    test('if node is already focused on the first child, regardless of index, return that child', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { index: 2, isFocusable: true })
      navigation.registerNode('b', { index: 4, isFocusable: true })
      navigation.registerNode('c', { index: 3, isFocusable: true })
      navigation.registerNode('d', { index: 1, isFocusable: true })

      navigation.assignFocus('d')

      const root = navigation.getNode('root')

      expect(navigation.getPrevChild(root).id).toEqual('d')
    })
  })

  describe('getNodeFirstChild()', () => {
    test('should return child with index of 1 - added without indexes', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a')
      navigation.registerNode('b')
      navigation.registerNode('c')

      const root = navigation.getNode('root')

      expect(navigation.getNodeFirstChild(root).id).toEqual('a')
    })

    test('should return child with index of 1 - added out of order, with indexes', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { index: 2 })
      navigation.registerNode('b', { index: 1 })
      navigation.registerNode('c', { index: 3 })

      const root = navigation.getNode('root')

      expect(navigation.getNodeFirstChild(root).id).toEqual('b')
    })
  })

  describe('getNodeLastChild()', () => {
    test('should return child with last index - added without indexes', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a')
      navigation.registerNode('b')
      navigation.registerNode('c')

      const root = navigation.getNode('root')

      expect(navigation.getNodeLastChild(root).id).toEqual('c')
    })

    test('should return child with last index - added with indexes, out of order', () => {
      const navigation = new Lrud()

      navigation.registerNode('root')
      navigation.registerNode('a', { index: 3 })
      navigation.registerNode('b', { index: 1 })
      navigation.registerNode('c', { index: 2 })

      const root = navigation.getNode('root')

      expect(navigation.getNodeLastChild(root).id).toEqual('a')
    })
  })

  describe('_reindexChildrenOfNode', () => {
    test('deleting a leaf should re-index the other leaves when leaves are added without indexes', () => {
      const navigation = new Lrud()

      navigation
        .registerNode('root')
        .registerNode('c', { index: 9 })
        .registerNode('a', { index: 4 })
        .registerNode('d', { index: 13 })
        .registerNode('b', { index: 6 })

      let root = navigation.getNode('root')
      root = navigation._reindexChildrenOfNode(root)

      expect(root.children.a.index).toEqual(0)
      expect(root.children.b.index).toEqual(1)
      expect(root.children.c.index).toEqual(2)
      expect(root.children.d.index).toEqual(3)
    })

    test('test it through unregister', () => {
      const navigation = new Lrud()

      navigation
        .registerNode('root')
        .registerNode('c', { index: 9 })
        .registerNode('a', { index: 4 })
        .registerNode('e', { index: 16 })
        .registerNode('d', { index: 13 })
        .registerNode('b', { index: 6 })

      navigation.unregisterNode('e')

      expect(navigation.getNode('a').index).toEqual(0)
      expect(navigation.getNode('b').index).toEqual(1)
      expect(navigation.getNode('c').index).toEqual(2)
      expect(navigation.getNode('d').index).toEqual(3)
    })
  })
})