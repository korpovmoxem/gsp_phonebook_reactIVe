// __mocks__/svgMock.js

const React = require('react');

const SVGMock = () => React.createElement('svg', { 'data-testid': 'svg-icon' });

SVGMock.ReactComponent = SVGMock;

module.exports = SVGMock;