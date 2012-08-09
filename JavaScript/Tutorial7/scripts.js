/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 26-06-2012 10:37
 */

(function($){

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
  autopublishVideo:false,
  autopublishAudio:false,
  scopeId:'Tutorial7'
};


/**
 * Document ready callback - starts the Cloudeo platform initialization.
 */
CDOT.onDomReady = function () {
  log.debug('DOM loaded');
  CDOT.initCloudeoLogging();
//  Additional options for quick initialization - do not initialize the devices
//  and do not update the plug-in
  CDOT.initializeCloudeoQuick(CDOT.onPlatformReady,
                              {initDevices:false,
                                skipUpdate:true
                              });
};

CDOT.onPlatformReady = function () {
  log.debug("Cloudeo Platform ready.");
  var cdoListener = new CDO.CloudeoServiceListener();
  cdoListener.onUserEvent = function (e) {
    if (e.isConnected) {
      $('<option id="user' + e.userId + 'Opt" value="' + e.userId + '">User ' +
            e.userId + '</option>').appendTo($('#targetSelect'));
      CDOT.appendMessage(e.userId, 'User with id ' + e.userId + ' just joined '
          + 'the chat');
    } else {
      $('#user' + e.userId + 'Opt').remove();
      CDOT.appendMessage(e.userId, 'User with id ' + e.userId + ' just left ' +
          'the chat');
    }
  };

  /**
   *
   * @param {CDO.MessageEvent} e
   */
  cdoListener.onMessage = function (e) {
    log.debug("Got new message from " + e.srcUserId);
    var msg = JSON.parse(e.data);
    CDOT.appendMessage(e.srcUserId, msg.text, msg.direct);
  };
  CDO.getService().addServiceListener(CDO.createResponder(CDOT.onListenerAdded),
                                      cdoListener);
};

CDOT.onListenerAdded = function () {
  var connDescr = $.extend({}, CDOT.CONNECTION_CONFIGURATION);
  CDOT._ownUserId = CDOT.genRandomUserId();
  connDescr.token = CDOT._ownUserId;
  CDO.getService().connect(CDO.createResponder(CDOT.onConnected), connDescr);
};

CDOT.onConnected = function (connection) {
  $('#sendbtn').removeClass('disabled').click(CDOT.sendMsg);
  var welcomeMessage = "You've just joined the text chat. You're personal id: "
      + CDOT._ownUserId;
  CDOT.appendMessage(CDOT._ownUserId, welcomeMessage);
  $('#sendBtn').removeClass('disabled').click(CDOT.sendMsg);
  /**
   *
   * @type {CDO.MediaConnection}
   * @private
   */
  CDOT._chatConnection = connection;
};

CDOT.sendMsg = function () {
  var $msgInput = $('#msgInput');
  var msgContent = $msgInput.val();
  $msgInput.val('');
  var msgRecipient = $('#targetSelect').val();
  log.debug("Sending new message to: " + msgRecipient);
  if(msgRecipient === 'all') {
    msgRecipient = undefined;
  }
  var msg = JSON.stringify({
    text:msgContent,
    direct:!!msgRecipient
  });
  CDOT._chatConnection.sendMessage(CDO.createResponder(), msg, msgRecipient);

};

CDOT.appendMessage = function (sender, content, direct) {
  var msgClone = $('#msgTmpl').clone();
  msgClone.find('.userid-wrapper').html(sender);
  msgClone.find('.msg-content').html(content);
  if(direct) {
    msgClone.find('.direct-indicator').removeClass('hidden');
  }
  msgClone.appendTo('#msgsSink');
};

$(CDOT.onDomReady);

})(jQuery);