# Testament

Testament is a tool for testing APIs

![Application Window](./assets/images/application-window.png)

## Setting up a dev environment

Ensure that `npm` and `python` (>= 3.13) are installed and available in PATH.

Windows:

```cmd
.\dev-setup.bat
```

Linux/OSX:

```sh
sh dev-setup.sh
```

## Running

```sh
npm start
```

## Building

```sh
npm run app:dir
npm run app:dist
```

The executable can be found at:

```
./dist/Testament-linux-x86_64.AppImage
./dist/testament_1.0.0_amd64.snap
```

Note: Running an app after building is currently broken on windows
