'use strict';

describe('CRCRiskApp.version module', function() {
  beforeEach(module('CRCRiskApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
