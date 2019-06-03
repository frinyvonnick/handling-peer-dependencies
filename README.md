# How to handle peer dependencies when developing modules 

## What is a peer dependency and what is the problem with it ?

[Peer dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/#the-solution-peer-dependencies) is a specific kind of dependencies really useful for reusable modules. It lets you ask user to install a dependency your module needs to work. It prevents having multiple version of a same module in user's app node_modules. It also have other benefits like 
lighter javascript files to load on browser side particularly useful for mobile users.

The problem with peer dependencies is `npm` and `yarn` doesn't install them at all. This is the right behavior for production purpose but when you are developping you need to test your module in an host app for example. `npm` and `yarn` provide a command to acheive it `link` that basically create a symlink into the host app node_modules to your module source folder. It works fine while using your module in the host app but you also need to execute tasks in your module that needs these dependencies like tests since the dependencies aren't present in your module's node_module folder you will have errors like this:

```
Cannot find module 'react' from 'index.js'
```

`yarn` and `npm` don't provide tools to install peer dependencies for your development environment. There are an opened issue on yarn repository since [27 October 2016](https://github.com/yarnpkg/yarn/issues/1503) but yarn have a special script called `prepare` that is called after dependencies installation only on development mode maybe we could do something with it 🤔. Let's find a way to set up a work around!

## Solve the problem

I made a [repository](https://github.com/frinyvonnick/handling-peer-dependencies) with all the sources to reproduce the problem.

We have the following folder structure:

```
- lib
-- package.json
-- node_modules
- app
-- package.json
-- node_modules
```

First of all we will set up our link so the app's node_modules folder point to our lib source folder.

_You have to install dependencies and maybe build your module before_

```sh
cd lib
yarn link
cd ../app
yarn link lib
```

At this point if you start your application you could use your module without any problem. The problem appears when you try to execute things into you module folder as I said before like tests. To solve this we will use [prepare](https://yarnpkg.com/en/docs/package-json#toc-scripts) script from `yarn` and the package [install-peers-cli](https://github.com/alexindigo/install-peers-cli).

`install-peers-cli` is a cli that install peer dependencies of a package. It should be called after dependencies installation. `prepare` is fortunately called after dependencies installation and only when you are developing so it won't install the peer dependencies when a user install your module.

First install `install-peers-cli` package:

```
yarn add -D install-peers-cli
```

Then add the `prepare` script in your module's `package.json` and call `install-peers-cli` in it:

```
// package.json
{
  "scripts": {
    "prepare": "install-peers"
  }
}
```

Now you could start anything that use your peer dependencies without experiencing errors. Unless your module uses `React` and his new addition `Hooks`...

## For React using hooks

If you follow previous steps you should have an error with the following message "hooks can only be called inside the body of a function component". This error occurs when you have multiple copies of `React` in your node_modules folder. In this [issue](https://github.com/facebook/react/issues/14257#issuecomment-439967377) Dan Abramov explain the solution to this well know issue. Let's put it into pratice.

You should go in our module's `react` folder that is present into our `node_modules` and create a link. Then you go back to our host app folder and use this link.

```sh
cd lib/node_module/react
yarn link
cd ../../../app
yarn link react
```

Now the error should be fixed and you could use your module into your host app!
