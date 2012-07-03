/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 26-06-2012 10:37
 */


/**
 * Document ready callback - starts the Cloudeo platform initialization.
 */
CDOT.onDomReady = function () {
  log.debug('DOM loaded');
  $("#initProgressBar").
      progressbar({
                    value:0
                  });
  CDOT.initCloudeoLogging();
  CDOT.initializeCloudeoQuick(CDOT.populateDevices);
};

CDOT.populateDevices = function() {

};

/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
