/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 26-06-2012 10:37
 */


/**
 * Id of media scope to connect to upon user's request.
 * @type {String}
 */
CDOT.SCOPE_ID = 'Tutorial5';

/**
 * Configuration of the streams to publish upon connection established
 * @type {Object}
 */
CDOT.CONNECTION_CONFIGURATION = {

  /**
   * Description of the base line video stream - the low layer. It's QVGA, with
   * bitrate equal to 64kbps and 5 frames per second
   */
  lowVideoStream:{
    publish:true,
    receive:true,
    maxWidth:320,
    maxHeight:240,
    maxBitRate:64,
    maxFps:5
  },

  /**
   * Description of the adaptive video stream - the high layer. It's QVGA, with
   * 400kbps of bitrate and 15 frames per second
   */
  highVideoStream:{
    publish:true,
    receive:true,
    maxWidth:320,
    maxHeight:240,
    maxBitRate:400,
    maxFps:15
  },

  /**
   * Flags defining that both streams should be automatically published upon
   * connection.
   */
  autopublishVideo:true,
  autopublishAudio:true
};


/**
 * Document ready callback - starts the Cloudeo platform initialization.
 */
CDOT.onDomReady = function () {
  log.debug('DOM loaded');
  CDOT.initCloudeoLogging();
  CDOT.initDevicesSelects();
  CDOT.initializeCloudeoQuick(CDOT.onPlatformReady);
};

CDOT.onPlatformReady = function () {
  log.debug("Cloudeo Platform ready.");
  CDOT.populateDevicesQuick();
  CDOT.startLocalVideo();
  CDOT.initServiceListener();
};

CDOT.startLocalVideo = function () {
  log.debug("Starting local preview video feed");
//  1. Prepare the result handler
  var resultHandler = function (sinkId) {
    log.debug("Local preview started. Rendering the sink with id: " + sinkId);
    CDO.renderSink({
                     sinkId:sinkId,
                     containerId:'renderLocalPreview',
                     mirror:true
                   });
  };

//  2. Request the platform to start local video.
  CDO.getService().startLocalVideo(CDO.createResponder(resultHandler));
};

CDOT.initServiceListener = function () {
  log.debug("Initializing the Cloudeo Service Listener");

//  1. Instantiate the listener
  var listener = new CDO.CloudeoServiceListener();

//  2. Define the handler for user event
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

//  3. Define result handler that will enable the connect button
  var onSucc = function () {
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  };

//  4. Register the listener using created instance and prepared result handler.
  CDO.getService().addServiceListener(CDO.createResponder(onSucc), listener);

};

CDOT.connect = function () {
  log.debug("Establishing a connection to the Cloudeo Streaming Server");

//  1. Disable the connect button to avoid connects cascade
  $('#connectBtn').unbind('click').addClass('disabled');

//  2. Prepare the connection descriptor by cloning the configuration and
//     updating the URL and the token.
  var connDescriptor = $.extend({}, CDOT.CONNECTION_CONFIGURATION);
  connDescriptor.scopeId = CDOT.SCOPE_ID;
  connDescriptor.token = CDOT.genRandomUserId() ;

//  3. Define the result handler
  var onSucc = function () {
    log.debug("Connected. Disabling connect button and enabling the disconnect");
    $('#disconnectBtn').click(CDOT.disconnect).removeClass('disabled');
    $('#localUserIdLbl').html(connDescriptor.token);
  };

//  4. Define the error handler
  var onErr = function (errCode, errMessage) {
    log.error("Failed to establish the connection due to: " + errMessage +
                  '(err code: ' + errCode + ')');
//    Enable the connect button again
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
  };

//  5. Request the SDK to establish the connection
  CDO.getService().connect(CDO.createResponder(onSucc, onErr), connDescriptor);
};

CDOT.disconnect = function () {
  log.debug("Terminating the connection");

//  1. Define the result handler
  var onSucc = function () {
    log.debug("Connection terminated");
    $('#connectBtn').click(CDOT.connect).removeClass('disabled');
    $('#disconnectBtn').unbind('click').addClass('disabled');
    $('#renderRemoteUser').empty();
    $('#remoteUserIdLbl').html('undefined');
    $('#localUserIdLbl').html('undefined');
  };

//  2. Request the SDK to terminate the connection.
  CDO.getService().disconnect(CDO.createResponder(onSucc), CDOT.SCOPE_ID);
};


/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
