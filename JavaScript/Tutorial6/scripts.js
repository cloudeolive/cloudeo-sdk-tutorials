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
    switch (e.mediaType) {
      case CDO.MediaType.AUDIO:
        var muteIndicator = $('#rendererOuter' + e.userId).
            find('.muted-indicator');
        if (e.audioPublished) {
          muteIndicator.hide();
        } else {
          muteIndicator.show();
        }
        break;
      case CDO.MediaType.VIDEO:
        var rendererOuter = $('#rendererOuter' + e.userId);
        if (e.videoPublished) {
          CDO.renderSink({
                           sinkId:e.videoSinkId,
                           containerId:'renderer' + e.userId
                         });
          rendererOuter.find('.no-video-text').hide();
        } else {
          rendererOuter.find('.render-wrapper').empty();
          rendererOuter.find('.no-video-text').show();
        }
        break;
      default :
        log.warn('Got unsupported media type in media stream event: ' +
                     e.mediaType);
    }
  };

  listener.mediaConnType2Label = {};
  listener.mediaConnType2Label[CDO.ConnectionType.NOT_CONNECTED] =
      'not connected';
  listener.mediaConnType2Label[CDO.ConnectionType.TCP_RELAY] =
      'RTP/TCP relayed';
  listener.mediaConnType2Label[CDO.ConnectionType.UDP_RELAY] =
      'RTP/UDP relayed';
  listener.mediaConnType2Label[CDO.ConnectionType.UDP_P2P] =
      'RTP/UDP in P2P';


  /**
   *
   * @param {CDO.MediaConnTypeChangedEvent} e
   */
  listener.onMediaConnTypeChanged = function (e) {
    $('#connTypeLbl').html(listener.mediaConnType2Label[e.connectionType]);
  };

  /**
   *
   * @param {CDO.ConnectionLostEvent} e
   */
  listener.onConnectionLost = function (e) {
    log.error('Got connection lost notification');
    if (e.errCode == CDO.ErrorCodes.Communication.COMM_REMOTE_END_DIED) {
      log.warn('Connection terminated due to internet connection issues. ' +
                   'Trying to reconnect in N secs');
      CDOT.disconnectHandler();
      CDOT.tryReconnect();
    }
  };

  var onSucc = function () {
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  };
  CDO.getService().addServiceListener(CDO.createResponder(onSucc), listener);

};


CDOT.tryReconnect = function () {
  setTimeout(function () {
    log.debug("Retrying connection");
    var succHandler = function () {
      CDOT.postConnectHandler(CDOT.currentConnDescriptor);
    };
    var errHandler = function () {
      CDOT.tryReconnect();
    };
    CDO.getService().connect(CDO.createResponder(succHandler, errHandler),
    CDOT.currentConnDescriptor);
  }, 5000);
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
    CDOT.postConnectHandler(connDescriptor);
  };
  CDO.getService().connect(CDO.createResponder(onSucc), connDescriptor);
};

CDOT.disconnect = function () {
  function succHandler() {
    CDOT.scopeId = undefined;
    CDOT.currentConnDescriptor = undefined;
    CDOT.disconnectHandler();
  }

  CDO.getService().disconnect(CDO.createResponder(succHandler),
                              CDOT.scopeId);
};

CDOT.disconnectHandler = function () {
  $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  $('#disconnectBtn').unbind('click').addClass('disabled');
  $('#renderRemoteUser').empty();
  $('#remoteUserIdLbl').html('undefined');
  $('#localUserIdLbl').html('undefined');
  $('#connTypeLbl').html('none');
  $('#renderingWrapper .remote-renderer').remove();
};

CDOT.postConnectHandler = function (connDescriptor) {
  log.debug("Connected. Disabling connect button and enabling the disconnect");
  $('#connectBtn').unbind('click').addClass('disabled');
  $('#disconnectBtn').click(CDOT.disconnect).removeClass('disabled');
  $('#localUserIdLbl').html(connDescriptor.token);
  CDOT.currentConnDescriptor = connDescriptor;

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
