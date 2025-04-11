/**
 * Novacancy.js (Vanilla JS Version)
 * Text Blink Neon Golden effect Plugin
 *
 * Original jQuery plugin by Chuck Chang <eurt23@gmail.com>
 * Rewritten in Vanilla JS.
 *
 * @repo https://github.com/chuckyglitch/novacancy.js
 * @license MIT http://opensource.org/licenses/MIT
 */

(function() {
  "use strict";

  let novacancyIdCounter = 0;

  // Default settings
  const defaultSettings = {
    'reblinkProbability': (1/3),
    'blinkMin': 0.01,
    'blinkMax': 0.5,
    'loopMin': 0.5,
    'loopMax': 2,
    'color': 'ORANGE',
    'glow': ['0 0 80px Orange', '0 0 30px Red', '0 0 6px Yellow'],
    'off': 0,
    'blink': 0, // 0 means all characters
    'classOn': 'on',
    'classOff': 'off',
    'element': 'data', // Changed default from 'data' which is invalid HTML tag to 'span'
    'autoOn': true
  };

  class Novacancy {
    /**
     * Initializes the Novacancy effect on a single element.
     * @param {HTMLElement} el - The target DOM element.
     * @param {object} options - User-defined options to override defaults.
     */
    constructor(el, options) {
      this._el = el;
      this._settings = this._configure(options);
      this._powerOn = false;
      this._loopTimeout = null;
      this._items = [];
      this._blinkArr = [];
      this._styleElement = null; // To keep track of the added style element

      if (this._repeat()) return; // Avoid re-initializing

      this._buildHTML();
      this._items = Array.from(this._el.querySelectorAll(`${this._settings.element}.novacancy`));
      this._blinkArr = this._newArray();
      this._bindEvents();
      this._setAppearance();

      if (this._settings.autoOn) this.blinkOn();
    }

    /**
     * Merges user options with defaults and processes them.
     * @param {object} options - User-defined options.
     * @returns {object} The processed settings object.
     * @private
     */
    _configure(options) {
      const settings = Object.assign({}, defaultSettings, options);

      // Convert probabilities and times
      settings.reblinkProbability *= 100; // Convert to percentage
      settings.blinkMin *= 1000; // Convert seconds to ms
      settings.blinkMax *= 1000; // Convert seconds to ms
      settings.loopMin *= 1000; // Convert seconds to ms
      settings.loopMax *= 1000; // Convert seconds to ms

      // Validate element tag name
      // 'data' is not a valid interactive element for this purpose. Defaulting to 'span'.
       if (settings.element.toLowerCase() === 'data') {
           console.warn("Novacancy.js: Using '<data>' element is invalid for styling individual characters. Defaulting to '<span>'. Please update the 'element' option.");
           settings.element = 'span';
       }


      return settings;
    }

    /**
     * Checks if Novacancy has already been initialized on the element.
     * @returns {boolean} True if already initialized, false otherwise.
     * @private
     */
    _repeat() {
      if (this._el.dataset.novacancyInitialized) {
        return true;
      } else {
        this._el.dataset.novacancyInitialized = 'true';
        return false;
      }
    }

    /**
     * Sets a unique ID and generates/injects CSS for the element.
     * @private
     */
    _setAppearance() {
      const name = 'data-novacancy-id';
      const nvid = ++novacancyIdCounter;
      const attrSelector = `[${name}="${nvid}"]`;
      this._el.setAttribute(name, nvid);
      this._addCSS(attrSelector);
    }

    /**
     * Creates and injects the dynamic CSS rules.
     * @param {string} attrSelector - The attribute selector for scoping CSS.
     * @private
     */
    _addCSS(attrSelector) {
       // Remove existing style element for this instance if it exists
       if (this._styleElement && this._styleElement.parentNode) {
            this._styleElement.parentNode.removeChild(this._styleElement);
       }

      const cssBuilder = this._css(attrSelector);
      this._styleElement = document.createElement('style');
      this._styleElement.textContent = cssBuilder;
      document.head.appendChild(this._styleElement); // Inject into <head>
    }

    /**
     * Generates the CSS rules string.
     * @param {string} attrSelector - The attribute selector for scoping CSS.
     * @returns {string} The generated CSS string.
     * @private
     */
    _css(attrSelector) {
      let colorOn = '';
      let colorOff = '';
      let textShadow = '';

      if (this._settings.color !== null) {
        colorOn += `color: ${this._settings.color};`;
        colorOff += `color: ${this._settings.color}; opacity: 0.3;`;
      }

      if (this._settings.glow !== null) {
        // Ensure glow is an array and join it correctly
        const glowValue = Array.isArray(this._settings.glow) ? this._settings.glow.join(', ') : this._settings.glow.toString();
         textShadow += `text-shadow: ${glowValue};`;
        colorOn += textShadow;
      }

      let css = '';
      css += `${attrSelector} .novacancy.${this._settings.classOn} { ${colorOn} }\n`;
      css += `${attrSelector} .novacancy.${this._settings.classOff} { ${colorOff} }\n`;

      return css;
    }

    /**
     * Generates a random integer within a range.
     * @param {number} min - Minimum value.
     * @param {number} max - Maximum value.
     * @returns {number} Random integer.
     * @private
     */
    _rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Performs a single blink cycle for an item.
     * @param {HTMLElement} item - The character element to blink.
     * @private
     */
    _blink(item) {
      this.off(item);
      item.dataset.blinking = 'true';
      setTimeout(() => {
        this.on(item);
        this._reblink(item);
      }, this._rand(this._settings.blinkMin, this._settings.blinkMax));
    }

    /**
     * Determines if an item should blink again based on probability.
     * @param {HTMLElement} item - The character element.
     * @private
     */
    _reblink(item) {
      setTimeout(() => {
        if (this._rand(1, 100) <= this._settings.reblinkProbability) {
          this._blink(item);
        } else {
          item.dataset.blinking = 'false';
        }
      }, this._rand(this._settings.blinkMin, this._settings.blinkMax));
    }

    /**
     * Turns a character element 'on'.
     * @param {HTMLElement} item - The character element.
     */
    on(item) {
      item.classList.remove(this._settings.classOff);
      item.classList.add(this._settings.classOn);
    }

    /**
     * Turns a character element 'off'.
     * @param {HTMLElement} item - The character element.
     */
    off(item) {
      item.classList.remove(this._settings.classOn);
      item.classList.add(this._settings.classOff);
    }

    /**
     * Wraps each character in the specified HTML element.
     * @private
     */
    _buildHTML() {
      let htmlBuilder = '';
      // Iterate over child nodes
      this._el.childNodes.forEach(node => {
        if (node.nodeType === 3) { // Text node
          const txts = node.nodeValue.split('');
          txts.forEach(char => {
            // Wrap each character
            // Use settings.element, ensure it's a valid tag name (handled in _configure)
            const charElement = `<${this._settings.element} class="novacancy ${this._settings.classOn}">${char}</${this._settings.element}>`;
             htmlBuilder += charElement;
          });
        } else if (node.nodeType === 1) { // Element node
          // Keep existing elements as they are
           htmlBuilder += node.outerHTML;
        }
         // Ignore other node types (comments, etc.)
      });
      this._el.innerHTML = htmlBuilder;
    }

    /**
     * Creates the initial array of character indices for blinking and sets initial 'off' states.
     * @returns {number[]} Array of indices for characters that will blink.
     * @private
     */
    _newArray() {
      const len = this._items.length;
      const randomArray = this._randomArray(len);
      let blinkArr;
      let offArr;
      let { off, blink } = this._settings;

      // Determine 'off' items
      off = Math.min(off, len);
      off = Math.max(0, off);
      offArr = randomArray.splice(0, off);

      offArr.forEach(index => {
        if (this._items[index]) { // Check if item exists
             this.off(this._items[index]);
        }
      });

      // Determine 'blink' items from the remaining
      blink = (blink === 0) ? randomArray.length : blink; // 0 means all remaining
      blink = Math.min(blink, randomArray.length);
      blink = Math.max(0, blink);

      blinkArr = randomArray.splice(0, blink);

      return blinkArr;
    }

    /**
     * Generates a shuffled array of numbers from 0 to n-1.
     * @param {number} n - The size of the array.
     * @returns {number[]} Shuffled array of indices.
     * @private
     */
    _randomArray(n) {
        const ary = Array.from({ length: n }, (_, i) => i); // Create [0, 1, ..., n-1]
        // Fisher-Yates (Knuth) Shuffle
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ary[i], ary[j]] = [ary[j], ary[i]]; // Swap
        }
        return ary;
    }


    /**
     * The main loop that triggers random blinks.
     * @private
     */
    _loop() {
      if (!this._powerOn || this._blinkArr.length === 0) return;

      const num = this._blinkArr[this._rand(0, this._blinkArr.length - 1)];
      const item = this._items[num];

      if (item && item.dataset.blinking !== 'true') {
        this._blink(item);
      }

      this._loopTimeout = setTimeout(() => {
        this._loop();
      }, this._rand(this._settings.loopMin, this._settings.loopMax));
    }

    /**
     * Starts the blinking effect loop.
     */
    blinkOn() {
      if (!this._powerOn) {
        this._powerOn = true;
        // Apply potentially new CSS settings if called after initialization
        this._setAppearance();
        // Ensure all blinking items start in the 'on' state before loop begins
        this._blinkArr.forEach(index => {
            if (this._items[index]) {
                this.on(this._items[index]);
                this._items[index].dataset.blinking = 'false'; // Reset blinking state
            }
        });
        // Start the loop
        this._loopTimeout = setTimeout(() => {
          this._loop();
        }, this._rand(this._settings.loopMin, this._settings.loopMax));
      }
    }

    /**
     * Stops the blinking effect loop.
     */
    blinkOff() {
      if (this._powerOn) {
        this._powerOn = false;
        clearTimeout(this._loopTimeout);
         // Optionally turn all characters 'on' when effect stops
         // this._items.forEach(item => this.on(item));
      }
    }

    /**
     * Binds custom event listeners for external control.
     * @private
     */
    _bindEvents() {
      this._el.addEventListener('blinkOn', () => this.blinkOn());
      this._el.addEventListener('blinkOff', () => this.blinkOff());
    }

     /**
      * Public method to update settings after initialization.
      * @param {object} options - New options to apply.
      */
     setOptions(options) {
        this._settings = this._configure(options);
        // Re-apply appearance with new settings
        this._setAppearance();
        // Optionally, reset the blinking array based on new 'off'/'blink' settings
        // This might require stopping and restarting the effect if it's running
        // const wasOn = this._powerOn;
        // if (wasOn) this.blinkOff();
        // this._blinkArr = this._newArray(); // Re-calculate based on new off/blink counts
        // if (wasOn) this.blinkOn();

        // For simplicity, currently just updates CSS. More complex updates might need restart.
     }

      /**
      * Cleans up resources (timers, styles, event listeners).
      */
     destroy() {
         this.blinkOff(); // Stop timers
         // Remove event listeners
         this._el.removeEventListener('blinkOn', this.blinkOn);
         this._el.removeEventListener('blinkOff', this.blinkOff);
         // Remove added style element
         if (this._styleElement && this._styleElement.parentNode) {
             this._styleElement.parentNode.removeChild(this._styleElement);
         }
         // Remove initialization flag
         delete this._el.dataset.novacancyInitialized;
         // TODO: Restore original innerHTML? Current implementation modifies it permanently.
         // this._el.innerHTML = originalHTML; // Need to store original HTML at init
     }
  }

  /**
   * Initializes the Novacancy effect on elements matching the selector.
   * @param {string} selector - CSS selector for target elements.
   * @param {object} options - User-defined options.
   * @returns {Novacancy[]} An array of Novacancy instances created.
   */
  window.initNovacancy = function(selector, options) {
    const elements = document.querySelectorAll(selector);
    const instances = [];
    elements.forEach(el => {
      instances.push(new Novacancy(el, options));
    });
    return instances; // Return instances for potential further interaction
  };

})(); 