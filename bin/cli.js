#!/usr/bin/env node

const path = require('path');

const { prompt } = require('enquirer');
const colors = require('colors');
const resolve = require('resolve-dir');

const { printJSON, loadJSON, saveJSON } = require('../src/helpers/json-helper');
const { listDirectory, createDirectory } = require('../src/helpers/directory-helper');
const { ignoreCase } = require('../src/helpers/sort-helper');

const ROOT_PATH = path.join(__dirname, '..');
const MODULES_PATH = path.join(ROOT_PATH, 'modules');
const SOURCE_FILE_PATH = path.join(ROOT_PATH, 'src', '.solidarity.example.json');
const OUTPUT_FILENAME = '.solidarity.json';

const QUE_DIST = 'dist_dir_path';
const QUE_NAME = 'modules';

const question = [
    {
        type: 'input',
        name: QUE_DIST,
        message: `Directory where config file will be created`,
        initial: '.'
    },
    {
        type: 'multiselect',
        name: QUE_NAME,
        message: 'Choose modules:',
        choices: []
    }
];

function getModules(selectedModules) {
    return selectedModules
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

    question.find((q) => q.name === QUE_NAME).choices.push(...modules);

    const answers = await prompt(question);

    const selectedModules = answers[QUE_NAME];
    if (selectedModules.length === 0) {
        console.error('Error: Please select at least one module'.red);
        process.exit(1);
    }

    const distDirectory = answers[QUE_DIST].trim();
    let distFilePath = OUTPUT_FILENAME;

    if (distDirectory) {
        const normalizeDistDirectory = path.resolve(resolve(distDirectory));
        await createDirectory(normalizeDistDirectory);
        distFilePath = normalizeDistDirectory + path.sep + OUTPUT_FILENAME
    }

    const requirements = getModules(selectedModules);

    const configFile = loadJSON(SOURCE_FILE_PATH);
    Object.assign(configFile, { requirements });

    await saveJSON(distFilePath, configFile);

    const message = 'Create config file at';
    console.log(
        `${colors.yellow('✔')} ${colors.bold(message)}: ${distFilePath}`
    );
}

main().catch(err => {
    const message = (typeof err === 'object')
        ? err.message
        : 'Unknown';
    console.error(
        colors.red(`Error: ${message}`)
    )
});
