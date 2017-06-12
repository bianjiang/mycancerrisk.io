'use strict';

angular.module('CRCRiskApp.version', [
  'CRCRiskApp.version.interpolate-filter',
  'CRCRiskApp.version.version-directive'
])

.value('version', '0.1');
