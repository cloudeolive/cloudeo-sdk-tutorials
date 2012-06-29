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
  $("#initProgressBar").
      progressbar({
                    value:0
                  });
  CDOT.initCloudeoLogging();
  CDOT.initializeCloudeo();
};

/**
 * Initializes the CloudeoServiceContainer.
 */
CDOT.initializeCloudeo = function () {
  log.debug("Initializing the Cloudeo SDK");
  var initListener = new CDO.PlatformInitListener();
  initListener.onInitProgressChanged = function (e) {
    log.debug("Platform init progress: " + e.progress);
    $("#initProgressBar").progressbar('value', e.progress);
  };

  initListener.onInitStateChanged = function (e) {
    switch (e.state) {
      case CDO.InitState.ERROR:
        log.error("Failed to initialize the Cloudeo SDK");
        log.error("Reason: " + e.errMessage + ' (' + e.errCode + ')');
        break;
      case CDO.InitState.INITIALIZED:
        CDOT.getVersion();
        break;
      case CDO.InitState.INSTALLATION_REQUIRED:
        CDOT.showInstallButton(e.installerURL);
        break;
      case CDO.InitState.BROWSER_RESTART_REQUIRED:
        log.debug("Please restart your browser in order to complete platform auto-update");
        break;
      default:
        log.error("Got unsupported init state: " + e.state);
    }
  };
  CDO.initPlatform(initListener);
};


/**
 * ==========================================================================
 * Plug-in installation
 * ==========================================================================
 */

/**
 * Fetches the installer URL and shows the Cloudeo Plugin installation URL.
 */
CDOT.showInstallButton = function (url) {
  log.debug("Cloudeo plugin not installed; Getting the installation URL.");
  $('#installBtn').
      attr('href', url).
      css('display', 'block');
};

/**
 *
 * @param {CDO.CloudeoService} service
 */
CDOT.getVersion = function () {
  var getVersionResult = function (version) {
    log.debug("Cloudeo service version: " + version);
    $('#sdkVersion').html(version);
  };

  var responder = CDO.createResponder(getVersionResult);
  CDO.getService().getVersion(responder);
};


/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
