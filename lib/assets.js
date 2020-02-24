'use strict';

var ravencore = require('ravencore-lib');
var async = require('async');
var Common = require('./common');

function AssetController(opts) {
    this.node = opts.node;
    this.common = new Common({ log: this.node.log });
}

AssetController.prototype.listAssets = function(req, res) {
    var self = this;
    var asset = req.params.asset || req.query.asset || req.body.asset || '*';
    var verbose = (req.query.verbose && req.query.verbose.toUpperCase() == 'TRUE') ||
                  (req.body.verbose && req.body.verbose.toUpperCase() == 'TRUE') ||
                  false;
    var size = parseInt(req.query.size) || parseInt(req.body.size) || 100;
    var skip = parseInt(req.query.skip) || parseInt(req.body.skip) || 0;

    this.node.listAssets(asset, verbose, size, skip, function(err, data) {

        if (err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data);

    });
};

AssetController.prototype.listRestrictedAssets = function(req, res) {
    req.params.asset = "$*";
    this.listAssets(req, res);
}

AssetController.prototype.listQualifierAssets = function(req, res) {
    req.params.asset = "#*";
    this.listAssets(req, res);
}

AssetController.prototype.listGlobalFrozen = function(req, res) {
    var self = this;

    this.node.listGlobalFrozen(function(err, data) {
        if (err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data);
    });
};

AssetController.prototype.getVerifierString = function(req, res) {
    var self = this;

    var asset = req.params.asset || req.query.asset || req.body.asset || '';
    if(asset.length == 0) {
        return self.common.handleErrors({
          message: 'Must include restricted asset name.',
          code: 1
        }, res);
    };
    asset = asset.startsWith("$") ? asset : "$" + asset;
    asset = asset.toUpperCase();

    this.node.getVerifierString(asset, function(err, data) {
        if (err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data);
    });
};

AssetController.prototype.checkFrozen = function(req, res) {
    var self = this;

    var asset = req.params.asset || req.query.asset || req.body.asset || '';
    if(asset.length == 0) {
        return self.common.handleErrors({
          message: 'Must include restricted asset name.',
          code: 1
        }, res);
    };
    asset = asset.startsWith("$") ? asset : "$" + asset;
    asset = asset.toUpperCase();

    this.node.listGlobalFrozen(function(err, data) {
        if (err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data.includes(asset));
    });
};

AssetController.prototype.listAddressesForTag = function(req, res) {
    var self = this;

    var asset = req.params.asset || req.query.asset || req.body.asset || '';
    if(asset.length == 0) {
        return self.common.handleErrors({
          message: 'Must include qualifier asset name (tag).',
          code: 1
        }, res);
    };    
    asset = asset.startsWith("#") ? asset : "#" + asset;
    asset = asset.toUpperCase();

    this.node.listAddressesForTag(asset, function(err, data) {
        if (err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data);
    });
};

AssetController.prototype.checkVerifier = function(req, res) {
    var self = this;

    var verifier = req.query.verifier || req.body.verifier || '';
    if(verifier.length == 0) {
        return self.common.handleErrors({
          message: 'Must include verifier to be checked.',
          code: 1
        }, res);
    };   

    this.node.checkVerifier(verifier, function(err, data) {
        if (err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data);
    });
};

module.exports = AssetController;
