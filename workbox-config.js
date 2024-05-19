module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{png,ico,svg,webmanifest}',
		'css/style.min.css',
		'js/script.min.js',
		'index.html',
	],
	swDest: 'ws.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	sourcemap: false
};
