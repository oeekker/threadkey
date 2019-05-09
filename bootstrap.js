/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 *
 * The Original Code is ThreadKey Extension.
 * The Initial Developer of the Original Code is Luca Porzio.
 * Portions created by the Initial Developer are Copyright (c) 2006
 * the Initial Deveoper. All Rights Reserved.
 *
 * Contributors:
 * Stefano Constantini, Onno Ekker
 */

"use strict";

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Log.jsm");

const LOGGER_ID = "threadkey";

var stringBundle = Services.strings.createBundle("chrome://threadkey/locale/threadkey.properties");

var my_threadkey = {
  debug: true,

  threadSortCmd: { command: "", oncommand: "MsgSortThreaded()" },
  unthreadSortCmd: { command: "", oncommand: "MsgSortUnthreaded()" },
  groupBySortCmd: { command: "", oncommand: "MsgGroupBySort()" },

  initThreadkey: function() {
    this.log("init");
    this.getStringFromBundle("threadSortCmd", "key modifiers");
    this.getStringFromBundle("unthreadSortCmd", "key modifiers");
    this.getStringFromBundle("groupBySortCmd", "key modifiers");

    this.getStringFromBundle("threadkeyOverrideKey1", "id key modifiers");
    this.getStringFromBundle("threadkeyOverrideKey2", "id key modifiers");
    this.getStringFromBundle("threadkeyOverrideKey3", "id key modifiers");
  },

  getStringFromBundle: function(obj, attrs) {
    var attr = attrs.split(" ");
    for (var i = 0; i < attr.length; i++) {
      if (!this[obj]) this[obj] = {};
      var schema = this[obj];
      var entity = obj + "." + attr[i];
      var value = stringBundle.GetStringFromName(entity);
      schema[attr[i]] = value;
      this.log("getstring "+entity+"='"+value+"'");
    }
  },

  loadIntoWindow: function(caller, window) {
    my_threadkey.window = window;
    var doc = window.document;
    my_threadkey.log(caller+" loadintowindow "+doc.documentElement.id);

    if (my_threadkey.threadkeyOverrideKey1.id !== "") {
      my_threadkey.saveOriginalAttributes(doc, my_threadkey.threadkeyOverrideKey1.id, "originalKey1", "id key modifiers command oncommand");
      my_threadkey.threadkeyOverrideKey1.command = my_threadkey.originalKey1.command;
      my_threadkey.threadkeyOverrideKey1.oncommand = my_threadkey.originalKey1.oncommand;
      my_threadkey.defineKey(doc, my_threadkey.threadkeyOverrideKey1.id, "threadkeyOverrideKey1");
      my_threadkey.removeAcceltexts(doc, my_threadkey.threadkeyOverrideKey1.id);
    }
    if (my_threadkey.threadkeyOverrideKey2.id !== "") {
      my_threadkey.saveOriginalAttributes(doc, my_threadkey.threadkeyOverrideKey2.id, "originalKey2", "id key modifiers command oncommand");
      my_threadkey.threadkeyOverrideKey2.command = my_threadkey.originalKey2.command;
      my_threadkey.threadkeyOverrideKey2.oncommand = my_threadkey.originalKey2.oncommand;
      my_threadkey.defineKey(doc, my_threadkey.threadkeyOverrideKey2.id, "threadkeyOverrideKey2");
      my_threadkey.removeAcceltexts(doc, my_threadkey.threadkeyOverrideKey2.id);
    }
    if (my_threadkey.threadkeyOverrideKey3.id) {
      my_threadkey.saveOriginalAttributes(doc, my_threadkey.threadkeyOverrideKey3.id, "originalKey3", "id key modifiers command oncommand");
      my_threadkey.threadkeyOverrideKey3.command = my_threadkey.originalKey3.command;
      my_threadkey.threadkeyOverrideKey3.oncommand = my_threadkey.originalKey3.oncommand;
      my_threadkey.defineKey(doc, my_threadkey.threadkeyOverrideKey3.id, "threadkeyOverrideKey3");
      my_threadkey.removeAcceltexts(doc, my_threadkey.threadkeyOverrideKey3.id);
    }

    my_threadkey.saveOriginalAttributes(doc, "sortThreaded", "sortThreaded", "key");
    my_threadkey.saveOriginalAttributes(doc, "appmenu_sortThreaded", "appmenu_sortThreaded", "key");
    my_threadkey.defineKey(doc, "key_threadSort", "threadSortCmd");
    my_threadkey.setMenuitem(doc, "sortThreaded", "key_threadSort");
    my_threadkey.setMenuitem(doc, "appmenu_sortThreaded", "key_threadSort");

    my_threadkey.saveOriginalAttributes(doc, "sortUnthreaded", "sortUnthreaded", "key");
    my_threadkey.saveOriginalAttributes(doc, "appmenu_sortUnthreaded", "appmenu_sortUnthreaded", "key");
    my_threadkey.defineKey(doc, "key_unthreadSort", "unthreadSortCmd");
    my_threadkey.setMenuitem(doc, "sortUnthreaded", "key_unthreadSort");
    my_threadkey.setMenuitem(doc, "appmenu_sortUnthreaded", "key_unthreadSort");

    my_threadkey.saveOriginalAttributes(doc, "groupBySort", "groupBySort", "key");
    my_threadkey.saveOriginalAttributes(doc, "appmenu_groupBySort", "appmenu_groupBySort", "key");
    my_threadkey.defineKey(doc, "key_groupBySort", "groupBySortCmd");
    my_threadkey.setMenuitem(doc, "groupBySort", "key_groupBySort");
    my_threadkey.setMenuitem(doc, "appmenu_groupBySort", "key_groupBySort");

    my_threadkey.log(caller+" loadintowindow "+doc.documentElement.id+" ready");
  },

  unloadFromWindow: function(caller, window) {
    var doc = window.document;
    my_threadkey.log(caller+" unloadfromwindow "+doc.documentElement.id);

    my_threadkey.setMenuitem(doc, "appmenu_sortThreaded", my_threadkey.sortThreaded.key);
    my_threadkey.setMenuitem(doc, "sortThreaded", my_threadkey.sortThreaded.key);
    my_threadkey.defineKey(doc, "key_threadSort", "key_threadSort");

    my_threadkey.setMenuitem(doc, "appmenu_sortUnthreaded", my_threadkey.sortUnthreaded.key);
    my_threadkey.setMenuitem(doc, "sortUnthreaded", my_threadkey.sortUnthreaded.key);
    my_threadkey.defineKey(doc, "key_unthreadSort", "key_unthreadSort");

    my_threadkey.setMenuitem(doc, "appmenu_groupBySort", my_threadkey.groupBySort.key);
    my_threadkey.setMenuitem(doc, "groupBySort", my_threadkey.groupBySort.key);
    my_threadkey.defineKey(doc, "key_groupBySort", "key_groupBySort");

    if (my_threadkey.threadkeyOverrideKey1.id !== "") {
      my_threadkey.defineKey(doc, my_threadkey.threadkeyOverrideKey1.id, "originalKey1");
      my_threadkey.removeAcceltexts(doc, my_threadkey.originalKey1.id);
    }

    if (my_threadkey.threadkeyOverrideKey2.id !== "") {
      my_threadkey.defineKey(doc, my_threadkey.threadkeyOverrideKey2.id, "originalKey2");
      my_threadkey.removeAcceltexts(doc, my_threadkey.originalKey2.id);
    }

    if (my_threadkey.threadkeyOverrideKey3.id !== "") {
      my_threadkey.defineKey(doc, my_threadkey.threadkeyOverrideKey3.id, "originalKey3");
      my_threadkey.removeAcceltexts(doc, my_threadkey.originalKey3.id);
    }

    my_threadkey.log(caller+" unloadfromwindow "+doc.documentElement.id+" ready");
  },

  saveOriginalAttributes: function(doc, node, obj, attrs) {
    var id = doc.getElementById(node);
    if (id !== null) {
      my_threadkey.log("save node "+node+" to "+obj);
      if (!my_threadkey[obj]) my_threadkey[obj] = {};
      var schema = my_threadkey[obj];
      var attr = attrs.split(" ");
      for (var i = 0; i < attr.length; i++) {
        schema[attr[i]] = id.getAttribute(attr[i]);
        my_threadkey.log("save "+node+"."+attr[i]+"='"+schema[attr[i]]+"'");
      }
    }
   },

  defineKey: function(doc, key, obj) {
    var mailKeys = doc.getElementById("mailKeys");
    var id = doc.getElementById(key);
    if (!my_threadkey[obj]) {
      my_threadkey.log("remove "+key);
      id.parentNode.removeChild(id);
    } else {
      var schema = my_threadkey[obj];
      if (id === null) {
        my_threadkey.log("create "+key);
        id = doc.createElement("key");
        id.setAttribute("id", key);
        mailKeys.appendChild(id);
      } else {
        my_threadkey.log("change "+key);
      }
      my_threadkey.setAttribute(id, "key", schema.key);
      my_threadkey.setAttribute(id, "modifiers", schema.modifiers);
      my_threadkey.setAttribute(id, "command", schema.command);
      my_threadkey.setAttribute(id, "oncommand", schema.oncommand);
      my_threadkey.log("key "+key+" key '"+schema.modifiers+(schema.modifiers !== "" ? "+" : "")+schema.key+"' mapped to '"+schema.oncommand+"'");
    }
  },

  /*
   * There seems to be a bug that when you change a key, the acceltext isn't updated.
   * Remove the acceltexts from the menuitems, so they get generated again
   */
  removeAcceltexts: function(doc, key) {
    var id = doc.getElementById(key);
    if (id !== null) {
      var elements = doc.getElementsByTagName("menuitem");
      var list = [];
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].hasAttribute("key") && elements[i].getAttribute("key") === key) {
          my_threadkey.log("remove acceltext '"+elements[i].getAttribute("acceltext")+"' on "+elements[i].id);
          my_threadkey.setAttribute(elements[i], "acceltext", "");
        }
      }
    }
  },

  setMenuitem: function(doc, menuitem, key) {
    var id = doc.getElementById(menuitem);
    if (id !== null) {
      my_threadkey.log("menuitem "+menuitem+(key ? " set attribute key "+key : " remove attribute key"));
      my_threadkey.setAttribute(id, "key", key);
    } else {
      my_threadkey.log("menuitem "+menuitem+" does not exist");
    }
  },

  setAttribute: function(id, attr, value) {
    if (value !== undefined && value !== "") {
      id.setAttribute(attr, value);
    } else {
      if (id.hasAttribute(attr)) id.removeAttribute(attr);
    }
  },

  log: function(message) {
    if (my_threadkey.debug) {
      my_threadkey.logger.debug(message);
    }
  }
};

function install(data, reason) {}
function uninstall(data, reason) {}

function startup(data, reason) {
  if (my_threadkey.debug) {
    my_threadkey.logger = Log.repository.getLogger(LOGGER_ID);
    my_threadkey.logger.level = Log.Level.Debug;
    my_threadkey.logAppender = new Log.ConsoleAppender(new Log.BasicFormatter());
    my_threadkey.logger.addAppender(my_threadkey.logAppender);
  }
  my_threadkey.log("startup");
  my_threadkey.initThreadkey();
  forEachOpenWindow(my_threadkey.loadIntoWindow);
  Services.wm.addListener(WindowListener);
  my_threadkey.log("startup ready");
}

function shutdown(data, reason) {
  my_threadkey.log("shutdown");
  if (reason === APP_SHUTDOWN) return;
  forEachOpenWindow(my_threadkey.unloadFromWindow);
  Services.wm.removeListener(WindowListener);
  Services.obs.notifyObservers(null, "chrome-flush-caches", null);
  my_threadkey.log("shutdown ready");
  if (my_threadkey.debug) {
    my_threadkey.logger.removeAppender(my_threadkey.logAppender);
  }
}

function forEachOpenWindow(todo) {
  var windows = Services.wm.getEnumerator("mail:3pane");
  while (windows.hasMoreElements()) {
    var window = windows.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
    todo("foreachopenwindow", window);
  }
}

var WindowListener = {
  onOpenWindow: function(xulWindow) {
    var window = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                          .getInterface(Components.interfaces.nsIDOMWindow);
    function onWindowLoad() {
      window.removeEventListener("load", onWindowLoad);
      if (window.document.documentElement.getAttribute("windowtype") === "mail:3pane") {
        my_threadkey.loadIntoWindow("windowlistener", window);
      }
    }
    window.addEventListener("load", onWindowLoad);
  },
  onCloseWindow: function(xulWindow) { }
};
