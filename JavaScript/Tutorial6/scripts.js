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
  }
};


/**
 * Document ready callback - starts the Cloudeo platform initialization.
 */
CDOT.onDomReady = function () {
  log.debug('DOM loaded');
  CDOT.initCloudeoLogging();
  CDOT.initDevicesSelects();
  CDOT.initUI();
  CDOT.initializeCloudeoQuick(CDOT.onPlatformReady);
};

CDOT.initUI = function () {
  $('#publishAudioChckbx').change(CDOT.onPublishAudioChanged);
  $('#publishVideoChckbx').change(CDOT.onPublishVideoChanged);
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
      var renderer = $('#rendererTmpl').clone();
      renderer.attr('id', 'rendererOuter' + e.userId);
      renderer.find('.render-wrapper').attr('id', 'renderer' + e.userId);
      renderer.find('.user-id-wrapper').html(e.userId);
      $('#renderingWrapper').append(renderer);
      if (e.videoPublished) {
        CDO.renderSink({
                         sinkId:e.videoSinkId,
                         containerId:'renderer' + e.userId
                       });
      } else {
        renderer.find('.no-video-text').show();
      }

      if (!e.audioPublished) {
        renderer.find('.muted-indicator').show();
      }

    } else {
      $('#rendererOuter' + e.userId).html('').remove();
    }

  };

  /**
   *
   * @param {CDO.UserStateChangedEvent} e
   */
  listener.onMediaStreamEvent = function (e) {

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
  CDOT.scopeId = $('#scopeIdTxtField').val();
  connDescriptor.url = CDOT.STREAMER_URL_PFX + CDOT.scopeId;
  connDescriptor.token = CDOT.genRandomUserId() + '';
  connDescriptor.autopublishAudio = $('#publishAudioChckbx').is(':checked');
  connDescriptor.autopublishVideo = $('#publishVideoChckbx').is(':checked');
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
    $('#connTypeLbl').html('none');
    $('#renderingWrapper .remote-renderer').remove();
    CDOT.scopeId = undefined;
  };
  CDO.getService().disconnect(CDO.createResponder(onSucc), CDOT.scopeId);
};


CDOT.onPublishAudioChanged = function () {
  if (CDOT.scopeId) {
    if ($(this).is(':checked')) {
      CDO.getService().publish(CDO.createResponder(), CDOT.scopeId,
                               CDO.MediaType.AUDIO);
    } else {
      CDO.getService().unpublish(CDO.createResponder(), CDOT.scopeId,
                               CDO.MediaType.AUDIO);
    }
  }
};
CDOT.onPublishVideoChanged = function () {
  if (CDOT.scopeId) {
    if ($(this).is(':checked')) {
      CDO.getService().publish(CDO.createResponder(), CDOT.scopeId,
                               CDO.MediaType.VIDEO);
    } else {
      CDO.getService().unpublish(CDO.createResponder(), CDOT.scopeId,
                               CDO.MediaType.VIDEO);
    }
  }
};

/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
