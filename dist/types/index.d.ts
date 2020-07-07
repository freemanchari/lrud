import { Node, Override, KeyEvent, InsertTreeOptions, UnregisterNodeOptions } from './interfaces';
import mitt from 'mitt';
export declare class Lrud {
    tree: any;
    nodePathList: string[];
    focusableNodePathList: string[];
    rootNodeId: string;
    currentFocusNode?: Node;
    currentFocusNodeId: string;
    currentFocusNodeIndex: number;
    currentFocusNodeIndexRange: number[];
    currentFocusNodeIndexRangeLowerBound: number;
    currentFocusNodeIndexRangeUpperBound: number;
    isIndexAlignMode: boolean;
    emitter: mitt.Emitter;
    overrides: any;
    constructor();
    /**
     * reindex all the children of the node, assigning indexes numerically from 0. maintains
     * original order of indexes, but normalises them all to be 0 based
     *
     * @param {object} node
     */
    reindexChildrenOfNode(node: Node): Node | void;
    /**
     * register a callback for an LRUD event
     *
     * @param {string} eventName event to subscribe to
     * @param {function} callback function to call on event
     */
    on(eventName: any, callback: any): void;
    /**
     * return the root node
     */
    getRootNode(): Node;
    /**
     * given a node id, return the full path for it
     *
     * @param {string} nodeId
     */
    getPathForNodeId(nodeId: string): string;
    /**
     * register a new node into the LRUD tree
     *
     * @param {string} nodeId
     * @param {object} node
     * @param {string} [node.id] if null, `nodeId` is used
     * @param {string} [node.parent] if null, value of `this.rootNodeId` is used
     * @param {number} [node.index] if null, index is 1 more than the index of the last sibling. if no previous siblings, index is 1
     * @param {number[]} [node.indexRange] defaults to null. acts as a colspan, value [0] is lower bound, value [1] is upper bound
     * @param {object} [node.selectAction] if a node has a selectAction, it is focusable
     * @param {boolean} [node.isFocusable] if a node is explicitly set as isFocusable, it is focusable
     * @param {boolean} [node.isWrapping] if true, when asking for the next child at the end or start of the node, the will "wrap around" and return the first/last (when asking for the last/first)
     * @param {string} [node.orientation] can be "vertical" or "horizontal". is used in conjuction when handling direction of key press, to determine which child is "next"
     * @param {boolean} [node.isIndexAlign] if a node is index aligned, its descendents should jump to nodes based on index instead of activeChild
     * @param {function} [node.onLeave] if a node has an `onLeave` function, it will be run when a move event leaves this node
     * @param {function} [node.onEnter] if a node has an `onEnter` function, it will be run when a move event enters this node
     */
    registerNode(nodeId: string, node?: Node): Lrud;
    /**
     * maintained for legacy API reasons
     */
    register(nodeId: string, node?: Node): Lrud;
    /**
     * unregister a node from the navigation tree
     * kept for backwards compatibility reasons
     *
     * @param {string} nodeId
     */
    unregister(nodeId: string, unregisterOptions?: UnregisterNodeOptions): void;
    /**
     * unregister a node from the navigation tree
     *
     * @param {string} nodeId
     * @param {object} unregisterOptions
     * @param {boolean} unregisterOptions.forceRefocus if true, LRUD will attempt to re-focus on a new node if the currently focused node becomes unregistered due to the given node ID being unregistered
     */
    unregisterNode(nodeId: string, unregisterOptions?: UnregisterNodeOptions): Lrud;
    /**
     * register a new override onto the LRUD instance
     *
     * @param {string} overrideId
     * @param {object} override
     * @param {string} override.id
     * @param {string} override.direction
     * @param {string} override.target
     */
    registerOverride(overrideId: string, override: Override): Lrud;
    /**
     * unregister an override from the LRUD instance
     *
     * @param {string} overrideId
     */
    unregisterOverride(overrideId: string): Lrud;
    /**
     * return a node for an ID
     *
     * @param {string} nodeId node id
     */
    getNode(nodeId: string): Node;
    /**
     * get a node by ID and then unregister it from the instance
     *
     * @param {string} nodeId node id
     */
    pickNode(nodeId: string): Node;
    /**
     * starting from a node, climb up the navigation tree until we find a node that can be
     * actioned, based on the given direction. an actionable node is one whose orientation is valid
     * for the given direction, has focusable children and whose activeChild isn't a leaf that is
     * also its current activeChild
     *
     * @param {object} node
     * @param {string} direction
     */
    climbUp(node: Node, direction: string): Node;
    /**
     * starting from the given node, dig down the navigation tree until we find a focusable
     * leaf, and return it. dig "direction" priority:
     * - index align mode
     * - active child
     * - first child
     *
     * @param {object} node
     */
    digDown(node: Node, direction?: string): Node;
    /**
     * gets the semantic next child for a given direction
     * if the direction is left or up, return the semantic previous child of the node
     * if the direction is right or down, return the semantic next child of the node
     *
     * @param {object} node
     * @param {string} direction
     */
    getNextChildInDirection(node: Node, direction?: string): Node;
    /**
     * get the semantic "next" child for a node
     *
     * @param {object} node
     */
    getNextChild(node: Node): Node;
    /**
     * get the semantic "previous" child for a node
     *
     * @param {object} node
     */
    getPrevChild(node: Node): Node;
    /**
     * get the first child of a node, based on index
     *
     * @param {object} node
     */
    getNodeFirstChild(node: Node): Node;
    /**
     * get the last child of a node, based on index
     *
     * @param {object} node
     */
    getNodeLastChild(node: Node): Node;
    /**
     * given an event, handle any state changes that may arise from the direction pressed.
     * state changes based on climbUp'ing and digDown'ing from the current focusedNode
     *
     * @param {object} event
     * @param {string} [event.keyCode]
     * @param {string} [event.direction]
     */
    handleKeyEvent(event: KeyEvent): Node | void;
    /**
     * Sets the activeChild of the parentId node to the value of the childId node
     *
     * @param {string} parentId
     * @param {string} childId
     */
    setActiveChild(parentId: string, childId: string): void;
    /**
     * Sets the activeChild of the parentId node to the value of the childId node
     * if the parent node has a parent itself, it digs up the tree and sets those activeChild values
     *
     * @param {string} parentId
     * @param {string} childId
     */
    setActiveChildRecursive(parentId: string, childId: string): void;
    /**
     * set the current focus of the instance to the given node ID
     * if the given node ID points to a non-focusable node, we dig down from
     * the given node to find a node that can be focused on
     * calls `onFocus` on the given node, if it exists, and emits a `focus` event
     * also calls `onBlur` on the node that WAS focused before this function was called
     *
     * @param {string} nodeId
     */
    assignFocus(nodeId: string): void;
    /**
     * If the focus of the tree is out of sync, ie, the current focused node becomes unfocusable this can be used to fall back to another focus.
     * @param {focusedNode}
     */
    recalculateFocus(node: Node): void;
    /**
     * given a tree, return an array of Nodes in that tree
     *
     * @param {object} tree
     */
    /**
     * given a tree, register all of its nodes into this instance
     *
     * @param {object} tree
     */
    registerTree(tree: object): void;
    /**
     * given a tree object, attempt to register that tree into the current lrud instance
     *
     * if the given tree already exists as a branch in the instance tree, the new tree will replace that branch
     *
     * if the new tree doesn't already exist as a branch in the instance tree, this function will register the new
     * tree as a branch against the root node, as per standard registerNode() behaviour
     *
     * @param {object} tree
     * @param {object} options
     * @param {object} options.maintainIndex if true, and new tree is replacing an existing branch of the tree, maintain the original branches relative index
     */
    insertTree(tree: object, options?: InsertTreeOptions): void;
    doesNodeHaveFocusableChildren(node: Node): boolean;
    /**
     * Change the ability of a node to be focused in place
     * @param {string} nodeId
     * @param {boolean} isFocusable
     */
    setNodeFocusable(nodeId: string, isFocusable: boolean): void;
}
