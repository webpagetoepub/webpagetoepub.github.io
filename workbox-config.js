module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{png,css,ico,html,js,svg,webmanifest}'
	],
	swDest: 'ws.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	sourcemap: false
};
