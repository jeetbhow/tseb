# TSEB

What's the worst part of developing in JavaScript? _Everything_. But if I had to pinpoint one thing in particular that I hate it's having to set up the development environment everytime I start a project. That's where this little script comes in.

**TSEB** (**TypeScript Environment Builder**) is a small script that builds a Node development environment. It comes with unit testing, git integration, TypeScript, ESM configured by default, and a project structure.

# Installation

Install the latest version of [Node](https://nodejs.org/en) (at least v20.10.0) and also the [GitHub CLI](https://cli.github.com/). This has only been tested on a Windows machine.

1. Run `npm install -g tseb`
2. Go to the parent directory of your soon to be project and run the command `tseb project-name` to create a new project. Authenticate via login through the browser.
3. Change into the project directory and run `npm start` to verify that TypeScript is working.
4. Run `npm test` to verify that Mocha and Chai are working.
