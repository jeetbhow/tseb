# TSEB

What's the worst part of developing in JavaScript? _Everything_. But if I had to pinpoint one thing in particular that I hate it's having to set up the development environment everytime I start a project. That's where this little script comes in.

**TSEB** (**TypeScript Environment Builder**) is a small script that builds a Node development environment. It comes with unit testing, git integration, TypeScript, ESM configured by default, and a project structure.

# Installation

\*This has only been tested on Windows so far.

1. Download the latest version of Node.js. Run `node -v` and check that it's at least v20.10.0.
2. Run the command `npm install -g tseb` to install the package globally.
3. Go to the parent directory of your soon to be project and run the command `tseb project-name` to create a new project. You should see some text on the terminal followed by a prompt asking you to authorize github access. Authorize github access through login.
4. Change into the project directory and run `npm start`. You should see `Hello, world!` on the console.
5. Run `npm test` to verify that mocha and chai are working.
