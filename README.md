# handling-peer-dependencies

`yarn` and `npm` doesn't provide tools to install peer dependencies for your development environment. There are an opened issue on yarn repository since [27 October 2016](https://github.com/yarnpkg/yarn/issues/1503).

## Steps

- Install in dependencies in lib `yarn` it also install peerDeps thanks `prepare` script and `install-peers`
- Build lib `cd lib && yarn build`
- Create the link of the lib `yarn link`
- Link the lib in the host app `cd app && yarn link lib`
- Start app it should works

## For React using hooks

If you follow previous steps you should have an error with the following message "hooks can only be called inside the body of a function component".
React can stand being present in [multiple copies](https://github.com/facebook/react/issues/14257#issuecomment-439967377) into your node_modules.

- Create a link of the React version present in the lib's node_module `cd lib/node_module/react && yarn link`
- Link react in the host app `cd app && yarn link react`
- Start app it should works
