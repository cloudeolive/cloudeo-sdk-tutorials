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
  CDOT.initDevicesSelects();
  CDOT.initializeCloudeoQuick(CDOT.onPlatformReady);
};


CDOT.initUI = function () {

};


CDOT.onPlatformReady = function () {
  CDOT.populateDevicesOfType('#camSelect', 'VideoCapture');
  CDOT.startLocalVideo();
};

CDOT.startLocalVideo = function () {
  var resultHandler = function (sinkId) {
    log.debug("Local preview started. Rendering the sink with id: " + sinkId);
    CDO.renderSink({
                     sinkId:sinkId,
                     containerId:'renderContainer'
                   });

    CDO.renderSink({
                     sinkId:sinkId,
                     containerId:'renderContainerWindowless',
                     windowless:true
                   });


    CDO.renderSink({
                     sinkId:sinkId,
                     containerId:'renderContainerMirror',
                     mirror:true
                   });

    CDO.renderSink({
                     sinkId:sinkId,
                     containerId:'renderContainerBicubic',
                     filterType:CDO.VideoScalingFilter.BICUBIC
                   });
  };
  CDO.getService().startLocalVideo(CDO.createResponder(resultHandler));
};

CDOT.initializeListener = function () {
  var listener = new CDO.CloudeoServiceListener();

  CDO.getService().addServiceListener(CDO.createResponder(), listener);
};

/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
