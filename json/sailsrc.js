/**
 * .sailsrc
 * 
 * @param  {[type]} scope [description]
 * @return {[type]}       [description]
 */
module.exports = function (scope) {

	return {
		'generators': {
			'options': {
				'engine': 'ejs',
				'linker': true,
				'adapter': 'sails-disk'
			},
			'modules': {
				'new': 'sails-generate-new',
				'backend': 'sails-generate-backend',
				'frontend': 'sails-generate-frontend',
				'gitigore': 'sails-generate-gitigore',
				'packagejson': 'sails-generate-packagejson',
				'readme': 'sails-generate-readme',
				'model': 'sails-generate-model',
				'controller': 'sails-generate-controller',
				'api': 'sails-generate-api',
				'policy': 'sails-generate-policy',
				'response': 'sails-generate-response',
				'view': 'sails-generate-view',
				'adapter': 'sails-generate-adapter',
				'generator': 'sails-generate-generator',
				'hook': 'sails-generate-hook'
			}
		}
	};
};