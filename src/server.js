const express = require('express')
const server = express()

const renderPreview = (htmlContent) => {
	server.get('/', (req, res) => res.render('<link rel="stylesheet" type="text/css" src="index.css">'+
		htmlContent))

	server.listen(1337, () => console.log('Preview on port 1337!'))
}
