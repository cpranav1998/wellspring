import React, { Component } from 'react';
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const {dialog} = electron.remote;
const ipcRenderer  = electron.ipcRenderer;
const fountain = require('./fountain.js');


