"use strict";

class Triangle {
    constructor(p0, p1, p2) {
	this.vertices = [p0, p1, p2];
	const center = [(p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3];
	//Sort the vertices counterclockwise for the circumcircle calculations
	this.vertices.sort((a, b) => {
	    return Math.atan2(a[1] / a[0]) - Math.atan2(b[1] / b[0]);
	})

	this.isInCircumcircle = function (p) {

	    const [x0, y0] = this.vertices[0];
	    const [x1, y1] = this.vertices[1];
	    const [x2, y2] = this.vertices[2];
	    //According to https://en.wikipedia.org/wiki/Delaunay_triangulation#Algorithms
	    //this will determine if p is in the circumcircle of the triangle 
	    const row0 = [x0 - p[0], y0 - p[1], Math.pow(x0 - p[0], 2) + Math.pow(y0 - p[1], 2)];
	    const row1 = [x1 - p[0], y1 - p[1], Math.pow(x1 - p[0], 2) + Math.pow(y1 - p[1], 2)];
	    const row2 = [x2 - p[0], y0 - p[1], Math.pow(x2 - p[0], 2) + Math.pow(y2 - p[1], 2)];

	    const det = row0[0] * row1[1] * row2[2] +
		  row0[1] * row1[2] * row2[0] +
		  row0[2] * row1[0] * row2[1] -
		  row0[2] * row1[1] * row2[0] -
		  row0[1] * row1[0] * row2[2] -
		  row0[0] * row1[2] * row2[1];
	    return det > 0;
	}
    }
}
