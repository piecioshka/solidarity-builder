#!/usr/bin/env node

const path = require('path');

const { prompt } = require('enquirer');
const colors = require('colors');

const { printJSON, loadJSON, saveJSON } = require('../src/helpers/json-helper');
const { listDirectory, createDirectory } = require('../src/helpers/directory-helper');
const { ignoreCase } = require('../src/helpers/sort-helper');

const ROOT_PATH = path.join(__dirname, '..');
const MODULES_PATH = path.join(ROOT_PATH, 'modules');
const SOURCE_FILE_PATH = path.join(ROOT_PATH, 'src', '.solidarity.example.json');
const DIST_DIR_PATH = path.join(ROOT_PATH, 'dist');
const DIST_FILE_PATH = path.join(DIST_DIR_PATH, `.solidarity.json`);

const NAME = 'modules';

const question = [
    {
        type: 'multiselect',
        name: NAME,
        message: 'Choose modules:',
        choices: []
    }
];

function getModules(answers) {
    return answers[NAME]
        .map(m => {
            return {
                [m]: loadJSON(
                    path.join(MODULES_PATH, `${m}.json`)
                )
            };
        })
        .reduce((acc, m) => {
            return Object.assign(acc, m);
        }, {});
}

async function main() {
    const files = await listDirectory(MODULES_PATH);
    const modules = files
        .filter(f => (!/^\.(.*)$/.test(f)))
        .map(n => n.replace(/\.json$/, ''))
        .sort(ignoreCase);

    // printJSON(modules);

    question[0].choices.push(...modules);

    const answers = await prompt(question);
    const requirements = getModules(answers);

    const configFile = loadJSON(SOURCE_FILE_PATH);
    Object.assign(configFile, { requirements });

    await createDirectory(DIST_DIR_PATH);
    await saveJSON(DIST_FILE_PATH, configFile);
    console.log(`${colors.green('✔')} File with selected modules was created: ${DIST_FILE_PATH}`);
}

main().catch(err => console.error(err));
