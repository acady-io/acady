#!/usr/bin/env node

import {ProgramBuilder} from "../builders/program-builder";

const program = ProgramBuilder.build();
program.parse(process.argv);
