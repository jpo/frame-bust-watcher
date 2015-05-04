/**
 * @module FrameBustWatcher
 *
 * @summary Prevents framed pages from busting out of their frames.
 *
 * @example
 * FrameBustWatcher.start('http://server-which-responds-with-204.com');
 * FrameBustWatcher.stop();
 *
 * More Info:
 * @see { @link http://coderrr.wordpress.com/2009/02/13/preventing-frame-busting-and-click-jacking-ui-redressing/ }
 * @see { @link http://blog.codinghorror.com/we-done-been-framed/ }
 */
window.FrameBustWatcher = (function (window) {
  'use strict';

  var self = {
    attempts: 0,
    watcher: null
  };

  /**
   * @method start
   * @summary Summary Start the service.
   * @param {string} noop - A URL that responds with HTTP Status Code 204.
   *
   * The Start method creates a watcher that checks whether a child frame is
   * trying bust out of parent frame. If the watcher detects a frame-busting
   * attempt, it will set the parent frame's location to the No-op URL (a URL
   * that responds with 204) provided by the noop argument. When the browser
   * tries to navigate to the No-op URL, nothing will happen and the child
   * page will remain framed.
   */
  self.start = function (noop) {
    var counter = function () { self.attempts += 1; };

    self.attempts = 0;
    window.onbeforeunload = counter;

    self.watcher = setInterval(function () {
      if (window.onbeforeunload != counter) {
        self.attempts += 1;
        window.onbeforeunload = counter;
      }

      if (self.attempts > 0) {
        self.attempts -= 2;
        window.top.location = noop;
      }
    }, 1);
  };

  /**
   * @method stop
   * @summary Stop the service.
   *
   * The Stop method destroys the watcher created by the Start method and
   * allows navigating away from the page.
   */
  self.stop = function () {
    self.attempts = -1;
    window.onbeforeunload = null;
    clearInterval(self.watcher);
  };

  return self;
}(window));
