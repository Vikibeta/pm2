
/**
 * Copyright 2013 the PM2 project authors. All rights reserved.
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */

var debug = require('debug')('pm2:paths');
var p     = require('path');

function getDefaultPM2Home() {
  var PM2_ROOT_PATH;

  if (process.env.PM2_HOME)
    PM2_ROOT_PATH = process.env.PM2_HOME;
  else if (process.env.HOME && !process.env.HOMEPATH)
    PM2_ROOT_PATH = p.resolve(process.env.HOME, '.pm2');
  else if (process.env.HOME || process.env.HOMEPATH)
    PM2_ROOT_PATH = p.resolve(process.env.HOMEDRIVE, process.env.HOME || process.env.HOMEPATH, '.pm2');
  else {
    console.error('[PM2][Initialization] Environment variable HOME (Linux) or HOMEPATH (Windows) are not set!');
    console.error('[PM2][Initialization] Defaulting to /etc/.pm2');
    PM2_ROOT_PATH = p.resolve('/etc', '.pm2');
  }

  debug('pm2 home resolved to %s', PM2_ROOT_PATH, process.env.HOME);
  return PM2_ROOT_PATH;
}

module.exports = function(PM2_HOME) {
  if (!PM2_HOME)
    PM2_HOME = getDefaultPM2Home()

  var pm2_file_stucture = {
    PM2_HOME                 : PM2_HOME,
    PM2_ROOT_PATH            : PM2_HOME,

    PM2_CONF_FILE            : p.resolve(PM2_HOME, 'conf.js'),
    PM2_MODULE_CONF_FILE     : p.resolve(PM2_HOME, 'module_conf.json'),

    PM2_LOG_FILE_PATH        : p.resolve(PM2_HOME, 'pm2.log'),
    PM2_PID_FILE_PATH        : p.resolve(PM2_HOME, 'pm2.pid'),

    PM2_RELOAD_LOCKFILE      : p.resolve(PM2_HOME, 'reload.lock'),

    DEFAULT_PID_PATH         : p.resolve(PM2_HOME, 'pids'),
    DEFAULT_LOG_PATH         : p.resolve(PM2_HOME, 'logs'),
    DEFAULT_MODULE_PATH      : p.resolve(PM2_HOME, 'modules'),
    KM_ACCESS_TOKEN          : p.resolve(PM2_HOME, 'km-access-token'),
    DUMP_FILE_PATH           : p.resolve(PM2_HOME, 'dump.pm2'),
    DUMP_BACKUP_FILE_PATH    : p.resolve(PM2_HOME, 'dump.pm2.bak'),

    DAEMON_RPC_PORT          : p.resolve(PM2_HOME, 'rpc.sock'),
    DAEMON_PUB_PORT          : p.resolve(PM2_HOME, 'pub.sock'),
    INTERACTOR_RPC_PORT      : p.resolve(PM2_HOME, 'interactor.sock'),

    INTERACTOR_LOG_FILE_PATH : p.resolve(PM2_HOME, 'agent.log'),
    INTERACTOR_PID_PATH      : p.resolve(PM2_HOME, 'agent.pid'),
    INTERACTION_CONF         : p.resolve(PM2_HOME, 'agent.json5')
  };

  // allow overide of file paths via environnement
  var paths = Object.keys(pm2_file_stucture);
  paths.forEach(function (key) {
    var envKey = key.indexOf('PM2_') > -1 ? key : 'PM2_' + key;
    if (process.env[envKey] && key !== 'PM2_HOME' && key !== 'PM2_ROOT_PATH') {
      pm2_file_stucture[key] = process.env[envKey];
    }
  });

  if (process.platform === 'win32' ||
      process.platform === 'win64') {
    //@todo instead of static unique rpc/pub file custom with PM2_HOME or UID
    pm2_file_stucture.DAEMON_RPC_PORT = '\\\\.\\pipe\\rpc.sock';
    pm2_file_stucture.DAEMON_PUB_PORT = '\\\\.\\pipe\\pub.sock';
    pm2_file_stucture.INTERACTOR_RPC_PORT = '\\\\.\\pipe\\interactor.sock';
  }

  return pm2_file_stucture;
};
