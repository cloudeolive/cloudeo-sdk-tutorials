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
  CDOT.initCloudeoLogging();
  CDOT.initializeCloudeoServiceContainer();
};

/**
 * Initializes the CloudeoServiceContainer.
 */
CDOT.initializeCloudeoServiceContainer = function () {
  log.debug("Initializing the Cloudeo Service Container");
  CDOT.cloudeoServiceContainer = new CDO.CloudeoPlugin(CDOT.PLUGIN_CONTAINER_ID);
  if (CDOT.cloudeoServiceContainer.loadPlugin()) {
    CDOT.createCloudeoService();
  } else {
    CDOT.showInstallButton();
  }
};





/**
 * ==========================================================================
 * Plug-in installation
 * ==========================================================================
 */

/**
 * Fetches the installer URL and shows the Cloudeo Plugin installation URL.
 */
CDOT.showInstallButton = function () {
  log.debug("Cloudeo plugin not installed; Getting the installation URL.");
  var responder = CDO.createResponder(CDOT.onInstallerUrl);
  CDO.getInstallerURL(responder)
};

CDOT.onInstallerUrl = function (url) {
  log.debug("Cloudeo Plug-in Installed fetched. Showing the install button.");
  $('#installBtn').
      attr('href', url).
      css('display','block').
      click(CDOT.onInstallBtnClicked);
};

CDOT.onInstallBtnClicked = function () {
  log.debug("Install button clicked. Starting polling for the plug-in availability");
  CDOT.cloudeoServiceContainer.startPolling(function () {
    log.debug("Plugin successfully installed. Initializing.");
    CDOT.createCloudeoService();
    $('#installBtn').css('display','none');
  });
};

/**
 * ==========================================================================
 * Cloudeo Service creation
 * ==========================================================================
 */

/**
 * Creates the Cloudeo Service. Should be called upon successful initialization
 * of the Cloudeo Service Container.
 */
CDOT.createCloudeoService = function () {
  log.debug("Creating Cloudeo Service.");
  var responder = CDO.createResponder(
      CDOT.onCloudeoServiceCreated,
      CDOT.onCloudeoServiceCreateError);
  CDOT.cloudeoServiceContainer.createService(responder)
};

/**
 *
 * @param {CDO.CloudeoService} service
 */
CDOT.onCloudeoServiceCreated = function (service) {
  log.debug("Cloudeo service created");
  CDOT.service = service;
  var responder = CDO.createResponder(CDOT.onGetVersionResult);
  CDOT.service.getVersion(responder);
};

/**
 *
 * @param {CDO.CloudeoService} service
 */
CDOT.onCloudeoServiceCreateError = function (errCode, errMessage) {
  log.error("Failed to create Cloudeo Service, due to: ");
  log.error(errMessage + ' (' + errCode + ')');
};

/**
 *
 * @param {string} version
 */
CDOT.onGetVersionResult = function (version) {
  log.debug("Cloudeo service version: " + version);
};


/**
 * Register the document ready handler.
 */
$(CDOT.onDomReady);
