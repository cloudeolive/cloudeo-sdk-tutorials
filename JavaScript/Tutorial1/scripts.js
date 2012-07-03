/**
 * @fileoverview
 *
 * Contains implementation of logic required by the Tutorial 1.
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
 * Initializes the Cloudeo SDK.
 */
CDOT.initializeCloudeo = function () {
  log.debug("Initializing the Cloudeo SDK");

//  Step 1 - create the PlatformInitListener and overwrite it's methods.
  var initListener = new CDO.PlatformInitListener();

//  Define the handler for initialization progress changes
  initListener.onInitProgressChanged = function (e) {
    log.debug("Platform init progress: " + e.progress);
    $("#initProgressBar").progressbar('value', e.progress);
  };

//  Define the handler for initialization state changes
  initListener.onInitStateChanged = function (e) {
    switch (e.state) {

      case CDO.InitState.ERROR:
//      After receiving this status, the initialization is stopped as due to
//      a failure.
        log.error("Failed to initialize the Cloudeo SDK");
        log.error("Reason: " + e.errMessage + ' (' + e.errCode + ')');
        break;

      case CDO.InitState.INITIALIZED:
//      This state flag indicates that the Cloudeo SDK is initialized and fully
//      functional. In this tutorial, we will just perform sample call to
//      retrieve the current version of the SDK
        var getVersionResult = function (version) {
          log.debug("Cloudeo service version: " + version);
          $('#sdkVersion').html(version);
        };

        var responder = CDO.createResponder(getVersionResult);
        CDO.getService().getVersion(responder);
        break;

      case CDO.InitState.INSTALLATION_REQUIRED:
//      Current user doesn't have the Cloudeo Plug-In installed and it is
//      required - use provided URL to ask the user to install the Plug-in.
//      Note that the initialization process is just frozen in this state -
//      the SDK polls for plug-in availability and when it becomes available,
//      continues with the initialization.
        log.debug("Cloudeo Plug-in installation required");
        $('#installBtn').
            attr('href', e.installerURL).
            css('display', 'block');
        break;
      case CDO.InitState.INSTALLATION_COMPLETE:
        log.debug("Cloudeo Plug-in installation complete");
        $('#installBtn').hide();
        break;

      case CDO.InitState.BROWSER_RESTART_REQUIRED:
//      This state indicates that Cloudeo SDK performed auto-update and in order
//      to accomplish this process, browser needs to be restarted.
        log.debug("Please restart your browser in order to complete platform auto-update");
        break;

      default:
//      Default handler, just for sanity
        log.error("Got unsupported init state: " + e.state);
    }
  };

//  Step 2. Actually trigger the asynchronous initialization of the Cloudeo SDK.
  CDO.initPlatform(initListener);
};

/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
