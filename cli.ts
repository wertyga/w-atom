#!/usr/bin/env node

import Atom from './atom';
import { OptionsType, OPTIONS_VARS } from './atom';
const argv = process.argv;

const options: OptionsType = {} as OptionsType;

argv.forEach(function(arg, i) {
	if (arg === `--${OPTIONS_VARS.OUTPUT_FILE}`) options.outputFile = argv[i + 1];
	if (arg === `--${OPTIONS_VARS.VARIABLES_FILE}`) options.variablesCss = argv[i + 1];
});

const atom = new Atom(options);
atom.generate();
