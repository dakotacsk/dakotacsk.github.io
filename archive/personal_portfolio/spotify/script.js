define('app/device',['require','modernizr'],function(require) {

  var Modernizr = require('modernizr');
  var Device = {};

  /**
   * Hyphenates a javascript style string to a css one. For example:
   * MozBoxSizing -> -moz-box-sizing.
   *
   * @param {string|boolean} str The string to hyphenate.
   * @return {string} The hyphenated string.
   */
  Device.hyphenate = function(str) {

    // Catch booleans.
    if (!str) {
      return '';
    }

    // Turn MozBoxSizing into -moz-box-sizing.
    return str.replace(/([A-Z])/g, function(str, m1) {
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/, '-ms-');
  };


  /**
   * Object Model prefixes.
   * @type {string}
   * @private
   */
  Device.omPrefixes_ = 'Webkit Moz O ms';


  /**
   * CSS Object Model prefixes.
   * @type {Array.<string>}
   * @private
   */
  Device.cssomPrefixes_ = Device.omPrefixes_.split(' ');


  /**
   * Document Object Model prefixes.
   * @type {Array.<string>}
   * @private
   */
  Device.domPrefixes_ = Device.omPrefixes_.toLowerCase().split(' ');


  /**
   * Prefix lookup cache.
   * @type {Object}
   * @private
   */
  Device.prefixCache_ = {};

  /**
   * @param {*} obj Anything.
   * @return {boolean}
   */
  var isString = function(obj) {
    return typeof obj === 'string';
  };


  /**
   * Capitalize a string.
   * @param {string} str String to capitalize.
   * @return {string} Capitalized string.
   */
  var capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  /**
   * Returns the prefixed style property if it exists.
   * Mimics of Modernizr.prefixed. So Device.prefixed('transform') should
   * return 'WebkitTransform' for Chrome and 'transform' for FF and IE10.
   * {@link http://perfectionkills.com/feature-testing-css-properties/}
   *
   * @param  {string} propName The property name.
   * @param  {Element=} opt_element Element to test. Defaults to html element.
   * @return {string|boolean} The style property or false.
   */
  Device.prefixed = function(propName, opt_element) {
    opt_element = opt_element || document.documentElement;
    var style = opt_element.style,
        cache = Device.prefixCache_,
        prefixes = Device.cssomPrefixes_,
        prefixed,
        uPropName;

    // check cache only when no element is given.
    if (arguments.length === 1 && isString(cache[propName])) {
      return cache[propName];
    }

    // test standard property first.
    if (isString(style[propName])) {
      return (cache[propName] = propName);
    }

    // capitalize.
    uPropName = capitalize(propName);

    // test vendor specific properties.
    for (var i = 0, l = prefixes.length; i < l; i++) {
      prefixed = prefixes[i] + uPropName;
      if (isString(style[prefixed])) {
        return (cache[propName] = prefixed);
      }
    }

    return false;
  };


  /**
   * Prefixed style properties.
   * @enum {string|boolean}
   */
  Device.Js = {
    TRANSFORM: Device.prefixed('transform'),
    TRANSITION: Device.prefixed('transition'),
    TRANSITION_PROPERTY: Device.prefixed('transitionProperty'),
    TRANSITION_DURATION: Device.prefixed('transitionDuration'),
    TRANSITION_TIMING_FUNCTION: Device.prefixed('transitionTimingFunction'),
    TRANSITION_DELAY: Device.prefixed('transitionDelay')
  };


  /**
   * Prefixed css properties.
   * @enum {string}
   */
  Device.Css = {
    TRANSFORM: Device.hyphenate(Device.Js.TRANSFORM),
    TRANSITION: Device.hyphenate(Device.Js.TRANSITION),
    TRANSITION_PROPERTY: Device.hyphenate(Device.Js.TRANSITION_PROPERTY),
    TRANSITION_DURATION: Device.hyphenate(Device.Js.TRANSITION_DURATION),
    TRANSITION_TIMING_FUNCTION: Device.hyphenate(
        Device.Js.TRANSITION_TIMING_FUNCTION),
    TRANSITION_DELAY: Device.hyphenate(Device.Js.TRANSITION_DELAY)
  };


  /**
   * Whether the browser has css transitions.
   * @type {boolean}
   */
  Device.HAS_TRANSITIONS = Modernizr.csstransitions;


  /**
   * Whether the browser has css transitions.
   * @type {boolean}
   */
  Device.HAS_TRANSFORMS = Modernizr.csstransforms;


  /**
   * The browser can use css transitions and transforms.
   * @type {boolean}
   */
  Device.CAN_TRANSITION_TRANSFORMS = Device.HAS_TRANSITIONS &&
      Device.HAS_TRANSFORMS;


  /**
   * The browser can use 3d css transforms.
   * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/transforms3d.js
   * @type {boolean}
   */
  Device.HAS_3D_TRANSFORMS = Modernizr.csstransforms3d;


  /**
   * Whether the browser supports touch events.
   * @type {boolean}
   */
  Device.HAS_TOUCH_EVENTS = ('ontouchstart' in window) ||
      !!window.DocumentTouch && document instanceof DocumentTouch;


  /**
   * Whether the browser supports pointer events.
   * http://blogs.windows.com/windows_phone/b/wpdev/archive/2012/11/15/adapting-your-webkit-optimized-site-for-internet-explorer-10.aspx
   * @type {boolean}
   */
  Device.HAS_POINTER_EVENTS = !!navigator.pointerEnabled ||
      !!navigator.msPointerEnabled;


  return Device;
});

define('app/helpers',['require','jquery','app/device', 'modernizr', 'app/event-type'],function(require) {
  var $ = require('jquery');
  var Device = require('app/device');
  var Modernizr = require('modernizr');
  var EventType = require('app/event-type');
  var Helpers = {};

  /** @enum {string} */
  Helpers.ClassName = {
    HIDDEN: 'hidden',
    FADE: 'fade',
    IN: 'in',
    INVISIBLE: 'invisible',
    ACTIVE: 'active',
    GRAB: 'grab',
    GRABBING: 'grabbing'
  };

  // Polyfill Object.create.
  if (!Object.create) {
    Object.create = (function() {
      function F(){}
      return function(o) {
        if (arguments.length !== 1) {
          throw new Error(
              'Object.create implementation only accepts one parameter.');
        }
        F.prototype = o;
        return new F();
      };
    })();
  }

  Helpers.inherits = function(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;

    /**
     * Taken from Closure :)
     *
     * Calls superclass constructor/method.
     *
     * This function is only available if you use goog.inherits to
     * express inheritance relationships between classes.
     *
     * NOTE: This is a replacement for goog.base and for superClass_
     * property defined in child.
     *
     * @param {!Object} me Should always be "this".
     * @param {string} methodName The method name to call. Calling
     *     superclass constructor can be done with the special string
     *     'constructor'.
     * @param {...*} var_args The arguments to pass to superclass
     *     method/constructor.
     * @return {*} The return value of the superclass method/constructor.
     */
    child.base = function(me, methodName, var_args) {
      var args = Array.prototype.slice.call(arguments, 2);
      return parent.prototype[methodName].apply(me, args);
    };
  };


  /**
   * Capitalize a string.
   * @param {string} str String to capitalize.
   * @return {string} Capitalized string.
   */
  Helpers.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };



  // Math utilities.


  /**
   * Clone of jQuery.isNumeric {@link https://api.jquery.com/jQuery.isNumeric}
   * Because goog.isNumber only checks if the type is a number, so NaN passes.
   * @param {*} obj Object to test.
   * @return {!boolean} Whether the given object is a number.
   */
  Helpers.isNumeric = function(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
  };


  /**
   * Takes a number and clamps it to within the provided bounds.
   * @param {number} value The input number.
   * @param {number} min The minimum value to return.
   * @param {number} max The maximum value to return.
   * @return {number} The input number if it is within bounds, or the nearest
   *     number within the bounds.
   */
  Helpers.clamp = function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  };


  /**
   * Class for representing a box. A box is specified as a top, right, bottom,
   * and left. A box is useful for representing margins and padding.
   *
   * @param {number} top Top.
   * @param {number} right Right.
   * @param {number} bottom Bottom.
   * @param {number} left Left.
   * @constructor
   */
  Helpers.Box = function(top, right, bottom, left) {
    /**
     * Top
     * @type {number}
     */
    this.top = top;

    /**
     * Right
     * @type {number}
     */
    this.right = right;

    /**
     * Bottom
     * @type {number}
     */
    this.bottom = bottom;

    /**
     * Left
     * @type {number}
     */
    this.left = left;
  };


  /**
   * Class for representing rectangular regions.
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} w Width.
   * @param {number} h Height.
   * @constructor
   */
  Helpers.Rect = function(x, y, w, h) {
    /**
     * Left
     * @type {number}
     */
    this.left = x;

    /**
     * Top
     * @type {number}
     */
    this.top = y;

    /**
     * Width
     * @type {number}
     */
    this.width = w;

    /**
     * Height
     * @type {number}
     */
    this.height = h;
  };



  // Style utilities

  /**
   * Gets the height and with of an element when the display is not none.
   * @param {Element} element Element to get size of.
   * @return {!{width: number, height: number}} Object with width/height.
   */
  Helpers.getSize = function(element) {
    var offsetWidth = element.offsetWidth;
    var offsetHeight = element.offsetHeight;
    if (offsetWidth === undefined && element.getBoundingClientRect) {
      // Fall back to calling getBoundingClientRect when offsetWidth or
      // offsetHeight are not defined.
      var clientRect = element.getBoundingClientRect();
      return {
        width: clientRect.right - clientRect.left,
        height: clientRect.bottom - clientRect.top
      };
    }
    return {
      width: offsetWidth,
      height: offsetHeight
    };
  };


  Helpers._getBox = function(element, property) {
    var props = $(element).css([
      property + 'Top',
      property + 'Right',
      property + 'Left',
      property + 'Bottom'
    ]);
    return new Helpers.Box(
        Helpers.getFloat(props[property + 'Top']),
        Helpers.getFloat(props[property + 'Right']),
        Helpers.getFloat(props[property + 'Left']),
        Helpers.getFloat(props[property + 'Bottom']));
  };

  Helpers.getFloat = function(value) {
    return parseFloat(value) || 0;
  };


  Helpers.getMarginBox = function(element) {
    return Helpers._getBox(element, 'margin');
  };


  /**
   * Returns a string to be used with transforms. Uses 3d translates
   * when available.
   * @param {string=} opt_x The x position value with units. Default is zero.
   * @param {string=} opt_y The y position value with units. Default is zero.
   * @return {string} The css value for transform.
   */
  Helpers.getTranslateString = function(opt_x, opt_y) {
    var x = opt_x !== undefined ? opt_x : 0;
    var y = opt_y !== undefined ? opt_y : 0;
    var prefix = 'translate';
    var suffix = ')';

    if (Device.HAS_3D_TRANSFORMS) {
      prefix += '3d(';
      suffix = ',0' + suffix;

    } else {
      prefix += '(';
    }

    return prefix + x + ',' + y + suffix;
  };


  Helpers.onTransitionEnd = function( elem, fn, context, opt_property ) {
    // transitioned and ignore others.
    if ( elem.jquery ) {
      elem = elem[0];
    }

    var callback = $.proxy(fn, context || window);
    var fakeEvent = {
      target: elem,
      currentTarget: elem,
      fake: true
    };

    /**
     * @param {$.Event|{target: Element, currentTarget: Element}} evt Event object.
     */
    function transitionEnded(evt) {
      var source = evt.currentTarget;
      // Some other element's transition event could have bubbled up to this.
      if (!source || source !== evt.target) {
        return;
      }

      // If the browser has transitions, there will be a listener bound to the
      // `transitionend` event which needs to be removed. `listenOnce` is not used
      // because transition events can bubble up to the parent.
      if (Modernizr.csstransitions) {
        // If the optional property exists and it's not the property which was
        // transitioned, exit out of the function and continue waiting for the
        // right transition property.
        if (opt_property && !evt.fake && evt.originalEvent.propertyName !== opt_property) {
          return;
        }

        $(source).off(EventType.TRANSITIONEND, transitionEnded);
      }

      // Done!
      callback(evt);
    }


    if (Modernizr.csstransitions) {
      $(elem).on(EventType.TRANSITIONEND, transitionEnded);
      // TODO(glen): Get length of transition and set a timeout as a backup.
      // The transition will not happen if the values don't change on the element,
      // the timeout would be a failsafe for that.
    } else {

      // Push to the end of the queue with a fake event which will pass the checks
      // inside the callback function.
      setTimeout($.proxy(transitionEnded, window, fakeEvent), 0);
    }
  };


  return Helpers;
});
/**
 * @fileoverview The base abstract component providing easy-to-use things for
 * working with dom and other services.
 */

define('app/base-component',['require','jquery','modernizr','app/helpers'],function(require) {


  var $ = require('jquery');
  var Modernizr = require('modernizr');
  var Helpers = require('app/helpers');



  /**
   * The base class for modules.
   * @param {Element} element Main element of the module.
   * @param {boolean} addListener Whether to listen for the 767|768 breakpoint.
   * @constructor
   */
  function BaseComponent( element, addListener ) {
    if ( element ) {
      this.$el = $( element );
      this.element = element;
    }


    if ( addListener ) {
      /**
       * Whether the screen is smaller than 768px or not.
       * @type {boolean}
       */
      this.isSmallScreen = false;

      if ( Modernizr.mediaqueries ) {
        this._mql = window.matchMedia('(max-width: 47.9375em)');
        this._mqlListener = this.handleMediaQueryChange.bind( this );
        this.isSmallScreen = this._mql.matches;
      }
    }
  }


  BaseComponent.prototype.decorateInternal = function() {};
  BaseComponent.prototype.enterDocument = function() {};


  BaseComponent.prototype.getElement = function() {
    return this.element;
  };


  /**
   * Listen for events.
   */
  BaseComponent.prototype.listen = function() {
    // Listen for changes across 767|768.
    if ( this._mql ) {
      this._mql.addListener( this._mqlListener );
    }
  };


  /**
   * Finds an element within this class' main element.
   * @param {string} selector Selector.
   * @param {jQuery|Element} [context] Optionally provide the context (scope)
   *     for the query. Default is the main element of the class.
   * @return {jQuery} A jQuery object which may or may not contain the element
   *     which was searched for.
   */
  BaseComponent.prototype.findBySelector = function( selector, context ) {
    return $( selector, context || this.$el );
  };


  /**
   * Finds an element within this class' main element.
   * @param {string} className Class name to search for.
   * @param {jQuery|Element} [context] Optionally provide the context (scope)
   *     for the query. Default is the main element of the class.
   * @return {jQuery} A jQuery object which may or may not contain the element
   *     which was searched for.
   */
  BaseComponent.prototype.findByClass = function( className, context ) {
    return this.findBySelector( '.' + className, context );
  };


  BaseComponent.prototype.getElementByClass = function(className, context) {
    return this.findByClass(className, context).get(0) || null;
  };


  BaseComponent.prototype.getElementsByClass = function(className, context) {
    return this.findByClass(className, context).get();
  };


  /**
   * Retieves elements from the children of a parent which match the given
   * class. This function is useful when an element has the same class name
   * nested deeper within the element that is needed.
   * @param {string} className The classname to match against.
   * @param {Element} parent The element whose children will be filtered.
   * @return {!Array.<Element>} Direct descendants of the parent by class.
   */
  BaseComponent.prototype.getDirectDescendantsByClass = function(
      className, parent) {
    return $(parent).children('.' + className).get();
  };


  BaseComponent.prototype.getParentByClass = function(className, child,
      opt_context) {
    var context = opt_context || this.element;
    return $(child).closest('.' + className, context).get(0) || null;
  };


  /**
   * Cleanup DOM references and event listeners.
   */
  BaseComponent.prototype.dispose = function() {
    if ( this._mql ) {
      this._mql.removeListener( this._mqlListener );
      this._mql = null;
    }

    if ( this.$el ) {
      this.$el = null;
      this.element = null;
    }
  };


  /**
   * Triggers an event on the class instance.
   * @param {string|jQuery.Event} eventName Name of the event to trigger or
   *     an event instance.
   * @param {Array.<*>} [args] Optional arguments to send with the event.
   * @return {?boolean} If the event name is an event instance, this function
   *     returns whether or not the event was prevented using preventDefault().
   */
  BaseComponent.prototype.dispatchEvent = function(eventName, args) {
    if ($.type(eventName) === 'string') {
      $(this).trigger( eventName, args && args.length ? args : [ this ] );
      return null;
    } else {
      $(this).trigger(eventName); // undefined not a function :(
      return eventName.isDefaultPrevented();
    }
  };


  /**
   * Return the media query list.
   * @return {MediaQueryList}
   * @protected
   */
  BaseComponent.prototype.getMediaQueryList = function() {
    return this._mql;
  };


  /**
   * Media query changed. Ideally this should be on some kind of base component which
   * all modules inherit from.
   * @param {MediaQueryList} mediaQueryList The media query list object.
   * @protected
   */
  BaseComponent.prototype.handleMediaQueryChange = function( mediaQueryList ) {
    this.isSmallScreen = mediaQueryList.matches;
  };


  return BaseComponent;
});


/**
 * @fileoverview A utility class for representing two-dimensional positions.
 */

define('app/coordinate',[],function() {
  /**
   * Class for representing coordinates and positions.
   * @param {number=} opt_x Left, defaults to 0.
   * @param {number=} opt_y Top, defaults to 0.
   * @constructor
   */
  var Coordinate = function(opt_x, opt_y) {
    /**
     * X-value
     * @type {number}
     */
    this.x = opt_x !== undefined ? opt_x : 0;

    /**
     * Y-value
     * @type {number}
     */
    this.y = opt_y !== undefined ? opt_y : 0;
  };


  /**
   * Returns the distance between two coordinates.
   * @param {!Coordinate} a A Coordinate.
   * @param {!Coordinate} b A Coordinate.
   * @return {number} The distance between {@code a} and {@code b}.
   */
  Coordinate.distance = function(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return Coordinate;
});
define('app/event-type',['app/device'], function(Device) {

  // https://github.com/Modernizr/Modernizr/blob/master/src/prefixed.js
  var transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
    'MozTransition': 'transitionend', // only for FF < 15
    'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
  };

  var hasUnprefixedPointerEvents = !!navigator.pointerEnabled;

  function getPointerEvent(event) {
    if (Device.HAS_POINTER_EVENTS) {
      if (hasUnprefixedPointerEvents) {
        return event.toLowerCase();
      } else {
        return 'MS' + event;
      }
    } else {
      return null;
    }
  }


  return {
    // Mouse events
    CLICK: 'click',
    MOUSEDOWN: 'mousedown',
    MOUSEUP: 'mouseup',
    MOUSEOVER: 'mouseover',
    MOUSEOUT: 'mouseout',
    MOUSEMOVE: 'mousemove',

    // WebKit touch events.
    TOUCHSTART: 'touchstart',
    TOUCHMOVE: 'touchmove',
    TOUCHEND: 'touchend',
    TOUCHCANCEL: 'touchcancel',

    POINTERCANCEL: getPointerEvent('PointerCancel'),
    POINTERDOWN: getPointerEvent('PointerDown'),
    POINTERMOVE: getPointerEvent('PointerMove'),
    POINTEROVER: getPointerEvent('PointerOver'),
    POINTEROUT: getPointerEvent('PointerOut'),
    POINTERUP: getPointerEvent('PointerUp'),

    TRANSITIONEND: transEndEventNames[Device.Js.TRANSITION]
  };
});
/**
 * @fileoverview A draggable class which uses translate when
 * available and can use a containing element instead of specific boundaries.
 * It also emits events with more useful information for swipes, like velocity,
 * distance, and direction.
 */

define('app/draggable',['require','jquery','app/helpers','app/base-component','app/coordinate','app/device','app/event-type'],function(require) {

  var $ = require('jquery');
  var Helpers = require('app/helpers');
  var BaseComponent = require('app/base-component');
  var Coordinate = require('app/coordinate');
  var Device = require('app/device');
  var EventType = require('app/event-type');

  /**
   * A class that allows mouse or touch-based dragging (moving) of an element.
   *
   * @param {Element} dragElement The element that will be dragged.
   * @param {Element} containment The element which will contain the draggable
   *     element.
   * @param {string=} opt_axis The axis to drag on. Defaults to both. Should be
   *     "x" or "y" to constrain to an axis.
   * @extends {BaseComponent}
   * @constructor
   */
  var Draggable = function(dragElement, containment, opt_axis, opt_limits) {
    Draggable.base(this, 'constructor', dragElement);

    /**
     * The draggable element.
     * @type {Element}
     * @private
     */
    this.el_ = dragElement;

    /**
     * The element which contains the target.
     * @type {Element}
     * @private
     */
    this.containerEl_ = containment;

    /**
     * Object to keep track of the current position of the handle/target.
     * @type {Coordinate}
     * @private
     */
    this.currentPosition_ = new Coordinate();

    /**
     * Object to keep track of the where the starting location for dragging was.
     * Relative to the draggable element.
     * @type {Coordinate}
     * @private
     */
    this.startPosition_ = new Coordinate();

    /**
     * Current x position of mouse or touch relative to the document.
     * @type {number}
     */
    this.pageX = 0;


    /**
     * Current y position of mouse or touch relative to the document.
     * @type {number}
     */
    this.pageY = 0;


    /**
     * The x position where the first mousedown or touchstart occurred.
     * @type {number}
     */
    this.startX = 0;


    /**
     * The y position where the first mousedown or touchstart occurred.
     * @type {number}
     */
    this.startY = 0;


    /**
     * Current x position of drag relative to target's parent.
     * @type {number}
     */
    this.deltaX = 0;


    /**
     * Current y position of drag relative to target's parent.
     * @type {number}
     */
    this.deltaY = 0;

    /**
     * Limits of how far the draggable element can be dragged.
     * @type {Helpers.Rect}
     */
    this.limits = opt_limits || new Helpers.Rect(NaN, NaN, NaN, NaN);

    /**
     * Friction to apply to dragging. A value of zero would result in no dragging,
     * 0.5 would result in the draggable element moving half as far as the user
     * dragged, and 1 is a 1:1 ratio with user movement.
     * @type {number}
     */
    this.friction_ = 1;

    /**
     * Draggable axis.
     * @type {string}
     * @private
     */
    this.axis_ = opt_axis || Draggable.Axis.BOTH;

    /**
     * Flag indicating dragging has happened. It is set on dragmove and reset
     * after the draggableend event has been dispatched.
     * @type {boolean}
     */
    this.hasDragged = false;

    /**
     * Whether the user is locked in place within the draggable element. This
     * is set to true when `preventDefault` is called on the move event.
     * @type {boolean}
     * @private
     */
    this.isLocked_ = false;

    /**
     * Whether dragging is enabled internally. If the user attempts to scroll
     * in the opposite direction of the draggable element, this is set to true
     * and no more drag move events are counted until the user releases and
     * starts dragging again.
     * @type {boolean}
     * @private
     */
    this.isDeactivated_ = false;

    /**
     * Whether dragging is currently enabled.
     * @type {boolean}
     * @private
     */
    this.enabled_ = true;

    var $el = $(this.el_);
    // Namespace
    var ns = '.draggable';

    if (Device.HAS_POINTER_EVENTS) {
      $el.on(EventType.POINTERDOWN + ns, this.handleDragStart_.bind(this));

    } else {
      $el.on(EventType.MOUSEDOWN + ns, this.handleDragStart_.bind(this));

      if (Device.HAS_TOUCH_EVENTS) {
        $el.on(EventType.TOUCHSTART + ns, this.handleDragStart_.bind(this));
      }
    }
  };

  Helpers.inherits(Draggable, BaseComponent);


  /** @enum {string} */
  Draggable.EventType = {
    START: 'draggablestart',
    MOVE: 'draggablemove',
    END: 'draggableend'
  };


  /** @enum {string} */
  Draggable.Direction = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down',
    NONE: 'no_movement'
  };


  /** @enum {string} */
  Draggable.Axis = {
    X: 'x',
    Y: 'y',
    BOTH: 'xy'
  };


  /**
   * The scroll/drag amount (pixels) required on the draggable axis before
   * stopping further page scrolling/movement.
   * @const {number}
   */
  Draggable.LOCK_THRESHOLD = 6;


  /**
   * The scroll/drag amount (pixels) required on the opposite draggable axis
   * before dragging is deactivated for the rest of the interaction.
   * @const {number}
   */
  Draggable.DRAG_THRESHOLD = 5;


  /**
   * Calculate the velocity between two points.
   *
   * @param {number} deltaTime Change in time.
   * @param {number} deltaX Change in x.
   * @param {number} deltaY Change in y.
   * @return {Object} Velocity of the drag.
   */
  Draggable.getVelocity = function(deltaTime, deltaX, deltaY) {
    var velocityX = Math.abs(deltaX / deltaTime);
    var velocityY = Math.abs(deltaY / deltaTime);
    return {
      x: isFinite(velocityX) ? velocityX : 0,
      y: isFinite(velocityY) ? velocityY : 0
    };
  };


  /**
   * angle to direction define.
   * @param {Coordinate} coord1 The starting coordinate.
   * @param {Coordinate} coord2 The ending coordinate.
   * @return {string} Direction constant.
   */
  Draggable.getDirection = function(coord1, coord2) {
    var x = Math.abs(coord1.x - coord2.x);
    var y = Math.abs(coord1.y - coord2.y);

    if (x >= y) {
      return coord1.x - coord2.x > 0 ?
          Draggable.Direction.LEFT :
          coord1.x - coord2.x < 0 ?
            Draggable.Direction.RIGHT :
            Draggable.Direction.NONE;
    } else {
      return coord1.y - coord2.y > 0 ?
          Draggable.Direction.UP :
          coord1.y - coord2.y < 0 ?
            Draggable.Direction.DOWN :
            Draggable.Direction.NONE;
    }
  };


  /**
   * Saves the containment element's width and height and scrubber position.
   * @private
   */
  Draggable.prototype.setDimensions_ = function() {
    var containmentRect = this.containerEl_.getBoundingClientRect();
    var elRect = this.el_.getBoundingClientRect();

    var relativeElement = Device.CAN_TRANSITION_TRANSFORMS ?
        this.el_ :
        this.containerEl_;

    // getBoundingClientRect does not include margins. They must be accounted for.
    var margins = Helpers.getMarginBox(this.el_);
    var offsetCorrectionX = margins.left;
    var offsetCorrectionY = margins.top;
    offsetCorrectionX += containmentRect.left;
    offsetCorrectionY += containmentRect.top;

    this.containmentWidth_ = relativeElement.offsetWidth;
    this.containmentHeight_ = relativeElement.offsetHeight;

    if (this.containmentWidth_ === 0) {
      throw new Error('containing element\'s width is zero');
    } else if (this.containmentHeight_ === 0) {
      throw new Error('containing element\'s height is zero');
    }

    this.startPosition_.x = elRect.left - offsetCorrectionX;
    this.startPosition_.y = elRect.top - offsetCorrectionY;
  };


  /**
   * Get whether dragger is enabled
   * @return {boolean} Whether dragger is enabled.
   */
  Draggable.prototype.getEnabled = function() {
    return this.enabled_;
  };


  /**
   * Set whether dragger is enabled
   * @param {boolean} enabled Whether dragger is enabled.
   */
  Draggable.prototype.setEnabled = function(enabled) {
    this.enabled_ = enabled;
  };


  /**
   * Sets (or reset) the Drag limits after a Dragger is created.
   * @param {Helpers.Rect} limits Object containing left, top, width,
   *     height for new Dragger limits.
   */
  Draggable.prototype.setLimits = function(limits) {
    this.limits = limits || new Helpers.Rect(NaN, NaN, NaN, NaN);
  };


  /**
   * Returns the 'real' x after limits are applied (allows for some
   * limits to be undefined).
   * @param {number} x X-coordinate to limit.
   * @return {number} The 'real' X-coordinate after limits are applied.
   */
  Draggable.prototype.limitX = function(x) {
    var rect = this.limits;
    var left = isNaN(rect.left) ? null : rect.left;
    var width = isNaN(rect.width) ? 0 : rect.width;
    var maxX = left !== null ? left + width : Infinity;
    var minX = left !== null ? left : -Infinity;
    return Helpers.clamp(x, minX, maxX);
  };


  /**
   * Returns the 'real' y after limits are applied (allows for some
   * limits to be undefined).
   * @param {number} y Y-coordinate to limit.
   * @return {number} The 'real' Y-coordinate after limits are applied.
   */
  Draggable.prototype.limitY = function(y) {
    var rect = this.limits;
    var top = isNaN(rect.top) ? null : rect.top;
    var height = isNaN(rect.height) ? 0 : rect.height;
    var maxY = top !== null ? top + height : Infinity;
    var minY = top !== null ? top : -Infinity;
    return Helpers.clamp(y, minY, maxY);
  };


  /**
   * Returns the x and y positions the draggable element should be set to.
   * @param {Coordinate=} opt_position Position to set the draggable
   *     element. This will optionally override calculating the position
   *     from a drag.
   * @return {!Coordinate} The x and y coordinates.
   * @private
   */
  Draggable.prototype.getElementPosition_ = function(opt_position) {
    var outputX = 0;
    var outputY = 0;

    if (opt_position) {
      var scrubberX = (opt_position.x / 100) * this.containerEl_.offsetWidth;
      var scrubberY = (opt_position.y / 100) * this.containerEl_.offsetHeight;
      this.currentPosition_.x = this.limitX(scrubberX);
      this.currentPosition_.y = this.limitY(scrubberY);
    }

    var newX = (this.currentPosition_.x / this.containmentWidth_) * 100;
    var newY = (this.currentPosition_.y / this.containmentHeight_) * 100;

    // Drag horizontal only.
    if (this.axis_ === Draggable.Axis.X) {
      outputX = newX;

    // Drag vertical only.
    } else if (this.axis_ === Draggable.Axis.Y) {
      outputY = newY;

    // Drag both directions.
    } else {
      outputX = newX;
      outputY = newY;
    }

    return new Coordinate(outputX, outputY);
  };


  /**
   * Apply a friction value to an pixel position, reducing its value.
   * @param {number} position X or Y position.
   * @return {number} Position multiplied by friction.
   * @private
   */
  Draggable.prototype.applyFriction_ = function(position) {
    return position * this.friction_;
  };


  /**
   * Drag start handler.
   * @param  {jQuery.Event} evt The drag event object.
   * @private
   */
  Draggable.prototype.handleDragStart_ = function(evt) {
    var browserEvent = evt.originalEvent;
    var isTouchEvent = !!browserEvent.changedTouches;
    var isPointerEvent = !!browserEvent.pointerId;

    // Must be left click to drag.
    if (!this.enabled_ || !isTouchEvent && evt.which !== 1) {
      return;
    }

    // Use the first touch for the pageX and pageY.
    if (isTouchEvent) {
      this.startX = browserEvent.changedTouches[0].pageX;
      this.startY = browserEvent.changedTouches[0].pageY;

    // Pointer events have trusted pageX and pageY values, but jQuery doesn't
    // normalize it for us because it doesn't know what pointer events are yet.
    } else if (isPointerEvent) {
      this.startX = browserEvent.pageX;
      this.startY = browserEvent.pageY;
    } else {
      this.startX = evt.pageX; // Normalized by jQuery.
      this.startY = evt.pageY; // Normalized by jQuery.
    }

    this.pageX = this.startX;
    this.pageY = this.startY;
    this.deltaX = 0;
    this.deltaY = 0;

    this.timestamp = $.now();
    this.deltaTime = 0;
    this.setDimensions_();

    this.currentPosition_ = new Coordinate(
        this.startPosition_.x,
        this.startPosition_.y);

    // Give a hook to others
    var isPrevented = this.dispatchEvent(new DraggableEvent(
        Draggable.EventType.START, this, this.startPosition_,
        this.startPosition_));

    if (!isPrevented) {
      this.setupDragHandlers();
    }
  };


  /**
   * Drag move, after applyDraggableElementPosition has happened
   * @param {jQuery.Event} evt The dragger event.
   * @private
   */
  Draggable.prototype.handleDragMove_ = function(evt) {
    if (!this.enabled_ || this.isDeactivated_) {
      return;
    }

    var browserEvent = evt.originalEvent;
    var isTouchEvent = !!browserEvent.changedTouches;
    var isPointerEvent = !!browserEvent.pointerId;


    if (isTouchEvent) {
      this.pageX = browserEvent.changedTouches[0].pageX;
      this.pageY = browserEvent.changedTouches[0].pageY;
    } else if (isPointerEvent) {
      this.pageX = browserEvent.pageX;
      this.pageY = browserEvent.pageY;
    } else {
      this.pageX = evt.pageX; // Normalized by jQuery.
      this.pageY = evt.pageY; // Normalized by jQuery.
    }

    this.deltaX = this.pageX - this.startX;
    this.deltaY = this.pageY - this.startY;


    var newX = this.startPosition_.x + this.applyFriction_(this.deltaX);
    var newY = this.startPosition_.y + this.applyFriction_(this.deltaY);

    this.currentPosition_.x = this.limitX(newX);
    this.currentPosition_.y = this.limitY(newY);
    this.deltaTime = $.now() - this.timestamp;


    // Emit an event.
    var isPrevented = this.dispatchEvent(new DraggableEvent(
        Draggable.EventType.MOVE,
        this, this.startPosition_, this.currentPosition_));

    // Abort if the developer prevented default on the custom event.
    if (isPrevented) {
      return;
    }

    this.hasDragged = true;

    var absX = Math.abs(this.deltaX);
    var absY = Math.abs(this.deltaY);

    // Prevent scrolling if the user has moved past the locking threshold.
    if ((this.axis_ === Draggable.Axis.X && absX > Draggable.LOCK_THRESHOLD) ||
        (this.axis_ === Draggable.Axis.Y && absY > Draggable.LOCK_THRESHOLD)) {
      this.isLocked_ = true;
      evt.preventDefault();
    }

    // Disable dragging if the user is attempting to go the opposite direction
    // of the draggable element.
    if (!this.isLocked_ && (
        (this.axis_ === Draggable.Axis.X && absY > Draggable.DRAG_THRESHOLD) ||
        (this.axis_ === Draggable.Axis.Y && absX > Draggable.DRAG_THRESHOLD))) {
      this.isDeactivated_ = true;
    }

    if (!this.isDeactivated_) {
      this.applyDraggableElementPosition();
    }
  };


  /**
   * Dragging ended.
   * @private
   */
  Draggable.prototype.handleDragEnd_ = function() {
    this.cleanupDragHandlers();

    var start = this.startPosition_;
    var end = this.currentPosition_;

    this.deltaTime = $.now() - this.timestamp;

    // Give a hook to others
    this.dispatchEvent(new DraggableEvent(
        Draggable.EventType.END, this, start, end));

    this.hasDragged = false;
    this.isDeactivated_ = false;
    this.isLocked_ = false;
  };


  /**
   * Sets the position of thd draggable element.
   * @param {Coordinate=} opt_position Position to set the draggable
   *     element. This will optionally override calculating the position
   *     from a drag.
   * @return {Coordinate} The position the draggable element was set to.
   */
  Draggable.prototype.applyDraggableElementPosition = function(opt_position) {
    var pos = this.getElementPosition_(opt_position);

    // Add percentage unit
    var outputX = pos.x + '%';
    var outputY = pos.y + '%';

    if (Device.CAN_TRANSITION_TRANSFORMS) {
      this.el_.style[Device.Js.TRANSFORM] =
          Helpers.getTranslateString(outputX, outputY);
    } else {
      this.el_.style.left = outputX;
      this.el_.style.top = outputY;
    }

    return this.currentPosition_;
  };


  /**
   * Binds events to the document for move, end, and cancel (if cancel events
   * exist for the device).
   */
  Draggable.prototype.setupDragHandlers = function() {
    var $doc = $(document);
    var ns = '.draggable';

    if (Device.HAS_POINTER_EVENTS) {
      $doc.on(EventType.POINTERMOVE + ns, this.handleDragMove_.bind(this));
      $doc.on(EventType.POINTERUP + ns, this.handleDragEnd_.bind(this));

      // Touch and pointers have cancel events for when the user goes into
      // something like the browser chrome.
      $doc.on(EventType.POINTERCANCEL + ns, this.handleDragEnd_.bind(this));

    } else {
      $doc.on(EventType.MOUSEMOVE + ns, this.handleDragMove_.bind(this));
      $doc.on(EventType.MOUSEUP + ns, this.handleDragEnd_.bind(this));

      if (Device.HAS_TOUCH_EVENTS) {
        $doc.on(EventType.TOUCHMOVE + ns, this.handleDragMove_.bind(this));
        $doc.on(EventType.TOUCHEND + ns, this.handleDragEnd_.bind(this));

        // Touch and pointers have cancel events for when the user goes into
        // something like the browser chrome.
        $doc.on(EventType.TOUCHCANCEL + ns, this.handleDragEnd_.bind(this));
      }
    }
  };


  /**
   * Removes the events bound during drag start. The draggable namespace can be
   * used to remove all of them because the drag start event is still bound
   * to the actual element.
   */
  Draggable.prototype.cleanupDragHandlers = function() {
    var $doc = $(document);
    $doc.off('.draggable');
  };


  /**
   * Returns the current position of the draggable element.
   * @param {boolean} opt_asPercent Optionally retrieve percentage values instead
   *     of pixel values.
   * @return {Coordinate} X and Y coordinates of the draggable element.
   */
  Draggable.prototype.getPosition = function(opt_asPercent) {
    if (opt_asPercent) {
      return new Coordinate(
          (this.currentPosition_.x / this.containmentWidth_) * 100,
          (this.currentPosition_.y / this.containmentHeight_) * 100);
    } else {
      return this.currentPosition_;
    }
  };


  /**
   * Set the position of the draggable element.
   * @param {number} x X position as a percentage. Eg. 50 for "50%".
   * @param {number} y Y position as a percentage. Eg. 50 for "50%".
   * @return {Coordinate} The position the draggable element was set to.
   */
  Draggable.prototype.setPosition = function(x, y) {
    return this.applyDraggableElementPosition(new Coordinate(x, y));
  };


  /**
   * Set the friction value.
   * @param {number} friction A number between [1, 0].
   */
  Draggable.prototype.setFriction = function(friction) {
    if (friction !== this.friction_) {
      this.friction_ = friction;
    }
  };


  /**
   * Easy way to trigger setting dimensions. Useful for doing things after this
   * class has been initialized, but no dragging has occurred yet.
   * @return {Draggable} The instance.
   */
  Draggable.prototype.update = function() {
    this.setDimensions_();
    return this;
  };


  /** @override */
  Draggable.prototype.dispose = function() {
    Draggable.base(this, 'dispose');

    this.containerEl_ = null;
    this.el_ = null;

    // Remove pointer/mouse/touch events by namespace.
    $(this.el_).off('.draggable');
  };



  /**
   * Object representing a drag event.
   * @param {string} type Event type.
   * @param {Draggable} draggable The draggable instance.
   * @param {Coordinate} start The starting coordinate.
   * @param {Coordinate} end The ending coordinate.
   * @constructor
   * @extends {jQuery.Event}
   */
  var DraggableEvent = function(type, draggable, start, end) {
    $.Event.call(this, type);

    /**
     * @type {Element}
     */
    this.target = draggable.el_;

    /**
     * The change in x from drag start to end.
     * @type {number}
     */
    this.deltaX = end.x - start.x;

    /**
     * The change in y from drag start to end.
     * @type {number}
     */
    this.deltaY = end.y - start.y;

    /**
     * Time elapsed from mouse/touch down to mouse/touch up.
     * @type {number}
     */
    this.deltaTime = draggable.deltaTime;

    /**
     * Reference to the drag object for this event.
     * @type {Draggable}
     */
    this.draggable = draggable;

    /**
     * Velocity in drag.
     * @type {number}
     */
    this.velocity = Draggable.getVelocity(this.deltaTime,
        this.deltaX, this.deltaY);

    /**
     * Distance dragged.
     * @type {number}
     */
    this.distance = Coordinate.distance(start, end);

    /**
     * Direction of drag.
     * @type {string}
     */
    this.direction = Draggable.getDirection(start, end);

    var onAxis = false;

    // Is X and direction is right or left.
    if (draggable.axis_ === Draggable.Axis.X &&
      (this.direction === Draggable.Direction.LEFT ||
      this.direction === Draggable.Direction.RIGHT)) {
      onAxis = true;

    // Is Y and direction is down or up.
    } else if (draggable.axis_ === Draggable.Axis.Y &&
      (this.direction === Draggable.Direction.UP ||
      this.direction === Draggable.Direction.DOWN)) {
      onAxis = true;

    // Is both and direction is not none.
    } else if (draggable.axis_ === Draggable.Axis.BOTH &&
        this.direction !== Draggable.Direction.NONE) {
      onAxis = true;
    }

    /**
     * Whether the drag direction is on the axis of the draggable element.
     * @type {boolean}
     */
    this.isDirectionOnAxis = onAxis;

    /** @type {Coordinate} */
    this.position = draggable.currentPosition_;
  };

  Helpers.inherits(DraggableEvent, $.Event);


  return Draggable;
});


define('card-shuffle', ['require', 'jquery', 'app/device', 'app/helpers', 'app/base-component', 'app/draggable'], function(require) {
  var $ = require('jquery');
  var Device = require('app/device');
  var Helpers = require('app/helpers');
  var BaseComponent = require('app/base-component');
  var Draggable = require('app/draggable');

  var CardShuffle = function(element, isReverseStacked, isDraggable) {
    CardShuffle.base(this, 'constructor', element, true);
    this.currentIndex = 0;
    this.$cards = this.findByClass(CardShuffle.ClassName.CARD);
    this.totalCards = this.$cards.length;
    this.positions = $.map(this.$cards, function(card) {
      return parseFloat($(card).attr('data-position'));
    });
    this.isTransitioning = false;
    this.isReverseStacked = isReverseStacked;
    this.isDraggable = isDraggable;
    this.draggables = null;
    this.timerId = null;
    this.init();
  };

  Helpers.inherits(CardShuffle, BaseComponent);


  CardShuffle.ClassName = {
    CARD: 'card-shuffle__card',
    NO_TRANSITION: 'card-shuffle--no-transition',
    TO_BOTTOM: 'card-shuffle__card--to-bottom',
    FRONT: 'card-shuffle__card--front',
    START: 'card-shuffle__card--off-deck-start',
    END: 'card-shuffle__card--off-deck-end',
    INNER: 'card-shuffle__card-inner'
  };


  /**
   * When the card pops off the top of the deck, it can go in different
   * directions.
   * @type {Object}
   */
  CardShuffle.Direction = {
    START: CardShuffle.ClassName.START,
    END: CardShuffle.ClassName.END
  };


  CardShuffle.prototype.init = function() {

    var frontIndex = this.isReverseStacked ? 0 : this.totalCards - 1;
    this.$cards.filter('[data-position=' + frontIndex + ']')
      .addClass(CardShuffle.ClassName.FRONT);

    if (this.isDraggable) {
      this.draggables = new Array(this.totalCards);
      var self = this;
      this.$cards.each(function(i, card) {
        self.draggables[i] = new Draggable(card, card.parentNode, Draggable.Axis.X);
        if (i > 0) {
          self.draggables[i].setEnabled(false);
        }
      });
    }

    this.listen();
  };

  CardShuffle.prototype.listen = function() {
    CardShuffle.base(this, 'listen');

    if (this.isDraggable) {
      this.draggables.forEach(function(draggable) {
        $(draggable).on(Draggable.EventType.START, this._handleDraggableStart.bind(this));
        $(draggable).on(Draggable.EventType.END, this._handleDraggableEnd.bind(this));
      }, this);

    }
  };


  CardShuffle.prototype.dispose = function() {
    CardShuffle.base(this, 'dispose');
    if (this.draggables) {
      this.draggables.forEach(function(draggable) {
        $(draggable).off(Draggable.EventType.END);
      }, this);
    }
    this.$cards = null;
  };


  /**
   * Returns the logical index of a neighbor from a given relative number.
   * Non looped carousels at 0 and length - 1 don't have previous and next
   * neighbors, respectively, so 0 or length - 1 will be return, respectively.
   *
   * @param {number} logicalIndex The logical index which the second parameter
   *     is relative to.
   * @param {number} relativePos The relative position to the first parameter.
   * For example, -2 or 2.
   * @return {number} The logical index of the neighbor.
   * @private
   */
  CardShuffle.prototype._getRelativeIndex = function(logicalIndex, relativePos) {
    var index = logicalIndex + relativePos;

    if (index < 0) {
      return this.totalCards + index;
    } else if (index > this.totalCards - 1) {
      return index - this.totalCards;
    } else {
      return index;
    }
  };


  CardShuffle.prototype.advance = function(opt_direction) {
    var previousIndex = this.currentIndex;
    var selectedIndex = previousIndex + 1;
    var direction = opt_direction ? opt_direction : CardShuffle.Direction.END;

    if (selectedIndex >= this.totalCards) {
      selectedIndex = 0;
    }

    this.currentIndex = selectedIndex;

    this._updateCardPositions();
    this._popOffStack(previousIndex, direction);
  };


  CardShuffle.prototype._slideBack = function(draggable) {
    this.isTransitioning = true;

    this.$cards.eq(this.currentIndex).removeClass(CardShuffle.ClassName.NO_TRANSITION);

    var done = function() {
      clearTimeout(this.timerId);
      this.isTransitioning = false;
    }.bind(this);

    Helpers.onTransitionEnd(draggable.getElement(), done);
    this.timerId = setTimeout(done, 500);

    draggable.setPosition(0, 0);
  };


  CardShuffle.prototype._popOffStack = function(cardIndex, direction) {
    var $previousFront = this.$cards.eq(cardIndex);

    this.isTransitioning = true;

    // Animate card out of container
    $previousFront
      .removeClass()
      .addClass([
        CardShuffle.ClassName.CARD,
        CardShuffle.ClassName.TO_BOTTOM,
        direction
      ].join(' '));

    // When done going to the bottom, put it behind the other cards and
    // go back to the top of the container.
    Helpers.onTransitionEnd($previousFront, function($card) {
      $card.removeClass([
        CardShuffle.ClassName.TO_BOTTOM,
        CardShuffle.ClassName.START,
        CardShuffle.ClassName.END,
      ].join(' '));

      Helpers.onTransitionEnd($card, function() {
        this.isTransitioning = false;

        // Toggle dragging.
        this.draggables[cardIndex].setEnabled(false);
        this.draggables[this.currentIndex].setEnabled(true);
      }, this, Device.Css.TRANSFORM);
    }.bind(this, $previousFront));
  };


  CardShuffle.prototype._updateCardPositions = function() {
    this.$cards.each(function(i, el) {
      var currentPosition = this.positions[i];
      var nextPosition = this._getRelativeIndex(currentPosition, this.isReverseStacked ? -1 : 1);
      var $card = $(el);
      $card.attr('data-position', nextPosition);
      this.positions[i] = nextPosition;

      var isFront = false;
      if (this.isReverseStacked) {
        if (nextPosition === 0) {
          isFront = true;
        }
      } else {
        if (nextPosition === this.totalCards - 1) {
          isFront = true;
        }
      }

      $card.toggleClass(CardShuffle.ClassName.FRONT, isFront);
    }.bind(this));
  };


  CardShuffle.prototype._handleTap = function(evt) {
    var target = evt.target;
    var hasCardParent = $(target).closest('.' + CardShuffle.ClassName.INNER).length > 0;

    if (hasCardParent && !this.isTransitioning) {
      this.advance();
    }
  };


  CardShuffle.prototype._handleDraggableStart = function(evt) {
    if (this.isTransitioning) {
      evt.preventDefault();
      return;
    }

    var draggable = evt.draggable;
    var dragger = draggable.getElement();
    $(dragger).addClass([
      CardShuffle.ClassName.NO_TRANSITION,
      Helpers.ClassName.GRABBING
    ].join(' '));
  };


  CardShuffle.prototype._handleDraggableEnd = function(evt) {
    var velocityThreshold = 0.7;
    var velocity = evt.velocity;
    var direction = evt.direction;
    var draggable = evt.draggable;
    var position = draggable.getPosition(true);
    var dragger = evt.target;

    if (
        // Velocity throw
        (velocity.x > velocityThreshold && direction === Draggable.Direction.LEFT) ||
        // Dragged a quarter of the way
        (direction === Draggable.Direction.LEFT && position.x <= -25)) {
      dragger.style[Device.Js.TRANSFORM] = '';
      this.advance(CardShuffle.Direction.START);
    } else if (
        // Velocity throw
        (velocity.x > velocityThreshold && direction === Draggable.Direction.RIGHT) ||
        // Dragged a quarter of the way
        (direction === Draggable.Direction.RIGHT && position.x >= 25)) {
      dragger.style[Device.Js.TRANSFORM] = '';
      this.advance(CardShuffle.Direction.END);

    // As long as it has moved more than 1 pixel, it can be transitioned back to
    // the resting state. If it's zero, the transition end event will never
    // be triggered and the draggable will continue to be disabled.
    } else if (evt.isDirectionOnAxis) {
      this._slideBack(draggable);
    }

    $(draggable.getElement()).removeClass(Helpers.ClassName.GRABBING);
  };

  return CardShuffle;
});


requirejs.config({
  baseUrl: 'js',
  paths: {
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery'
  }
});


define('modernizr', [], window.Modernizr);


require(['card-shuffle'], function(CardShuffle) {
  window.cards = new CardShuffle($('.card-shuffle--stacked')[0], true, true);
});

define("app/main", function(){});