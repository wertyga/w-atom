import path from 'path';
import Atom from './atom';

const outputFile = path.join(__dirname, 'output.css');
const variablesCss = path.join(__dirname, 'variables.css');
const atom = new Atom({ outputFile, variablesCss });

atom.generate();
