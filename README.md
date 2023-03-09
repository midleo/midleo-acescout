# Midleo ACEScout

Source code for ACEScout - Explorer for IBM ACE server


## Getting started


```bash
$ git clone https://github.com/midleo/midleo-acescout.git
$ cd midleo-acescout
$ npm install
$ npm run build:dev:all
$ npm start
```

## Take a look

Some screenshots from the Midleo ACEScout:

### New App Connect server definition
![The Midleo acescout app](https://github.com/midleo/midleo-acescout/blob/master/github.assets/acescout.jpg?raw=true)


## NPM scripts

### Builds

This builds a project and places the output in the */dist* folder.

| Command | Description |
| --- | --- |
| `npm run build:dev:all` | Developer builds of all projects |
| `npm run build:prod:all` | Production builds of all projects |
| `npm run build:dev:main` | Developer build of the *Electron main* project |
| `npm run build:prod:main` | Production build of the *Electron main* project |
| `npm run build:dev:renderer` | Developer build of the *Electron renderer* project |
| `npm run build:prod:renderer` | Production build of the *Electron renderer* project |
| `npm run build:dev:preload` | Developer build of the *Electron preload* project |
| `npm run build:prod:preload` | Production build of the *Electron preload* project |

### Watch

Start watching for source code changes, and builds after each source code change.

| Command | Description |
| --- | --- |
| `npm run build:watch:all` | Watch all projects |
| `npm run build:watch:main` | Watch the *Electron main* project |
| `npm run build:watch:renderer` | Watch the *Electron renderer* project |
| `npm run build:watch:preload` | Watch the *Electron preload* project |

### Updates

Commands for updating NPM modules.

| Command | Description |
| --- | --- |
| `npm run update:angular` | Easy update to latest stable Angular |
| `npm run update:electron` | Easy update to latest stable Electron |
| `npm run update:webpack` | Easy update to latest stable WebPack |

### Packaging

| Command | Description |
| --- | --- |
| `npm run package` | Package current */dist* folder into an app in the */release-builds* folder |
| `npm run release` | First build a production build, then package */dist* folder into an app in the */release-builds* folder |

