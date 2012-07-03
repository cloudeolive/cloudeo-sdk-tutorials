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
  CDOT.initCloudeoLogging();
  CDOT.initializeCloudeoQuick(CDOT.populateDevices);
};

CDOT.populateDevices = function () {
  CDOT.populateVideoCaptureDevices();
  CDOT.populateAudioCaptureDevices();
  CDOT.populateAudioOutputDevices();
};

CDOT.populateAudioOutputDevices = function () {
  var spkrsResultHandler = function (devs) {
    var $select = $('#spkSelect');
    $.each(devs, function (devId, devLabel) {
      $('<option value="' + devId + '">' + devLabel + '</option>').
          appendTo($select);
    });
    var getDeviceHandler = function (device) {
      $select.val(device);
    };
    CDO.getService().getAudioOutputDevice(
        CDO.createResponder(getDeviceHandler));
  };
  CDO.getService().getAudioOutputDeviceNames(
      CDO.createResponder(spkrsResultHandler));
};

CDOT.populateAudioCaptureDevices = function () {
  var micsResultHandler = function (devs) {
    var $select = $('#micSelect');
    $.each(devs, function (devId, devLabel) {
      $('<option value="' + devId + '">' + devLabel + '</option>').
          appendTo($select);
    });
    var getDeviceHandler = function (device) {
      $select.val(device);
    };
    CDO.getService().getAudioCaptureDevice(
        CDO.createResponder(getDeviceHandler));
  };
  CDO.getService().getAudioCaptureDeviceNames(
      CDO.createResponder(micsResultHandler));
};

CDOT.populateVideoCaptureDevices = function () {
  var webcamsResultHandler = function (devs) {
    var $select = $('#camSelect');
    $.each(devs, function (devId, devLabel) {
      $('<option value="' + devId + '">' + devLabel + '</option>').
          appendTo($select);
    });
    var getDeviceHandler = function (device) {
      $select.val(device);
    };
    CDO.getService().getVideoCaptureDevice(
        CDO.createResponder(getDeviceHandler));
  };
  CDO.getService().getVideoCaptureDeviceNames(
      CDO.createResponder(webcamsResultHandler));
};

/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
