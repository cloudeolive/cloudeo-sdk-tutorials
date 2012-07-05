/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 26-06-2012 10:37
 */


CDOT.STREAMER_URL_PFX = '67.228.150.188:704/';

CDOT.SCOPE_ID = 'Tutorial5';

CDOT.CONNECTION_CONFIGURATION = {
  lowVideoStream:{
    publish:true,
    receive:true,
    maxWidth:320,
    maxHeight:240,
    maxBitRate:64,
    maxFps:5
  },
  highVideoStream:{
    publish:true,
    receive:true,
    maxWidth:320,
    maxHeight:240,
    maxBitRate:400,
    maxFps:15
  },
  autopublishVideo:true,
  autopublishAudio:true
};


/**
 * Document ready callback - starts the Cloudeo platform initialization.
 */
CDOT.onDomReady = function () {
  log.debug('DOM loaded');
//  CDOT.initCloudeoLogging();
//  CDOT.initDevicesSelects();
//  CDOT.initializeCloudeoQuick(CDOT.onPlatformReady);
};

CDOT.onPlatformReady = function () {
  CDOT.populateDevicesQuick();
  CDOT.startLocalVideo();
  CDOT.initServiceListener();
};

CDOT.initServiceListener = function () {
  var listener = new CDO.CloudeoServiceListener();


  /**
   * Handles new remote participant joined/left the scope.
   * @param {CDO.UserStateChangedEvent} e
   */
  listener.onUserEvent = function (e) {
    log.debug("Got new user event: " + e.userId);
    if (e.isConnected) {
      CDO.renderSink({
                       sinkId:e.videoSinkId,
                       containerId:'renderRemoteUser'
                     });
      $('#remoteUserIdLbl').html(e.userId);
    } else {
      $('#renderRemoteUser').empty();
      $('#remoteUserIdLbl').html('undefined');
    }

  };

  var onSucc = function () {
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  };
  CDO.getService().addServiceListener(CDO.createResponder(onSucc), listener);

};

CDOT.startLocalVideo = function () {
  var resultHandler = function (sinkId) {
    log.debug("Local preview started. Rendering the sink with id: " + sinkId);
    CDO.renderSink({
                     sinkId:sinkId,
                     containerId:'renderLocalPreview',
                     mirror:true
                   });
  };
  CDO.getService().startLocalVideo(CDO.createResponder(resultHandler));
};

CDOT.connect = function () {
  var connDescriptor = $.extend({}, CDOT.CONNECTION_CONFIGURATION);
  connDescriptor.url = CDOT.STREAMER_URL_PFX + CDOT.SCOPE_ID;
  connDescriptor.token = CDOT.genRandomUserId() + '';
  var onSucc = function () {
    log.debug("Connected. Disabling connect button and enabling the disconnect");
    $('#connectBtn').unbind('click').addClass('disabled');
    $('#disconnectBtn').click(CDOT.disconnect).removeClass('disabled');
    $('#localUserIdLbl').html(connDescriptor.token);
  };
  CDO.getService().connect(CDO.createResponder(onSucc), connDescriptor);
};

CDOT.disconnect = function () {
  var onSucc = function () {
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
    $('#disconnectBtn').unbind('click').addClass('disabled');
    $('#renderRemoteUser').empty();
    $('#remoteUserIdLbl').html('undefined');
    $('#localUserIdLbl').html('undefined');
  };
  CDO.getService().disconnect(CDO.createResponder(onSucc), CDOT.SCOPE_ID);
};


/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
