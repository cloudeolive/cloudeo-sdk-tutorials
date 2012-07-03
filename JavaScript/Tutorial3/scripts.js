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
  CDOT.initDevicesSelects();
  CDOT.initUI();
  CDOT.initCloudeoLogging();
  CDOT.initializeCloudeoQuick(CDOT.onPlatformReady);
};


CDOT.initUI = function () {
  $('#volumeCtrlSlider').slider({
                                  min:0,
                                  max:255,
                                  animate:true,
                                  value:127,
                                  slide:CDOT.onVolumeSlide
                                });
  $('#micGainCtrlSlider').slider({
                                   min:0,
                                   max:255,
                                   animate:true,
                                   value:127,
                                   slide:CDOT.onMicGainSlide
                                 });
  $('#micActivityBar').progressbar({value:50});
  $('#playTestSoundBtn').click(CDOT.onPlayTestSoundBtnClicked);
  $('#micActivityEnabledChckbx').change(CDOT.onMicActivityEnabledChckbxChange);
};


CDOT.onPlatformReady = function () {
  CDOT.initializeListener();
  CDOT.populateDevicesQuick();
  CDOT.populateVolume();
  CDOT.populateMicGain();
  $('#playTestSoundBtn').
      click(CDOT.onPlayTestSoundBtnClicked).
      removeClass('disabled');
};

CDOT.initializeListener = function () {
  var listener = new CDO.CloudeoServiceListener();
  listener.onDeviceListChanged = function (e) {
    log.debug("Got devices list changed");
    if(e.audioInChanged) {
      log.debug("Got new microphone plugged in");
      CDOT.populateDevicesOfType('#micSelect', 'AudioCapture');
    }
    if(e.audioOutChanged) {
      log.debug("Got new speakers plugged in");
      CDOT.populateDevicesOfType('#spkSelect', 'AudioOutput');
    }
    if(e.videoInChanged) {
      log.debug("Got new camera plugged in");
      CDOT.populateDevicesOfType('#camSelect', 'VideoCapture');
    }
  };

  listener.onMicActivity = function (e) {
    log.debug("Got mic activity: " + e.activity);
    $('#micActivityBar').progressbar('value', e.activity / 255 * 100);
  };
  CDO.getService().addServiceListener(CDO.createResponder(), listener);
};

CDOT.populateVolume = function () {
  var resultHandler = function (volume) {
    $('#volumeCtrlSlider').slider('value', volume);
  };
  CDO.getService().getSpeakersVolume(CDO.createResponder(resultHandler));
};

CDOT.populateMicGain = function () {
  var resultHandler = function (volume) {
    $('#micGainCtrlSlider').slider('value', volume);
  };
  CDO.getService().getMicrophoneVolume(CDO.createResponder(resultHandler));
};

CDOT.onVolumeSlide = function (e, ui) {
  CDO.getService().setSpeakersVolume(CDO.createResponder(), ui.value);
};

CDOT.onMicGainSlide = function (e, ui) {
  CDO.getService().setMicrophoneVolume(CDO.createResponder(), ui.value);
};

CDOT.onPlayTestSoundBtnClicked = function () {
  CDO.getService().startPlayingTestSound(CDO.createResponder());
};

CDOT.onMicActivityEnabledChckbxChange = function () {
  var enabled = $(this).is(':checked');
  CDO.getService().monitorMicActivity(CDO.createResponder(), enabled);
};

/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
