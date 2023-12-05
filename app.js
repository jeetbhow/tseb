#!/usr/bin/env node

/**
 * MIT License

Copyright (c) 2023 Jeet Bhowmik

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions: The above copyright notice and this permission notice shall be 
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { exec, spawn } from "child_process";
import * as fs from "fs/promises";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const projectName = process.argv[2];
const projectPath = path.join(process.cwd(), projectName);

(async () => {
  try {
    await mkProjDir();
    await createLocalRepo();
    await npmInit();
    await tscInit();
    await mkSrcDir();
    await mkDistDir();
    await mkTestDir();
    await gitHubAuth();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

async function mkDir(dirPath, description) {
  try {
    console.log(`Making ${description} directory...`);
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Error creating ${description} directory: ${error.message}`);
  }
}

async function mkDistDir() {
  await mkDir(path.join(projectPath, "dist"), "dist");
}

async function mkSrcDir() {
  const srcDir = path.join(projectPath, "src");
  await mkDir(srcDir, "src");
  await fs.writeFile(path.join(srcDir, "app.ts"), 'console.log("Hello, world!")');
}

async function mkTestDir() {
  const testDir = path.join(projectPath, "test");
  await mkDir(testDir, "test");

  const testText = `import { assert } from 'chai';
  describe('Array', function () {
    describe('#indexOf()', function () {
      it('should return -1 when the value is not present', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });`;

  await fs.writeFile(path.join(testDir, "test.js"), testText);
}

async function tscInit() {
  console.log("Initializing typescript config...");

  const configText = `{
    "compilerOptions": {
        "target": "es6",
        "module": "Node16",
        "strict": true,
        "moduleResolution": "Node16",
        "esModuleInterop": true,
        "outDir": "dist",
        "rootDir": "src",
        "inlineSourceMap": true,
        "noImplicitAny": true,
    }
  }`;
  try {
    await fs.writeFile(path.join(projectPath, "tsconfig.json"), configText);
  } catch (error) {
    throw new Error(`Error creating typescript config: ${error}`);
  }
}

async function installPkgs() {
  console.log("Installing packages...");
  const packages = ["@types/node", "@types/mocha", "@types/chai", "mocha", "chai"];
  try {
    await execAsync(`npm install -D ${packages.join(" ")}`, { cwd: projectPath });
  } catch (error) {
    throw new Error(`Error installing packages: ${error.message}`);
  }
}

async function npmInit() {
  console.log("Initializing node...");
  const packagejsonText = `{
    "name": "envs",
    "version": "1.0.0",
    "main": "index.js",
    "type": "module",
    "scripts": {
      "test": "mocha",
      "build": "tsc",
      "start": "npm run build && node ./dist/app.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": ""
  }
  `;

  await fs.writeFile(path.join(projectPath, "package.json"), packagejsonText);
  await installPkgs();
}

async function mkProjDir() {
  await mkDir(projectPath, "project");
}

async function createLocalRepo(remoteUrl) {
  const gitIgnoreData = "dist\nnode_modules\npackage-lock.json\n.vscode\n";

  console.log("Setting up local repository...");
  await fs.writeFile(path.join(projectPath, ".gitignore"), gitIgnoreData);
  await fs.writeFile(path.join(projectPath, "README.md"), "Project description.");

  try {
    await execAsync("git init", { cwd: projectPath });
  } catch (error) {
    throw new Error(`Error setting up local repository: ${error.message}`);
  }
}

async function createRemoteRepo() {
  console.log("Creating remote repository...");
  try {
    const { stdout } = await execAsync(`gh repo create ${projectName} --public`);
    await execAsync(`git remote add origin ${stdout}`, { cwd: projectPath });
  } catch (error) {
    throw new Error(`Error creating remote repository: ${error.message}`);
  }
}

async function gitHubAuth() {
  console.log("Setting up remote repository...");
  const child = spawn("gh", ["auth", "login"], { stdio: "inherit" });

  return new Promise((resolve, reject) => {
    child.on("close", async code => {
      if (code === 0) {
        console.log("Authentication successful.");
        try {
          await createRemoteRepo();
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("Authentication failed."));
      }
    });
  });
}
