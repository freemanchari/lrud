import { Node } from './interfaces';
/**
 * given an array of values and a goal, return the value from values which is closest to the goal
 *
 * @param {number[]} values
 * @param {number} goal
 */
export declare const Closest: (values: [number], goal: number) => number;
/**
 * String.endsWith helper
 */
export declare const endsWith: (str: any, suffix: any) => boolean;
/**
 * Array.prototype.find helper
 */
export declare const arrayFind: <A>(arr: A[], func: any) => A;
/**
 * check if a given node is focusable
 *
 * @param {object} node
 */
export declare const isNodeFocusable: (node: Node) => boolean;
/**
 * given a keyCode, lookup and return the direction from the keycodes mapping file
 *
 * @param {number} keyCode
 */
export declare const getDirectionForKeyCode: (keyCode: number) => string;
/**
 * given an orientation and a direction, do they match? i.e an
 * orientation `horizontal` and direction `left` or `right` is considered matching.
 *
 * direction CAN be passed as `*` (wildcard). this will always return true
 *
 * @param {string} orientation
 * @param {string} direction
 */
export declare const isDirectionAndOrientationMatching: (orientation: any, direction: any) => boolean;
/**
 * is the given node in the path, return true
 *
 * @param {*} node
 */
export declare const isNodeInPath: (path: any, node: any) => boolean;
/**
 * given an array of paths, return true if the node is in any of the paths
 *
 * @param {*} node
 */
export declare const isNodeInPaths: (paths: any, node: any) => boolean;
/**
 * return a child from the given node whose indexRange encompases the given index
 *
 * @param {object} node
 * @param {number} index
 */
export declare const _findChildWithMatchingIndexRange: (node: any, index: any) => Node;
/**
 * return a child from the given node whose index matches the given index
 *
 * @param {object} node
 * @param {number} index
 */
export declare const _findChildWithIndex: (node: any, index: any) => Node;
/**
 * return a child from the given node whose index is numerically closest to the given
 * index. if an indexRange is provided, first check if the node's activeChild is inside
 * the indexRange. if it is, return the activeChild node instead
 *
 * @param {object} node
 * @param {index} index
 * @param {number[]} indexRange
 */
export declare const _findChildWithClosestIndex: (node: any, index: any, indexRange?: any) => Node;
export declare const isNodeInTree: (nodeId: string, tree: object) => boolean;
export declare const getNodesFromTree: (tree: object) => Node[];
