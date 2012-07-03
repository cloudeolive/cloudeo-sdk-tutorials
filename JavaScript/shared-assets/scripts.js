/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 26-06-2012 13:23
 */

/**
 * @namespace Namespace for all Cloudeo tutorials definitions.
 */
var CDOT = CDOT || {};

// Initialize the logging.
CDOT.log = log4javascript.getLogger();
window.log = CDOT.log;
CDOT.inPageAppender = new log4javascript.InPageAppender("logsContainer");
CDOT.inPageAppender.setHeight("500px");
CDOT.log.addAppender(CDOT.inPageAppender);

/**
 * @const
 * @type {String}
 */
CDOT.PLUGIN_CONTAINER_ID = 'pluginContainer';


CDOT.initCloudeoLogging = function () {
  CDO.initLogging(function (lev, msg) {
    switch (lev) {
      case CDO.LogLevel.DEBUG:
        CDOT.log.debug("[CDO] " + msg);
        break;
      case CDO.LogLevel.WARN:
        CDOT.log.warn("[CDO] " + msg);
        break;
      case CDO.LogLevel.ERROR:
        CDOT.log.error("[CDO] " + msg);
        break;
      default:
        CDOT.log.error("Got unsupported log level: " + lev + ". Message: " +
                           msg);
    }
  }, false);
};

/**
 * Initializes the Cloudeo SDK.
 */
CDOT.initializeCloudeoQuick = function (completeHandler) {
  log.debug("Initializing the Cloudeo SDK");
  var initListener = new CDO.PlatformInitListener();
  initListener.onInitStateChanged = function (e) {
    switch (e.state) {
      case CDO.InitState.ERROR:
        log.error("Failed to initialize the Cloudeo SDK");
        log.error("Reason: " + e.errMessage + ' (' + e.errCode + ')');
        break;
      case CDO.InitState.INITIALIZED:
        var getVersionResult = function (version) {
          log.debug("Cloudeo service version: " + version);
          $('#sdkVersion').html(version);
        };
        var responder = CDO.createResponder(getVersionResult);
        CDO.getService().getVersion(responder);
        break;
      default:
        log.error("Got unsupported init state: " + e.state);
    }
  };
  CDO.initPlatform(initListener);
};

