/**
 * @fileoverview
 * @TODO file description
 *
 * @author Tadeusz Kozak
 * @date 26-06-2012 13:23
 */

var log = log4javascript.getLogger();
window.log = log;
var inPageAppender = new log4javascript.InPageAppender("logsContainer");
inPageAppender.setHeight("500px");
log.addAppender(inPageAppender);