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
  CDOT.initUI();
  CDOT.initCloudeoLogging();
  CDOT.initializeCloudeoQuick(CDOT.populateDevices);
};

/**
 * Initializes the UI components, by binding to the change events of the selects
 * provided by the UI.
 */
CDOT.initUI = function () {
  $('#camSelect').change(CDOT.onCamSelected);
  $('#micSelect').change(CDOT.onMicSelected);
  $('#spkSelect').change(CDOT.onSpkSelected);
};

/**
 * Fills the selects with the currently plugged in devices.
 */
CDOT.populateDevices = function () {
  CDOT.populateVideoCaptureDevices();
  CDOT.populateAudioCaptureDevices();
  CDOT.populateAudioOutputDevices();
};

/**
 * Fills the audio output devices select.
 */
CDOT.populateAudioOutputDevices = function () {
//  Step 1. Define the speakers list result handler
  var spkrsResultHandler = function (devs) {
    var $select = $('#spkSelect');
//    1. Clear the select to remove the "Loading..." item
    $select.empty();

//    2. Fill the select with options corresponding to the devices returned by
//       the Cloudeo SDK
    $.each(devs, function (devId, devLabel) {
      $('<option value="' + devId + '">' + devLabel + '</option>').
          appendTo($select);
    });

//    3. Create the result handler that sets the currently used device
    var getDeviceHandler = function (device) {
      $select.val(device);
    };

//    4. Get the currently used speakers
    CDO.getService().getAudioOutputDevice(
        CDO.createResponder(getDeviceHandler));
  };

//  Step 0. Get all the devices
  CDO.getService().getAudioOutputDeviceNames(
      CDO.createResponder(spkrsResultHandler));
};

/**
 * Fills the audio capture devices select.
 */
CDOT.populateAudioCaptureDevices = function () {
  var micsResultHandler = function (devs) {
    var $select = $('#micSelect');
    $select.empty();
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

/**
 * Fills the video capture devices select.
 */
CDOT.populateVideoCaptureDevices = function () {
  var webcamsResultHandler = function (devs) {
    var $select = $('#camSelect');
    $select.empty();
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
 * Handles the change event of the video capture devices select.
 */
CDOT.onCamSelected = function () {
  var selected = $(this).val();
  CDO.getService().setVideoCaptureDevice(CDO.createResponder(), selected);
};

/**
 * Handles the change event of the audio capture devices select.
 */
CDOT.onMicSelected = function () {
  var selected = $(this).val();
  CDO.getService().setAudioCaptureDevice(CDO.createResponder(), selected);
};

/**
 * Handles the change event of the audio output devices select.
 */
CDOT.onSpkSelected = function () {
  var selected = $(this).val();
  CDO.getService().setAudioOutputDevice(CDO.createResponder(), selected);
};


/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
