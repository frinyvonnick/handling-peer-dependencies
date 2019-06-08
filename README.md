# How to handle peer dependencies when developing modules

## What is a peer dependency and what is the problem with it?

[Peer dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/#the-solution-peer-dependencies) are a specific kind of dependencies really useful for reusable modules:

- Ask user to install a dependency your module needs to work without specifying a version in particular
- Prevents having multiple version of a same module in user's app node_modules
- Reduce javascript files size to load on browser side particularly useful for mobile users

The problem with peer dependencies is `npm` and `yarn` don't install them at all. This is the right behavior for production purpose but when you are developping you might need to test your module an host app. `npm` and `yarn` provide a command to achieve it called `link` that basically creates a symlink into the host app `node_modules` to your module source folder. It works fine but you also need to execute tasks in your module that needs these dependencies. For example, you might want to execute tests. Since they aren't present in your module's `node_modules` you will experience errors like this:

```
Cannot find module 'react' from 'index.js'
```

`yarn` and `npm` don't provide tools to install peer dependencies for your development environment. There is an opened issue on `yarn` repository since [27 October 2016](https://github.com/yarnpkg/yarn/issues/1503) but `yarn` has a special script called `prepare` that is executed after dependencies installation only on development mode maybe we could do something with it 🤔. Let's find a way to set up a work around!

## Solve the problem

I made a [repository](https://github.com/frinyvonnick/handling-peer-dependencies) with all the sources to reproduce the problem.

We have the following folder structure:

```
.
├── LICENSE
├── README.md
├── app
│   ├── node_modules
│   ├── package.json
└── lib
    ├── node_modules
    └── package.json
```

First of all we will set up a link so the app's node_modules folder point to the lib folder.

_You must install dependencies and you might also need to build your module first_

```sh
cd lib
yarn link
cd ../app
yarn link lib
```

At this point if you start your application you could use your module without any trouble. The problem appears when you try to execute things into your module folder as I said before like tests. To solve this we will use [prepare](https://yarnpkg.com/en/docs/package-json#toc-scripts) script from `yarn` and the package [install-peers-cli](https://github.com/alexindigo/install-peers-cli).

`install-peers-cli` is a cli that install peer dependencies of a package. It should be called after dependencies installation. Fortunately `prepare` is called after dependencies installation and only when you are developing so it won't install the peer dependencies when a user install your module.

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

If you follow previous steps you should have an error with the following message "hooks can only be called inside the body of a function component". This error occurs when you have multiple copies of `React` in your node_modules folder. In this [comment](https://github.com/facebook/react/issues/14257#issuecomment-439967377) Dan Abramov explain the solution to this well known issue. Let's put it into pratice.

You should go in your module's `react` folder that is present in your `node_modules` and create a link. Then go back to your host app folder and use this link.

```sh
cd lib/node_module/react
yarn link
cd ../../../app
yarn link react
```

Now the error should be fixed and you could use your module into your host app!

You're all set 🙌!
