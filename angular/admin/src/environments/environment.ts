// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  admin_party: true, // Admin Party! 🎉
  couch_host: 'http://localhost:5984',
  couch_ws_host: 'http://localhost:8888',
  upload_post: 'http://gamma.rebelcricket.com:8080/upload',
  upload_host: 'http://gamma.rebelcricket.com:8080/uploads'
};
