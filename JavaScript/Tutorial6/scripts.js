/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 26-06-2012 10:37
 */

/**
 * Streams quality configuration
 * @type {Object}
 */
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

CDOT.mediaConnType2Label = {};
CDOT.mediaConnType2Label[CDO.ConnectionType.NOT_CONNECTED] =
    'not connected';
CDOT.mediaConnType2Label[CDO.ConnectionType.TCP_RELAY] =
    'RTP/TCP relayed';
CDOT.mediaConnType2Label[CDO.ConnectionType.UDP_RELAY] =
    'RTP/UDP relayed';
CDOT.mediaConnType2Label[CDO.ConnectionType.UDP_P2P] =
    'RTP/UDP in P2P';


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
  log.debug("Initializing the UI");
  $('#publishAudioChckbx').change(CDOT.onPublishAudioChanged);
  $('#publishVideoChckbx').change(CDOT.onPublishVideoChanged);
  log.debug("UI initialized");
};

CDOT.onPlatformReady = function () {
  log.debug("Cloudeo SDK ready");
  CDOT.populateDevicesQuick();
  CDOT.startLocalVideo();
  CDOT.initServiceListener();
};

/**
 * ==========================================================================
 * Beginning of the Cloudeo service events handling code
 * ==========================================================================
 */


CDOT.initServiceListener = function () {
  log.debug("Initializing the Cloudeo Service Listener");

//  1. Instantiate the listener
  var listener = new CDO.CloudeoServiceListener();


//  2. Define the handler for the user event
  listener.onUserEvent = function (e) {
    log.debug("Got new user event: " + e.userId);
    if (e.isConnected) {
      CDOT.onUserJoined(e);
    } else {
      log.debug("User with id: " + e.userId + ' left the media scope');
      $('#renderingWidget' + e.userId).html('').remove();
    }
  };

//  3. Define the handler for streaming status changed event
  listener.onMediaStreamEvent = function (e) {
    log.debug("Got new media streaming status changed event");
    switch (e.mediaType) {
      case CDO.MediaType.AUDIO:
        CDOT.onRemoteAudioStreamStatusChanged(e);
        break;
      case CDO.MediaType.VIDEO:
        CDOT.onRemoteVideoStreamStatusChanged(e);
        break;
      default :
        log.warn('Got unsupported media type in media stream event: ' +
                     e.mediaType);
    }
  };

//  4. Define the handler for the media connection type changed event
  listener.onMediaConnTypeChanged = function (e) {
    log.debug("Got new media connection type: " + e.connectionType);
    $('#connTypeLbl').html(CDOT.mediaConnType2Label[e.connectionType]);
  };

//  5. Define the handler for the connection lost event
  listener.onConnectionLost = function (e) {
    log.warn('Got connection lost notification');
    CDOT.disconnectHandler();
    if (e.errCode == CDO.ErrorCodes.Communication.COMM_REMOTE_END_DIED) {
      log.warn('Connection terminated due to internet connection issues. ' +
                   'Trying to reconnect in 5 seconds');
      CDOT.tryReconnect();
    }
  };

//  6. Prepare the success handler
  var onSucc = function () {
    log.debug("Cloudeo service listener registered");
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  };

//  7. Finally register the Cloudeo Service Listener
  CDO.getService().addServiceListener(CDO.createResponder(onSucc), listener);

};

CDOT.onUserJoined = function (e) {
  log.debug("Got new user with id: " + e.userId);

//  1. Prepare a rendering widget for the user.
  var renderer = $('#rendererTmpl').clone();
  renderer.attr('id', 'renderingWidget' + e.userId);
  renderer.find('.render-wrapper').attr('id', 'renderer' + e.userId);
  renderer.find('.user-id-wrapper').html(e.userId);

//  2. Append it to the rendering area.
  $('#renderingWrapper').append(renderer);
  if (e.videoPublished) {
//    3a. Render the sink if the video stream is being published.
    CDO.renderSink({
                     sinkId:e.videoSinkId,
                     containerId:'renderer' + e.userId
                   });
  } else {
//    3b. Just show the no video stream published indicator.
    renderer.find('.no-video-text').show();
  }

//  4. Show the "audio muted" indicator if user does not publish audio stream
  if (!e.audioPublished) {
    renderer.find('.muted-indicator').show();
  }

};

CDOT.onRemoteVideoStreamStatusChanged = function (e) {
  log.debug("Got change in video streaming for user with id: " + e.userId +
                ' user just ' +
                (e.videoPublished ? 'published' : 'stopped publishing') +
                ' the stream');
//  1. Grab the rendering widget corresponding to the user
  var renderingWidget = $('#renderingWidget' + e.userId);

  if (e.videoPublished) {
//    2a. If video was just published - render it and hide the
//        "No video from user" indicator
    CDO.renderSink({
                     sinkId:e.videoSinkId,
                     containerId:'renderer' + e.userId
                   });
    renderingWidget.find('.no-video-text').hide();
  } else {
//    2b. If video was just unpublished - clear the renderer and show the
//        "No video from user" indicator
    renderingWidget.find('.render-wrapper').empty();
    renderingWidget.find('.no-video-text').show();
  }
};

CDOT.onRemoteAudioStreamStatusChanged = function (e) {
  log.debug("Got change in audio streaming for user with id: " + e.userId +
                ' user just ' +
                (e.audioPublished ? 'published' : 'stopped publishing') +
                ' the stream');

//  1. Find the "Audio is muted" indicator corresponding to the user
  var muteIndicator = $('#renderingWidget' + e.userId).
      find('.muted-indicator');
  if (e.audioPublished) {
//    2a. Hide it if audio stream was just published
    muteIndicator.hide();
  } else {
//    2.b Show it if audio was just unpublished
    muteIndicator.show();
  }
};

/**
 * Tries to reestablish the connection to the Cloudeo Streaming Server in case
 * of network-driven loss.
 *
 * It will retry the connect every 5 seconds.
 */
CDOT.tryReconnect = function () {

//  Register the reconnect handler to be triggered after 5 seconds
  setTimeout(function () {
    log.debug("Trying to reestablish the connection to the Cloudeo Streaming " +
                  "Server");

//    1. Define the result handler
    var succHandler = function () {
      log.debug("Connection successfully reestablished!");
      CDOT.postConnectHandler(CDOT.currentConnDescriptor);
    };

//    2. Define the failure handler
    var errHandler = function () {
      log.warn("Failed to reconnect. Will try again in 5 secs");
      CDOT.tryReconnect();
    };
//    3. Try to connect
    var connDescriptor = CDOT.genConnectionDescriptor();
    CDO.getService().connect(CDO.createResponder(succHandler, errHandler),
                             connDescriptor);
  }, 5000);

};

/**
 * ==========================================================================
 * End of the Cloudeo service events handling code
 * ==========================================================================
 */


CDOT.startLocalVideo = function () {
  log.debug("Starting local preview of current user");
//  1. Define the result handler
  var resultHandler = function (sinkId) {
    log.debug("Local preview started. Rendering the sink with id: " + sinkId);
    CDO.renderSink({
                     sinkId:sinkId,
                     containerId:'renderLocalPreview',
                     mirror:true
                   });
  };

//  2. Request the SDK to start capturing local user's preview
  CDO.getService().startLocalVideo(CDO.createResponder(resultHandler));
};

/**
 * ==========================================================================
 * Beginning of the connection management code
 * ==========================================================================
 */

CDOT.connect = function () {
  log.debug("Establishing a connection to the Cloudeo Streaming Server");

//  1. Disable the connect button to avoid a cascade of connect requests
  $('#connectBtn').unbind('click').addClass('disabled');

//  2. Get the scope id and generate the user id.
  CDOT.scopeId = $('#scopeIdTxtField').val();
  CDOT.userId = CDOT.genRandomUserId();

//  3. Define the result handler - delegates the processing to the
//     postConnectHandler
  var connDescriptor = CDOT.genConnectionDescriptor();
  var onSucc = function () {
    CDOT.postConnectHandler();
  };

//  4. Define the error handler - enabled the connect button again
  var onErr = function () {
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  };

//  5. Request the SDK to establish a connection
  CDO.getService().connect(CDO.createResponder(onSucc, onErr), connDescriptor);
};

CDOT.disconnect = function () {
  log.debug("Terminating a connection to the Cloudeo Streaming Server");

//  1. Define the result handler
  function succHandler() {
    CDOT.scopeId = undefined;
    CDOT.userId = undefined;
    CDOT.disconnectHandler();
  }

//  2. Request the SDK to terminate the connection
  CDO.getService().disconnect(CDO.createResponder(succHandler),
                              CDOT.scopeId);
};

/**
 * Common post disconnect handler - used when user explicitly terminates the
 * connection or if the connection gets terminated due to the networking issues.
 *
 * It just resets the UI to the default state.
 */
CDOT.disconnectHandler = function () {

//  1. Toggle the active state of the Connect/Disconnect buttons
  $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  $('#disconnectBtn').unbind('click').addClass('disabled');

//  2. Reset the connection type label
  $('#connTypeLbl').html('none');

//  3. Clear the remote user renderers
  $('#renderingWrapper .remote-renderer').html('').remove();

//  4. Clear the local user id label
  $('#localUserIdLbl').html('undefined');
};

/**
 * Common post connect handler - used when user manually establishes the
 * connection or connection is being reestablished after being lost due to the
 * Internet connectivity issues.
 * @param connDescriptor
 */
CDOT.postConnectHandler = function () {
  log.debug("Connected. Disabling connect button and enabling the disconnect");

//  1. Enable the disconnect button
  $('#disconnectBtn').click(CDOT.disconnect).removeClass('disabled');

//  2. Update the local user id label
  $('#localUserIdLbl').html(connDescriptor.token);

};

CDOT.genConnectionDescriptor = function () {
//  Clone the video streaming configuration and create a connection descriptor
//  using settings provided by the user
  var connDescriptor = $.extend({}, CDOT.CONNECTION_CONFIGURATION);
  connDescriptor.scopeId = CDOT.scopeId;
  connDescriptor.token = CDOT.userId + '';
  connDescriptor.autopublishAudio = $('#publishAudioChckbx').is(':checked');
  connDescriptor.autopublishVideo = $('#publishVideoChckbx').is(':checked');
  return connDescriptor;
};

/**
 * ==========================================================================
 * End of the connection management code
 * ==========================================================================
 */

/**
 * ==========================================================================
 * Beginning of the user's events handling code
 * ==========================================================================
 */

/**
 * Handles the change of the "Publish Audio" checkbox
 */
CDOT.onPublishAudioChanged = function () {
  if (!CDOT.scopeId) {
//    If the scope id is not defined, it means that we're not connected and thus
//    there is nothing to do here.
    return;
  }

//  Since we're connected we need to either start or stop publishing the audio
// stream, depending on the new state of the checkbox
  if ($(this).is(':checked')) {
    CDO.getService().publish(CDO.createResponder(), CDOT.scopeId,
                             CDO.MediaType.AUDIO);
  } else {
    CDO.getService().unpublish(CDO.createResponder(), CDOT.scopeId,
                               CDO.MediaType.AUDIO);
  }

};
CDOT.onPublishVideoChanged = function () {
  if (!CDOT.scopeId) {

//    If the scope id is not defined, it means that we're not connected and thus
//    there is nothing to do here.
    return;
  }

//  Since we're connected we need to either start or stop publishing the audio
// stream, depending on the new state of the checkbox
  if ($(this).is(':checked')) {
    CDO.getService().publish(CDO.createResponder(), CDOT.scopeId,
                             CDO.MediaType.VIDEO);
  } else {
    CDO.getService().unpublish(CDO.createResponder(), CDOT.scopeId,
                               CDO.MediaType.VIDEO);
  }

};

/**
 * ==========================================================================
 * End of the user's events handling code
 * ==========================================================================
 */


/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
