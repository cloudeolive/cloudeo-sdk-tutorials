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
  $('#playTestSoundBtn').click(CDOT.onPlayTestSoundBtnClicked);
};


CDOT.onPlatformReady = function () {
  CDOT.populateDevicesQuick();
  CDOT.populateVolume();
  $('#playTestSoundBtn').
      click(CDOT.onPlayTestSoundBtnClicked).
      removeClass('disabled');
};

CDOT.populateVolume = function () {
  var resultHandler = function (volume) {
    $('#volumeCtrlSlider').slider('value', volume);
  };
  CDO.getService().getSpeakersVolume(CDO.createResponder(resultHandler));
};

CDOT.onVolumeSlide = function (e, ui) {
  CDO.getService().setSpeakersVolume(CDO.createResponder(), ui.value);
};

CDOT.onPlayTestSoundBtnClicked = function () {
  CDO.getService().startPlayingTestSound(CDO.createResponder());
};

/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
