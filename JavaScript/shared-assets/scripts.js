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
  }, true);
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
        completeHandler();
        break;
      default:
        log.error("Got unsupported init state: " + e.state);
    }
  };
  CDO.initPlatform(initListener);
};


CDOT.initDevicesSelects = function () {
  $('#camSelect').change(CDOT.getDevChangedHandler('VideoCapture'));
  $('#micSelect').change(CDOT.getDevChangedHandler('AudioCapture'));
  $('#spkSelect').change(CDOT.getDevChangedHandler('AudioOutput'));
};

CDOT.getDevChangedHandler = function (devType) {
  return function () {
    var selectedDev = $(this).val();
    CDO.getService()['set' + devType + 'Device'](
        CDO.createResponder(),
        selectedDev);
  };
};

/**
 * Fills the selects with the currently plugged in devices.
 */
CDOT.populateDevicesQuick = function () {
  CDOT.populateDevicesOfType('#camSelect', 'VideoCapture');
  CDOT.populateDevicesOfType('#micSelect', 'AudioCapture');
  CDOT.populateDevicesOfType('#spkSelect', 'AudioOutput');
};

/**
 * Fills the audio output devices select.
 */
CDOT.populateDevicesOfType = function (selectSelector, devType) {
  var devsResultHandler = function (devs) {
    var $select = $(selectSelector);
    $select.empty();
    $.each(devs, function (devId, devLabel) {
      $('<option value="' + devId + '">' + devLabel + '</option>').
          appendTo($select);
    });
    var getDeviceHandler = function (device) {
      $select.val(device);
    };
    CDO.getService()['get' + devType + 'Device'](
        CDO.createResponder(getDeviceHandler));
  };
  CDO.getService()['get' + devType + 'DeviceNames'](
      CDO.createResponder(devsResultHandler));
};
