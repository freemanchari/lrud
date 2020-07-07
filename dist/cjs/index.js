'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

/**
 * get a value from an object using dot notation
 * taken from https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 *
 * @param {object} object
 * @param {string} path
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var Get = function (object, path) {
    if (!path) {
        return undefined;
    }
    path = path.split('.');
    return path.reduce(function (xs, x) { return (xs && xs[x]) ? xs[x] : null; }, object);
};

/**
 * set a value into an object using dot notation
 * @param object
 * @param path
 * @param value
 */
function Set(object, path, value) {
    if (!path) {
        return undefined;
    }
    var pathParts = path.split('.');
    pathParts.forEach(function (part, index) {
        if (index === pathParts.length - 1) {
            object[part] = value;
        }
        // if it doesnt exist, make it an empty object
        // unless the next part is a pure number - in which case, make it an array
        if (object[part] == null) {
            if (isNaN(pathParts[index + 1])) {
                object[part] = {};
            }
            else {
                object[part] = [];
            }
        }
        object = object[part];
    });
    return object;
}

var left = 'LEFT';
var right = 'RIGHT';
var up = 'UP';
var down = 'DOWN';
var enter = 'ENTER';
var KeyCodes = {
    map: {
        LEFT: left,
        RIGHT: right,
        UP: up,
        DOWN: down,
        ENTER: enter
    },
    codes: {
        4: left,
        21: left,
        37: left,
        214: left,
        205: left,
        218: left,
        5: right,
        22: right,
        39: right,
        213: right,
        206: right,
        217: right,
        29460: up,
        19: up,
        38: up,
        211: up,
        203: up,
        215: up,
        29461: down,
        20: down,
        40: down,
        212: down,
        204: down,
        216: down,
        29443: enter,
        13: enter,
        67: enter,
        32: enter,
        23: enter,
        195: enter
    }
};

/**
 * given an array of values and a goal, return the value from values which is closest to the goal
 *
 * @param {number[]} values
 * @param {number} goal
 */
var Closest = function (values, goal) { return values.reduce(function (prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
}); };
/**
 * String.endsWith helper
 */
var endsWith = function (str, suffix) { return str.indexOf(suffix, str.length - suffix.length) !== -1; };
/**
 * Array.prototype.find helper
 */
var arrayFind = function (arr, func) {
    var len = arr.length;
    var i = 0;
    while (i < len) {
        if (func(arr[i], i, arr)) {
            return arr[i];
        }
        i++;
    }
    return undefined;
};
/**
 * check if a given node is focusable
 *
 * @param {object} node
 */
var isNodeFocusable = function (node) { return node.isFocusable != null ? node.isFocusable : !!node.selectAction; };
/**
 * given a keyCode, lookup and return the direction from the keycodes mapping file
 *
 * @param {number} keyCode
 */
var getDirectionForKeyCode = function (keyCode) {
    var direction = KeyCodes.codes[keyCode];
    if (direction) {
        return direction.toUpperCase();
    }
    return null;
};
/**
 * given an orientation and a direction, do they match? i.e an
 * orientation `horizontal` and direction `left` or `right` is considered matching.
 *
 * direction CAN be passed as `*` (wildcard). this will always return true
 *
 * @param {string} orientation
 * @param {string} direction
 */
var isDirectionAndOrientationMatching = function (orientation, direction) {
    if (!orientation || !direction) {
        return false;
    }
    orientation = orientation.toUpperCase();
    direction = direction.toUpperCase();
    return ((direction === '*') ||
        (orientation === 'VERTICAL' && (direction === 'UP' || direction === 'DOWN')) ||
        (orientation === 'HORIZONTAL' && (direction === 'LEFT' || direction === 'RIGHT')));
};
/**
 * is the given node in the path, return true
 *
 * @param {*} node
 */
var isNodeInPath = function (path, node) {
    if (path.lastIndexOf(node.id + '.', 0) === 0) {
        return true;
    }
    if (endsWith(path, '.' + node.id)) {
        return true;
    }
    if (path.indexOf('.' + node.id + '.') !== -1) {
        return true;
    }
    return false;
};
/**
 * given an array of paths, return true if the node is in any of the paths
 *
 * @param {*} node
 */
var isNodeInPaths = function (paths, node) {
    return paths.some(function (path) {
        return isNodeInPath(path, node);
    });
};
/**
 * return a child from the given node whose indexRange encompases the given index
 *
 * @param {object} node
 * @param {number} index
 */
var _findChildWithMatchingIndexRange = function (node, index) {
    if (!node.children) {
        return null;
    }
    var childWithIndexRangeSpanningIndex = arrayFind(Object.keys(node.children), function (childId) {
        var child = node.children[childId];
        return child.indexRange && (child.indexRange[0] <= index && child.indexRange[1] >= index);
    });
    if (childWithIndexRangeSpanningIndex) {
        return node.children[childWithIndexRangeSpanningIndex];
    }
};
/**
 * return a child from the given node whose index matches the given index
 *
 * @param {object} node
 * @param {number} index
 */
var _findChildWithIndex = function (node, index) {
    if (!node.children) {
        return null;
    }
    var childIdWithMatchingIndex = arrayFind(Object.keys(node.children), function (childId) {
        var childNode = node.children[childId];
        return childNode.index === index;
    });
    if (childIdWithMatchingIndex) {
        return node.children[childIdWithMatchingIndex];
    }
    return null;
};
/**
 * return a child from the given node whose index is numerically closest to the given
 * index. if an indexRange is provided, first check if the node's activeChild is inside
 * the indexRange. if it is, return the activeChild node instead
 *
 * @param {object} node
 * @param {index} index
 * @param {number[]} indexRange
 */
var _findChildWithClosestIndex = function (node, index, indexRange) {
    if (indexRange === void 0) { indexRange = null; }
    if (!node.children) {
        return null;
    }
    // if we have an indexRange, and the nodes active child is inside that index range,
    // just return the active child
    var activeChild = node.children[node.activeChild];
    if (indexRange && activeChild && activeChild.index >= indexRange[0] && activeChild.index <= indexRange[1] && isNodeFocusable(activeChild)) {
        return activeChild;
    }
    var indexes = Object.keys(node.children)
        .filter(function (childId) { return isNodeFocusable(node.children[childId]) || node.children[childId].children; })
        .map(function (childId) { return node.children[childId].index; });
    if (indexes.length <= 0) {
        return null;
    }
    return _findChildWithIndex(node, Closest(indexes, index));
};
var getNodesFromTree = function (tree) {
    var nodes = [];
    var _getNodesFromTree = function (tree, parent) {
        Object.keys(tree).forEach(function (treeProperty) {
            var _parent = tree[treeProperty].parent || parent;
            nodes.push(__assign(__assign({}, tree[treeProperty]), { id: treeProperty, children: undefined, parent: _parent }));
            if (tree[treeProperty].children) {
                _getNodesFromTree(tree[treeProperty].children, treeProperty);
            }
        });
    };
    _getNodesFromTree(tree, undefined);
    return nodes;
};

//      
// An event handler can take an optional event argument
// and should not return a value
                                          
                                                               

// An array of all currently registered event handlers for a type
                                            
                                                            
// A map of event types and their corresponding event handlers.
                        
                                 
                                   
  

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all                 ) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on: function on(type        , handler              ) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off: function off(type        , handler              ) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberOf mitt
		 */
		emit: function emit(type        , evt     ) {
			(all[type] || []).slice().map(function (handler) { handler(evt); });
			(all['*'] || []).slice().map(function (handler) { handler(type, evt); });
		}
	};
}
//# sourceMappingURL=mitt.es.js.map

var Lrud = /** @class */ (function () {
    function Lrud() {
        this.tree = {};
        this.nodePathList = [];
        this.focusableNodePathList = [];
        this.rootNodeId = null;
        this.currentFocusNode = null;
        this.currentFocusNodeId = null;
        this.currentFocusNodeIndex = null;
        this.currentFocusNodeIndexRange = null;
        this.isIndexAlignMode = false;
        this.emitter = mitt();
        this.overrides = {};
    }
    /**
     * reindex all the children of the node, assigning indexes numerically from 0. maintains
     * original order of indexes, but normalises them all to be 0 based
     *
     * @param {object} node
     */
    Lrud.prototype.reindexChildrenOfNode = function (node) {
        if (!node) {
            return;
        }
        if (!node.children) {
            return;
        }
        var children = Object.keys(node.children).map(function (childId) { return node.children[childId]; });
        children.sort(function (a, b) { return a.index - b.index; });
        node.children = {};
        children.forEach(function (child, index) {
            child.index = index;
            node.children[child.id] = child;
        });
        Set(this.tree, this.getPathForNodeId(node.id), node);
        return node;
    };
    /**
     * register a callback for an LRUD event
     *
     * @param {string} eventName event to subscribe to
     * @param {function} callback function to call on event
     */
    Lrud.prototype.on = function (eventName, callback) {
        this.emitter.on(eventName, callback);
    };
    /**
     * return the root node
     */
    Lrud.prototype.getRootNode = function () {
        var node = this.getNode(this.rootNodeId);
        if (!node) {
            throw new Error('no root node');
        }
        return node;
    };
    /**
     * given a node id, return the full path for it
     *
     * @param {string} nodeId
     */
    Lrud.prototype.getPathForNodeId = function (nodeId) {
        if (nodeId === this.rootNodeId) {
            return this.rootNodeId;
        }
        return arrayFind(this.nodePathList, function (path) { return endsWith(path, '.' + nodeId); });
    };
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
    Lrud.prototype.registerNode = function (nodeId, node) {
        if (node === void 0) { node = {}; }
        if (!node.id) {
            node.id = nodeId;
        }
        if (this.getNode(nodeId)) {
            throw Error("Node with an ID of " + nodeId + " has already been registered");
        }
        // if this is the very first node, set it as root and return...
        if (Object.keys(this.tree).length <= 0) {
            this.rootNodeId = nodeId;
            this.tree[nodeId] = node;
            this.nodePathList.push(nodeId);
            return this;
        }
        // if this node has no parent, assume its parent is root
        if (node.parent == null && nodeId !== this.rootNodeId) {
            node.parent = this.rootNodeId;
        }
        // if this node is the first child of its parent, we need to set its parent's `activeChild`
        // to it so that the parent always has an `activeChild` value
        // we can tell if its parent has any children by checking the nodePathList for
        // entries containing '<parent>.children'
        var parentsChildPaths = arrayFind(this.nodePathList, function (path) { return path.indexOf(node.parent + '.children') > -1; });
        if (parentsChildPaths == null) {
            var parentPath = this.getPathForNodeId(node.parent);
            Set(this.tree, parentPath + '.activeChild', nodeId);
        }
        // if no `index` set, calculate it
        if (!node.index) {
            var parentNode = this.getNode(node.parent);
            if (parentNode) {
                var parentsChildren = this.getNode(node.parent).children;
                if (!parentsChildren) {
                    node.index = 0;
                }
                else {
                    node.index = (Object.keys(parentsChildren).length);
                }
            }
        }
        // add the node into the tree
        // path is the node's parent plus 'children' plus itself
        var path = arrayFind(this.nodePathList, function (path) { return endsWith(path, node.parent); }) + '.children.' + nodeId;
        Set(this.tree, path, node);
        this.nodePathList.push(path);
        // if the node is focusable, we want to add its path to our focusableNodePathList
        if (isNodeFocusable(node)) {
            this.focusableNodePathList.push(path);
        }
        return this;
    };
    /**
     * maintained for legacy API reasons
     */
    Lrud.prototype.register = function (nodeId, node) {
        if (node === void 0) { node = {}; }
        return this.registerNode(nodeId, node);
    };
    /**
     * unregister a node from the navigation tree
     * kept for backwards compatibility reasons
     *
     * @param {string} nodeId
     */
    Lrud.prototype.unregister = function (nodeId, unregisterOptions) {
        this.unregisterNode(nodeId, unregisterOptions);
    };
    /**
     * unregister a node from the navigation tree
     *
     * @param {string} nodeId
     * @param {object} unregisterOptions
     * @param {boolean} unregisterOptions.forceRefocus if true, LRUD will attempt to re-focus on a new node if the currently focused node becomes unregistered due to the given node ID being unregistered
     */
    Lrud.prototype.unregisterNode = function (nodeId, unregisterOptions) {
        var _this = this;
        if (unregisterOptions === void 0) { unregisterOptions = { forceRefocus: true }; }
        if (nodeId === this.rootNodeId) {
            this.tree = {};
            this.nodePathList = [];
            this.focusableNodePathList = [];
            this.rootNodeId = null;
            this.currentFocusNode = null;
            this.currentFocusNodeId = null;
            this.currentFocusNodeIndex = null;
            this.currentFocusNodeIndexRange = null;
            this.isIndexAlignMode = false;
            this.emitter = mitt();
            this.overrides = {};
            return;
        }
        var path = this.getPathForNodeId(nodeId);
        // if we're trying to unregister a node that doesn't exist, exit out
        if (!path) {
            return;
        }
        // get a copy of the node to pass to the blur event, and grab the parent to work with it
        var nodeClone = Get(this.tree, path);
        var parentNode = this.getNode(nodeClone.parent);
        // delete the node itself (delete from the parent and re-set the parent later)
        delete parentNode.children[nodeId];
        // ...remove the relevant entry from the node id list
        this.nodePathList.splice(this.nodePathList.indexOf(path), 1);
        // ...remove all its children from both path lists
        this.nodePathList = this.nodePathList.filter(function (nodeIdPath) {
            return nodeIdPath.indexOf(path + '.children.') === -1;
        });
        this.focusableNodePathList = this.focusableNodePathList.filter(function (nodeIdPath) {
            return nodeIdPath.indexOf(path + '.children.') === -1;
        });
        // if the node is focusable, remove it from the focusable node path list
        if (isNodeFocusable(nodeClone)) {
            this.focusableNodePathList.splice(this.focusableNodePathList.indexOf(path), 1);
        }
        // ...if we're unregistering the activeChild of our parent (could be a leaf OR branch)
        // we need to recalculate the focus...
        if (parentNode.activeChild && parentNode.activeChild === nodeId) {
            this.isIndexAlignMode = false;
            delete parentNode.activeChild;
            if (unregisterOptions.forceRefocus) {
                this.recalculateFocus(nodeClone);
            }
        }
        // ...we need to recalculate the indexes of all the parents children
        this.reindexChildrenOfNode(parentNode);
        // re-set the parent after we've deleted the node itself and amended the parents active child, etc.
        Set(this.tree, this.getPathForNodeId(parentNode.id), parentNode);
        // blur on the nodeClone
        this.emitter.emit('blur', nodeClone);
        if (nodeClone.onBlur) {
            nodeClone.onBlur(nodeClone);
        }
        // if we have any overrides whose target or ID is the node we just unregistered, we should unregister
        // those overrides (thus keeping state clean)
        Object.keys(this.overrides).forEach(function (overrideId) {
            var override = _this.overrides[overrideId];
            if (override.target === nodeClone.id || override.id === nodeClone.id) {
                _this.unregisterOverride(overrideId);
            }
        });
        return this;
    };
    /**
     * register a new override onto the LRUD instance
     *
     * @param {string} overrideId
     * @param {object} override
     * @param {string} override.id
     * @param {string} override.direction
     * @param {string} override.target
     */
    Lrud.prototype.registerOverride = function (overrideId, override) {
        if (!overrideId) {
            throw new Error('need an ID to register an override');
        }
        if (this.overrides[overrideId]) {
            throw new Error("override with ID of " + overrideId + " already exists");
        }
        if (!override.id) {
            throw new Error("registering override: " + overrideId + " - missing internal id");
        }
        if (!override.direction) {
            throw new Error("registering override: " + overrideId + " - missing internal direction");
        }
        if (!override.target) {
            throw new Error("registering override: " + overrideId + " - missing internal target");
        }
        this.overrides[overrideId] = override;
        return this;
    };
    /**
     * unregister an override from the LRUD instance
     *
     * @param {string} overrideId
     */
    Lrud.prototype.unregisterOverride = function (overrideId) {
        delete this.overrides[overrideId];
        return this;
    };
    /**
     * return a node for an ID
     *
     * @param {string} nodeId node id
     */
    Lrud.prototype.getNode = function (nodeId) {
        return Get(this.tree, (this.getPathForNodeId(nodeId)));
    };
    /**
     * get a node by ID and then unregister it from the instance
     *
     * @param {string} nodeId node id
     */
    Lrud.prototype.pickNode = function (nodeId) {
        var node = this.getNode(nodeId);
        if (!node) {
            return;
        }
        this.unregisterNode(nodeId);
        return node;
    };
    /**
     * starting from a node, climb up the navigation tree until we find a node that can be
     * actioned, based on the given direction. an actionable node is one whose orientation is valid
     * for the given direction, has focusable children and whose activeChild isn't a leaf that is
     * also its current activeChild
     *
     * @param {object} node
     * @param {string} direction
     */
    Lrud.prototype.climbUp = function (node, direction) {
        var _this = this;
        if (!node) {
            return null;
        }
        // if we have a matching override at this point in the climb, return that target node
        var matchingOverrideId = arrayFind(Object.keys(this.overrides), function (overrideId) {
            var override = _this.overrides[overrideId];
            return override.id === node.id && override.direction.toUpperCase() === direction.toUpperCase();
        });
        if (matchingOverrideId) {
            return this.getNode(this.overrides[matchingOverrideId].target);
        }
        // if we're on a leaf, climb up
        if (isNodeFocusable(node)) {
            return this.climbUp(this.getNode(node.parent), direction);
        }
        // if the node we're on contains no focusable children, climb up
        if (!isNodeInPaths(this.focusableNodePathList, node)) {
            return this.climbUp(this.getNode(node.parent), direction);
        }
        // we have children, but the orientation doesn't match, so try our parent
        if (!isDirectionAndOrientationMatching(node.orientation, direction)) {
            return this.climbUp(this.getNode(node.parent), direction);
        }
        var nextChildInDirection = this.getNextChildInDirection(node, direction);
        // if we dont have a next child, just return the node. this is primarily for use during unregistering
        if (!nextChildInDirection) {
            return node;
        }
        // if the next child in the direction is both the same as this node's activeChild
        // AND a leaf, bubble up too - handles nested wrappers, like docs/test-diagrams/fig-3.png
        var isNextChildCurrentActiveChild = (nextChildInDirection && nextChildInDirection.id === node.activeChild);
        var isNextChildFocusable = isNodeFocusable(this.getNode(node.activeChild));
        var isNodeInFocusablePath = isNodeInPaths(this.focusableNodePathList, node);
        if (isNextChildCurrentActiveChild && (isNextChildFocusable || isNodeInFocusablePath)) {
            return this.climbUp(this.getNode(node.parent), direction);
        }
        return node;
    };
    /**
     * starting from the given node, dig down the navigation tree until we find a focusable
     * leaf, and return it. dig "direction" priority:
     * - index align mode
     * - active child
     * - first child
     *
     * @param {object} node
     */
    Lrud.prototype.digDown = function (node, direction) {
        if (direction === void 0) { direction = null; }
        // if the active child is focusable, return it
        if (isNodeFocusable(node)) {
            return node;
        }
        /*
        if we're in a nested grid
          if we're going VERTICAL DOWN
            take the first child, and then match the index
          if we're going VERTICAL UP
            take the last child, and then match the index
    
        if we're in a nested grid
          and we're going HORIZONTAL LEFT
            take the matching index of the same depth, and then the last child
          and we're going HORIZONTAL RIGHT
            take the matching index of the same depth, and then the first child
    
        if its not a nested grid, take the matching index
        */
        if (this.isIndexAlignMode) {
            if (node.isIndexAlign) {
                // we're in a nested grid, so need to take into account orientation and direction of travel
                var nodeParent = this.getNode(node.parent);
                if (nodeParent.orientation === 'vertical') {
                    if (direction === 'UP') {
                        return this.digDown(_findChildWithClosestIndex(this.getNodeLastChild(node), this.currentFocusNodeIndex, this.currentFocusNodeIndexRange), direction);
                    }
                    if (direction === 'DOWN') {
                        return this.digDown(_findChildWithClosestIndex(this.getNodeFirstChild(node), this.currentFocusNodeIndex, this.currentFocusNodeIndexRange), direction);
                    }
                }
                if (nodeParent.orientation === 'horizontal') {
                    if (direction === 'LEFT') {
                        var firstStep = _findChildWithClosestIndex(node, this.getNode(this.currentFocusNode.parent).index);
                        return this.digDown(this.getNodeLastChild(firstStep), direction);
                    }
                    if (direction === 'RIGHT') {
                        var firstStep = _findChildWithClosestIndex(node, this.getNode(this.currentFocusNode.parent).index);
                        return this.digDown(this.getNodeFirstChild(firstStep), direction);
                    }
                }
            }
            // we're not in a nested grid, so just look for matching index ranges or index
            var matchingViaIndexRange = _findChildWithMatchingIndexRange(node, this.currentFocusNodeIndex);
            if (matchingViaIndexRange) {
                return this.digDown(matchingViaIndexRange, direction);
            }
            return this.digDown(_findChildWithClosestIndex(node, this.currentFocusNodeIndex, this.currentFocusNodeIndexRange), direction);
        }
        if (!isNodeFocusable(node) && !this.doesNodeHaveFocusableChildren(node)) {
            var parentNode = this.getNode(node.parent);
            var nextSiblingFromNode = this.getNextChildInDirection(__assign(__assign({}, parentNode), { activeChild: node.id }), direction);
            // if the next sibling is ME, we're in an infinite loop - just return null
            if (nextSiblingFromNode.id === node.id) {
                return null;
            }
            return this.digDown(nextSiblingFromNode, direction);
        }
        // if we dont have an active child, use the first child
        if (!node.activeChild) {
            node.activeChild = this.getNodeFirstChild(node).id;
        }
        var nextChild = node.children[node.activeChild];
        return (isNodeFocusable(nextChild)) ? nextChild : this.digDown(nextChild, direction);
    };
    /**
     * gets the semantic next child for a given direction
     * if the direction is left or up, return the semantic previous child of the node
     * if the direction is right or down, return the semantic next child of the node
     *
     * @param {object} node
     * @param {string} direction
     */
    Lrud.prototype.getNextChildInDirection = function (node, direction) {
        if (direction === void 0) { direction = null; }
        if (!direction) {
            return this.getNextChild(node);
        }
        direction = direction.toUpperCase();
        if (node.orientation === 'horizontal' && direction === 'RIGHT') {
            return this.getNextChild(node);
        }
        if (node.orientation === 'horizontal' && direction === 'LEFT') {
            return this.getPrevChild(node);
        }
        if (node.orientation === 'vertical' && direction === 'DOWN') {
            return this.getNextChild(node);
        }
        if (node.orientation === 'vertical' && direction === 'UP') {
            return this.getPrevChild(node);
        }
        return null;
    };
    /**
     * get the semantic "next" child for a node
     *
     * @param {object} node
     */
    Lrud.prototype.getNextChild = function (node) {
        if (!node.activeChild) {
            node.activeChild = this.getNodeFirstChild(node).id;
        }
        var currentActiveIndex = node.children[node.activeChild].index;
        var nextChild = _findChildWithIndex(node, currentActiveIndex + 1);
        if (!nextChild) {
            if (node.isWrapping) {
                nextChild = this.getNodeFirstChild(node);
            }
            else {
                nextChild = node.children[node.activeChild];
            }
        }
        return nextChild;
    };
    /**
     * get the semantic "previous" child for a node
     *
     * @param {object} node
     */
    Lrud.prototype.getPrevChild = function (node) {
        if (!node.activeChild) {
            node.activeChild = this.getNodeFirstChild(node).id;
        }
        var currentActiveIndex = node.children[node.activeChild].index;
        var prevChild = _findChildWithIndex(node, currentActiveIndex - 1);
        if (!prevChild) {
            // cant find a prev child, so the prev child is the current child
            if (node.isWrapping) {
                prevChild = this.getNodeLastChild(node);
            }
            else {
                prevChild = node.children[node.activeChild];
            }
        }
        return prevChild;
    };
    /**
     * get the first child of a node, based on index
     *
     * @param {object} node
     */
    Lrud.prototype.getNodeFirstChild = function (node) {
        if (!node.children) {
            return undefined;
        }
        var orderedIndexes = Object.keys(node.children).map(function (childId) { return node.children[childId].index; }).sort(function (a, b) { return a - b; });
        return _findChildWithIndex(node, orderedIndexes[0]);
    };
    /**
     * get the last child of a node, based on index
     *
     * @param {object} node
     */
    Lrud.prototype.getNodeLastChild = function (node) {
        if (!node.children) {
            return undefined;
        }
        var orderedIndexes = Object.keys(node.children).map(function (childId) { return node.children[childId].index; }).sort(function (a, b) { return a - b; });
        return _findChildWithIndex(node, orderedIndexes[orderedIndexes.length - 1]);
    };
    /**
     * given an event, handle any state changes that may arise from the direction pressed.
     * state changes based on climbUp'ing and digDown'ing from the current focusedNode
     *
     * @param {object} event
     * @param {string} [event.keyCode]
     * @param {string} [event.direction]
     */
    Lrud.prototype.handleKeyEvent = function (event) {
        var direction = (event.keyCode) ? getDirectionForKeyCode(event.keyCode) : event.direction.toUpperCase();
        var currentFocusNode = this.getNode(this.currentFocusNodeId);
        // if all we're doing is processing an enter, just run the `onSelect` function of the current node...
        if (direction === 'ENTER') {
            this.emitter.emit('select', currentFocusNode);
            if (currentFocusNode.onSelect) {
                currentFocusNode.onSelect(currentFocusNode);
            }
            return;
        }
        // climb up from where we are...
        var topNode = this.climbUp(currentFocusNode, direction);
        // ... if we cant find a top node, its an invalid move - just return
        if (!topNode) {
            return;
        }
        // ...if we need to align indexes, turn the flag on now...
        this.isIndexAlignMode = topNode.isIndexAlign === true;
        // ...get the top's next child in the direction we're going...
        var nextChild = this.getNextChildInDirection(topNode, direction);
        // ...and depending on if we're able to find a child, dig down from the child or from the original top...
        var focusableNode = (nextChild) ? this.digDown(nextChild, direction) : this.digDown(topNode, direction);
        if (!focusableNode) {
            return;
        }
        // ...give an opportunity for the move to be cancelled by the leaving node
        if (currentFocusNode.shouldCancelLeave) {
            if (currentFocusNode.shouldCancelLeave(currentFocusNode, focusableNode)) {
                if (currentFocusNode.onLeaveCancelled) {
                    currentFocusNode.onLeaveCancelled(currentFocusNode, focusableNode);
                }
                this.emitter.emit('cancelled', {
                    leave: currentFocusNode,
                    enter: focusableNode
                });
                return currentFocusNode;
            }
        }
        // ...give an opportunity for the move to be cancelled by the entering node
        if (focusableNode.shouldCancelEnter) {
            if (focusableNode.shouldCancelEnter(currentFocusNode, focusableNode)) {
                if (focusableNode.onEnterCancelled) {
                    focusableNode.onEnterCancelled(currentFocusNode, focusableNode);
                }
                this.emitter.emit('cancelled', {
                    leave: currentFocusNode,
                    enter: focusableNode
                });
                return currentFocusNode;
            }
        }
        // ...and then assign focus
        this.assignFocus(focusableNode.id);
        // emit events and fire functions now that the move has completed
        this.emitter.emit('move', {
            leave: currentFocusNode,
            enter: focusableNode,
            direction: direction,
            offset: (direction === 'LEFT' || direction === 'UP') ? -1 : 1
        });
        if (topNode.onMove) {
            topNode.onMove({
                node: topNode,
                leave: currentFocusNode,
                enter: focusableNode,
                direction: direction,
                offset: (direction === 'LEFT' || direction === 'UP') ? -1 : 1
            });
        }
        if (currentFocusNode.onLeave) {
            currentFocusNode.onLeave(currentFocusNode);
        }
        if (focusableNode.onEnter) {
            focusableNode.onEnter(focusableNode);
        }
        return focusableNode;
    };
    /**
     * Sets the activeChild of the parentId node to the value of the childId node
     *
     * @param {string} parentId
     * @param {string} childId
     */
    Lrud.prototype.setActiveChild = function (parentId, childId) {
        var child = this.getNode(childId);
        var parent = this.getNode(parentId);
        if (!child) {
            return;
        }
        // the parent already has an active child, and its NOT the same child that we're now setting
        if (parent.activeChild && parent.activeChild !== child.id) {
            var currentActiveChild = this.getNode(parent.activeChild);
            parent.activeChild = child.id;
            this.emitter.emit('inactive', currentActiveChild);
            if (currentActiveChild.onInactive) {
                currentActiveChild.onInactive(currentActiveChild);
            }
            this.emitter.emit('active', child);
            if (child.onActive) {
                child.onActive(child);
            }
            if (parent.onActiveChildChange) {
                parent.onActiveChildChange({
                    node: parent,
                    leave: currentActiveChild,
                    enter: child
                });
            }
        }
    };
    /**
     * Sets the activeChild of the parentId node to the value of the childId node
     * if the parent node has a parent itself, it digs up the tree and sets those activeChild values
     *
     * @param {string} parentId
     * @param {string} childId
     */
    Lrud.prototype.setActiveChildRecursive = function (parentId, childId) {
        this.setActiveChild(parentId, childId);
        var parent = this.getNode(parentId);
        // if the parent has a parent, bubble up
        if (parent.parent) {
            this.setActiveChildRecursive(parent.parent, parent.id);
        }
    };
    /**
     * set the current focus of the instance to the given node ID
     * if the given node ID points to a non-focusable node, we dig down from
     * the given node to find a node that can be focused on
     * calls `onFocus` on the given node, if it exists, and emits a `focus` event
     * also calls `onBlur` on the node that WAS focused before this function was called
     *
     * @param {string} nodeId
     */
    Lrud.prototype.assignFocus = function (nodeId) {
        var node = this.getNode(nodeId);
        if (node.children && !this.doesNodeHaveFocusableChildren(node)) {
            throw new Error("\"" + node.id + "\" does not have focusable children. Are you trying to assign focus to " + node.id + "?");
        }
        if (!isNodeFocusable(node)) {
            node = this.digDown(node);
        }
        if (!node) {
            throw new Error('trying to assign focus to a non focusable node');
        }
        if (this.currentFocusNodeId) {
            var previouslyFocusedNode = this.getNode(this.currentFocusNodeId);
            if (previouslyFocusedNode) {
                this.emitter.emit('blur', previouslyFocusedNode);
                if (previouslyFocusedNode.onBlur) {
                    previouslyFocusedNode.onBlur(previouslyFocusedNode);
                }
            }
        }
        this.currentFocusNodeId = node.id;
        this.currentFocusNode = node;
        if (node.indexRange) {
            this.currentFocusNodeIndex = node.indexRange[0];
            this.currentFocusNodeIndexRangeLowerBound = node.indexRange[0];
            this.currentFocusNodeIndexRangeUpperBound = node.indexRange[1];
            this.currentFocusNodeIndexRange = node.indexRange;
        }
        else {
            this.currentFocusNodeIndex = node.index;
            this.currentFocusNodeIndexRangeLowerBound = node.index;
            this.currentFocusNodeIndexRangeUpperBound = node.index;
        }
        if (node.parent) {
            this.setActiveChildRecursive(node.parent, node.id);
        }
        if (node.onFocus) {
            node.onFocus(node);
        }
        this.emitter.emit('focus', node);
    };
    /**
     * If the focus of the tree is out of sync, ie, the current focused node becomes unfocusable this can be used to fall back to another focus.
     * @param {focusedNode}
     */
    Lrud.prototype.recalculateFocus = function (node) {
        var parentNode = this.getNode(node.parent);
        var top = this.climbUp(parentNode, '*');
        if (top) {
            var prev = this.getPrevChild(top);
            if (isNodeFocusable(prev) || (prev && prev.children && Object.keys(prev.children).length)) {
                var child = this.digDown(prev);
                this.assignFocus(child.id);
            }
            else {
                this.assignFocus(top.id);
            }
        }
        else {
            this.currentFocusNode = undefined;
            this.currentFocusNodeId = undefined;
            this.currentFocusNodeIndex = undefined;
        }
    };
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
    Lrud.prototype.registerTree = function (tree) {
        var _this = this;
        getNodesFromTree(tree).forEach(function (node) {
            _this.registerNode(node.id, node);
        });
    };
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
    Lrud.prototype.insertTree = function (tree, options) {
        if (options === void 0) { options = { maintainIndex: true }; }
        var replacementNode = tree[Object.keys(tree)[0]];
        if (!replacementNode.id) {
            replacementNode.id = Object.keys(tree)[0];
        }
        var originalNode = this.pickNode(replacementNode.id);
        if (!replacementNode.parent && originalNode && originalNode.parent) {
            replacementNode.parent = originalNode.parent;
        }
        var parentNode = this.getNode(replacementNode.parent);
        if (options.maintainIndex && originalNode && originalNode.index) {
            replacementNode.index = originalNode.index;
            Object.keys(parentNode.children).forEach(function (childId) {
                var child = parentNode.children[childId];
                if (child.index >= originalNode.index) {
                    child.index += 1;
                }
            });
        }
        this.registerTree(tree);
        if (options.maintainIndex) {
            this.reindexChildrenOfNode(parentNode);
        }
    };
    Lrud.prototype.doesNodeHaveFocusableChildren = function (node) {
        return this.focusableNodePathList.some(function (p) { return p.indexOf(node.id + ".") > -1; });
    };
    /**
     * Change the ability of a node to be focused in place
     * @param {string} nodeId
     * @param {boolean} isFocusable
     */
    Lrud.prototype.setNodeFocusable = function (nodeId, isFocusable) {
        var node = this.getNode(nodeId);
        if (!node)
            return;
        var nodeIsFocusable = isNodeFocusable(node);
        if (nodeIsFocusable === isFocusable)
            return;
        node.isFocusable = isFocusable;
        if (!isFocusable) {
            var path = this.getPathForNodeId(nodeId);
            this.focusableNodePathList.splice(this.focusableNodePathList.indexOf(path), 1);
            var parent_1 = this.getNode(node.parent);
            if (parent_1 && parent_1.activeChild && parent_1.activeChild === nodeId) {
                delete parent_1.activeChild;
                // Reset activeChild
                var nextChild = this.getNextChild(parent_1);
                if (nextChild) {
                    this.setActiveChild(parent_1.id, nextChild.id);
                }
            }
            if (this.currentFocusNodeId === nodeId) {
                this.recalculateFocus(node);
            }
        }
        else {
            var path = this.getPathForNodeId(nodeId);
            this.focusableNodePathList.push(path);
        }
    };
    return Lrud;
}());

exports.Lrud = Lrud;
