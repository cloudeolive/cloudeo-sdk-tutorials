/**
 * Copyright (C) SayMama Ltd 2012
 *
 * All rights reserved. Any use, copying, modification, distribution and selling
 * of this software and it's documentation for any purposes without authors'
 * written permission is hereby prohibited.
 */
/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 30-05-2012 16:01
 */


/**
 * @namespace
 */
var CDO = CDO || {};

/**
 * @const
 * @type {string}
 */
CDO.MEDIA_TYPE_AUDIO = 'audio';


/**
 * @const
 * @type {string}
 */
CDO.MEDIA_TYPE_VIDEO = 'video';

/**
 * @const
 * @type {string}
 */
CDO.MEDIA_TYPE_SCREEN = 'screen';

/**
 * @param {boolean=} enableDebug
 */
CDO.initStdLogging = function (enableDebug) {
};

/**
 * @param {Function} logHandler
 * @param {boolean=} enableDebug
 */
CDO.initLogging = function (logHandler, enableDebug) {
};

/**
 *
 * @param {CDO.Responder} responder
 */
CDO.getInstallerURL = function (responder) {
};


/**
 * @param {string} sinkId
 * @param {string} containerId
 * @param {boolean} [fullSize=true]
 */
CDO.renderSink = function (sinkId, containerId, fullSize) {
};


/**
 * @param {string} message
 * @param {Number=} code
 * @constructor
 */
CDO.CloudeoException = function (message, code) {

  /**
   * @const
   * @type {String}
   */
  this.name;

  /**
   * @type {String}
   */
  this.message;

  /**
   * @type {Number}
   */
  this.code;
};

CDO.ErrorCodes = {
  Common:{
    SMERR_NO_ERROR:0,
    SMERR_DEFAULT_ERROR:-1,
    INVALID_ARGUMENT:1
  },

  Logic:{
    SMERR_LOGIC_BASE:1000,
    SMERR_LOGIC_INVALID_ROOM:1001, /* 1001*/
    SMERR_LOGIC_INVALID_ARGUMENT:1002, /* 1002*/

    SMERR_LOGIC_INVALID_JS_PARAMETER_KEY:1003, /* 1003*/

    SMERR_LOGIC_PLATFORM_INIT_FAILED:1004, /* 1004*/

    SMERR_LOGIC_PLUGIN_UPDATING:1005, /* 1005 */
    SMERR_LOGIC_INTERNAL:1006, /* 1006 */

    SMERR_LOGIC_LIB_IN_USE:1007, /* 1007 */

    SMERR_LOGIC_INVALID_CONTAINER_VERSION:1008 /* 1008 */
  },

  Communication:{
    SMERR_COMM_INVALID_HOST:2001,
    SMERR_COMM_INVALID_PORT:2002,
    SMERR_COMM_BAD_AUTH:2003,

    SMERR_COMM_AUTH_ERROR:2004,
    SMERR_COMM_MEDIA_LINK_FAILURE:2005,

    SMERR_COMM_REMOTE_END_DIED:2006,

    SMERR_COMM_INTERNAL:2007,


    SMERR_SEND_INVALID_ARGUMENT:2008,
    SMERR_COMM_ALREADY_JOINED:2009
  },
  Media:{
    SMERR_MEDIA_INVALID_VIDEO_DEV:4001,
    SMERR_MEDIA_NO_AUDIO_IN_DEV:4002,
    SMERR_MEDIA_INVALID_AUDIO_IN_DEV:4003,

    SMERR_MEDIA_INVALID_AUDIO_OUT_DEV:4004,
    SMERR_MEDIA_INVALID_AUDIO_DEV:4005,
    SMERR_MEDIA_VCAM_INIT_FAILED:4006

  },

  Installation:{
    SMERR_INST_BASE:5000,

    SMERR_INST_ALREADY_INSTALLING:5001, /*= 5001*/
    SMERR_INST_FAILED_TO_SPAWN_INST:5002, /*= 5002*/
    SMERR_INST_UNSUPPORTED:5003, /*= 5003*/

    SMERR_INST_IO_ERROR:5004, /*= 5004 */
    SMERR_INST_DOWNLOAD_ERROR:5005, /*= 5005 */
    SMERR_INST_DATA_VERIFICATION_ERROR:5006 /*= 5006 */

  }
};

/**
 * @constructor
 * @param {string} pluginContainerId
 */
CDO.CloudeoPlugin = function (pluginContainerId) {
  this.pluginContainerId = pluginContainerId;
};

/**
 *  @param {Function} handler
 */
CDO.PluginWrapper.prototype.startPolling = function (handler) {
};

/**
 */
CDO.PluginWrapper.prototype.stopPolling = function () {
};

/**
 */
CDO.PluginWrapper.prototype.unload = function () {
};


/**
 *  @return {boolean}
 */
CDO.PluginWrapper.prototype.loadPlugin = function () {
};


/**
 * @param {CDO.Responder} responder
 */
CDO.CloudeoPlugin.prototype.createService = function (responder) {
};


/**
 * @param {CDO.PluginUpdateListener} listener
 * @param {string=} url
 */
CDO.CloudeoPlugin.prototype.update = function (listener, url) {
};


/**
 * @return {string|null}
 */
CDO.CloudeoPlugin.prototype.getLogFileTag = function () {
};

/**
 * @param {string} tag
 * @return {string|null}
 */
CDO.CloudeoPlugin.prototype.getLogFileByTag = function (tag) {
};

/**
 * @constructor
 */
CDO.PluginUpdateListener = function () {
};

/**
 * @param {Number} progress
 */
CDO.PluginUpdateListener.prototype.updateProgress = function (progress) {
};

/**
 * @param {string} newStatus
 * @param {Number=} errCode
 * @param {string=} errMessage
 */
CDO.PluginUpdateListener.prototype.updateStatus = function (newStatus, errCode, errMessage) {
};


/**
 * @constructor
 * @param {Function=} resultHandler
 * @param {Function=} errHandler
 * @param {Object=} context
 */
CDO.Responder = function (resultHandler, errHandler, context) {
};

/**
 * @param {string} method
 */
CDO.Responder.prototype.setMethod = function (method) {
};

/**
 * @param {Function=} resultHandler
 * @param {Function=} errHandler
 * @param {Object=} context
 */
CDO.createResponder = function (resultHandler, errHandler, context) {
  return new CDO.Responder(resultHandler, errHandler, context);
};

/**
 * @param {Object} nativeService
 * @constructor
 */
CDO.CloudeoService = function (nativeService) {
  this.nativeService = /** CDO.CloudeoService*/ nativeService;
};

/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getVersion = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 * @param {CDO.CloudeoServiceListener} listener
 **/
CDO.CloudeoService.prototype.addServiceListener = function (responder, listener) {
};


/**
 * @param {CDO.Responder} responder
 */
CDO.CloudeoService.prototype.getHostCpuDetails = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getVideoCaptureDeviceNames = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 * @param {string} deviceId
 **/
CDO.CloudeoService.prototype.setVideoCaptureDevice =
    function (responder, deviceId) {
    };


/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getVideoCaptureDevice = function (responder) {
};


/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getAudioCaptureDeviceNames = function (responder) {
};


/**
 * @param {CDO.Responder} responder
 * @param {Number} deviceId
 **/
CDO.CloudeoService.prototype.setAudioCaptureDevice = function (responder, deviceId) {
};


/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getAudioCaptureDevice = function (responder) {
};


/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getAudioOutputDeviceNames = function (responder) {
};


/**
 * @param {CDO.Responder} responder
 * @param deviceId index of device in array returned by the
 **/
CDO.CloudeoService.prototype.setAudioOutputDevice = function (responder, deviceId) {
};


/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getAudioOutputDevice = function (responder) {
};


/**
 * @param {CDO.Responder} responder
 * @param {Number} thumbWidth
 */
CDO.CloudeoService.prototype.getScreenCaptureSources =
    function (responder, thumbWidth) {
    };

/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.startLocalVideo = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.stopLocalVideo = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 * @param {Object.<string,*>} connectionDescription
 */
CDO.CloudeoService.prototype.connect = function (responder, connectionDescription) {
};

/**
 * @param {CDO.Responder} responder
 * @param {string}
    **/
CDO.CloudeoService.prototype.disconnect = function (responder, scopeId) {
};


/**
 * @param {CDO.Responder} responder
 * @param {string} scope
 * @param {string} what
 * @param {Object} details
 */
CDO.CloudeoService.prototype.publish = function (responder, scope, what, details) {
};

/**
 * @param {CDO.Responder} responder
 * @param {string} scope
 * @param {string} what
 */
CDO.CloudeoService.prototype.unpublish = function (responder, scope, what) {
  var methodString = 'unpublish(' + scope + ', ' + what + ')';
  CDO._logd("Calling plugin method " + methodString);
  responder.setMethod(methodString);
  this.nativeService.unpublish(responder, scope, what);
};

/**
 * @param {CDO.Responder} responder
 * @param {string} scopeId
 * @param {string} message
 * @param {Number=} targetUserId
 */
CDO.CloudeoService.prototype.sendMessage =
    function (responder, scopeId, message, targetUserId) {
      var method = "broadcast(" + scopeId + ", " + message + ", "
          + targetUserId + ")";
      CDO._logd("Calling plugin method " + method);
      responder.setMethod(method);

      if (targetUserId) {
        this.nativeService.broadcast(responder, scopeId, message, targetUserId);
      } else {
        this.nativeService.broadcast(responder, scopeId, message);
      }
    };

/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getSpeakersVolume = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 * @param {Number} volume
 **/
CDO.CloudeoService.prototype.setSpeakersVolume = function (responder, volume) {
  CDO._logd("Calling plugin method setSpeakersVolume(" + volume + ")");
  responder.setMethod("setSpeakersVolume(" + volume + ")");
  this.nativeService.setSpeakersVolume(responder, volume);
};

/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.getMicrophoneVolume = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 **/
CDO.CloudeoService.prototype.setMicrophoneVolume = function (responder, volume) {
};

/**
 * @param {CDO.Responder} responder
 * @param {boolean} enabled
 */
CDO.CloudeoService.prototype.monitorMicActivity = function (responder, enabled) {
};


/**
 * @param {CDO.Responder} responder
 * @param {string} scopeId
 * @param {Number} interval
 */
CDO.CloudeoService.prototype.startMeasuringStatistics = function (responder, scopeId, interval) {
};

/**
 * @param {CDO.Responder} responder
 * @param {string} scopeId
 */
CDO.CloudeoService.prototype.stopMeasuringStatistics = function (responder, scopeId) {
};

/**
 * @param {CDO.Responder} responder
 */
CDO.CloudeoService.prototype.startPlayingTestSound = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 */
CDO.CloudeoService.prototype.stopPlayingTestSound = function (responder) {
};

/**
 * @param {CDO.Responder} responder
 * @param {string} name
 */
CDO.CloudeoService.prototype.getProperty = function (responder, name) {
};

/**
 * @param {CDO.Responder} responder
 * @param {string} name
 * @param {string|Number|boolean} value
 */
CDO.CloudeoService.prototype.setProperty = function (responder, name, value) {
};


/**
 * @param {CDO.Responder} responder
 */
CDO.CloudeoService.prototype.getLogFileTag = function (responder) {
};

/**
 * @constructor
 */
CDO.CloudeoServiceListener = function () {
};

/**
 * @param {CDO.VideoFrameSizeChangedEvent} e
 */
CDO.CloudeoServiceListener.prototype.onVideoFrameSizeChanged = function (e) {
};


/**
 * @param {CDO.ConnectionLostEvent} e
 */
CDO.CloudeoServiceListener.prototype.onConnectionLost = function (e) {
};


/**
 * @param {CDO.UserStateChangedEvent} e
 */
CDO.CloudeoServiceListener.prototype.onUserEvent = function (e) {
};

/**
 * @param {CDO.UserStateChangedEvent} e
 */
CDO.CloudeoServiceListener.prototype.onMediaStreamEvent = function (e) {
};


/**
 * @param {CDO.MicActivityEvent} e
 */
CDO.CloudeoServiceListener.prototype.onMicActivity = function (e) {
};

/**
 * @param {CDO.MicGainEvent} e
 */
CDO.CloudeoServiceListener.prototype.onMicGain = function (e) {
};


/**
 * @param {CDO.DeviceListChangedEvent} e
 */
CDO.CloudeoServiceListener.prototype.onDeviceListChanged = function (e) {
};


/**
 * @param {CDO.MediaStatsEvent} e
 */
CDO.CloudeoServiceListener.prototype.onMediaStats = function (e) {
};

/**
 * @param {CDO.MessageEvent} e
 */
CDO.CloudeoServiceListener.prototype.onMessage = function (e) {
};


/**
 */
CDO.CloudeoServiceListener.prototype.onServiceInvalidated = function () {
};

/**
 */
CDO.CloudeoServiceListener.prototype.onServiceRevalidated = function () {
};

/**
 * @param {CDO.MediaConnTypeChangedEvent} e
 */
CDO.CloudeoServiceListener.prototype.onMediaConnTypeChanged = function (e) {
};


/**
 * @param {string} sinkId
 * @param {Number} width
 * @param {Number} height
 * @constructor
 */
CDO.VideoFrameSizeChangedEvent = function (sinkId, width, height) {

  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {string}
   */
  this.sinkId;

  /**
   * @type {Number}
   */
  this.width;

  /**
   * @type {Number}
   */
  this.height;
};

/**
 * @param {string} scopeId
 * @param {Number} errCode
 * @param {string} errMessage
 * @constructor
 */
CDO.ConnectionLostEvent = function (scopeId, errCode, errMessage) {
  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {string}
   */
  this.scopeId;

  /**
   * @type {Number}
   */
  this.errCode;

  /**
   * @type {string}
   */
  this.errMessage;
};


/**
 * @param {string} scopeId
 * @param {Object} userDetails
 * @param {string=} mediaType
 * @constructor
 */
CDO.UserStateChangedEvent = function (scopeId, userDetails, mediaType) {

  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {string}
   */
  this.scopeId;

  /**
   * @type {Number}
   */
  this.userId;


  /**
   * @type {string|undefined}
   */
  this.mediaType;

  /**
   * @type {boolean}
   */
  this.isConnected;

  /**
   * @type {boolean}
   */
  this.audioPublished;

  /**
   * @type {boolean}
   */
  this.videoPublished;

  /**
   * @type {boolean}
   */
  this.screenPublished;

  /**
   * @type {string}
   */
  this.videoSinkId;

  /**
   * @type {string}
   */
  this.screenSinkId;
};

/**
 * @param {Number} activity integer with value in range 0-255 indicating current speech
 * @constructor
 */
CDO.MicActivityEvent = function (activity) {

  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {Number}
   */
  this.activity;
};

/**
 * @param {Number} gain
 * @constructor
 */
CDO.MicGainEvent = function (gain) {

  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {Number}
   */
  this.gain;
};

/**
 * @param {boolean} audioIn
 * @param {boolean} audioOut
 * @param {boolean} videoIn
 * @constructor
 */
CDO.DeviceListChangedEvent = function (audioIn, audioOut, videoIn) {

  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {boolean}
   */
  this.audioInChanged;


  /**
   * @type {boolean}
   */
  this.audioOutChanged;

  /**
   * @type {boolean}
   */
  this.videoInChanged = videoIn;
};


/**
 * @param {string} scopeId
 * @param {string} mediaType
 * @param {Object} stats
 * @param {Number=} remoteUserId
 * @constructor
 */
CDO.MediaStatsEvent = function (scopeId, mediaType, stats, remoteUserId) {
  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {string}
   */
  this.scopeId;

  /**
   * @type {string}
   */
  this.mediaType;

  /**
   * @type {Object}
   */
  this.stats;

  /**
   * @type {Number|undefined|null}
   */
  this.remoteUserId;
};

/**
 * @param {Number} srcUserId
 * @param {string} data
 * @constructor
 */
CDO.MessageEvent = function (srcUserId, data) {
  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {Number}
   */
  this.srcUserId;

  /**
   * @type {string}
   */
  this.data;
};

/**
 * @param {string} scopeId
 * @param {string} mediaType
 * @param {string} connectionType
 * @constructor
 */
CDO.MediaConnTypeChangedEvent = function (scopeId, mediaType, connectionType) {

  /**
   * @type {string}
   */
  this.type;

  /**
   * @type {string}
   */
  this.scopeId;

  /**
   * @type {string}
   */
  this.mediaType;

  /**
   * @type {string}
   */
  this.connectionType;
};
