# Host React, Angular or Vue single-page applications on Cloudflare Workers

Cloudflare Workers now supports [serving static assets](https://developers.cloudflare.com/workers/static-assets/) (as part of the effort to unify [Cloudflare Workers and Pages](https://blog.cloudflare.com/pages-and-workers-are-converging-into-one-experience/)).

> [!NOTE]  
> Both Cloudflare Workers and Pages can now host full-stack and frontend applications. While Cloudflare Workers provides a better integration with the rest of the Cloudflare developer platform, Cloudflare Pages does have some convenient features such as deploy hooks and branch deploy controls. Review the [compatibility matrix](https://developers.cloudflare.com/workers/static-assets/compatibility-matrix/) to decide which to use.

> [!NOTE]  
> Cloudflare Workers provides batteries-included guides for full-stack frameworks (with server-side rendering and other hybrid rendering modes). Check out the docs for [hosting frameworks on Cloudflare Workers with static assets](https://developers.cloudflare.com/workers/frameworks/) if that's what you're looking for. This guide focuses on hosting single-page applications.

## Getting started

1. Run `npm create cloudflare@latest` to create a Cloudflare Workers project locally with . Accept all the basic options (`Hello World example`, `Hello World Worker`, etc.)

2. Run `cd <PROJECT_NAME> to step into your Workers project directory.

3. Create your single-page application within the Workers project. For instance, run `npm create vite@latest my-vue-app -- --template react`, `npm create vite@latest my-vue-app -- --template vue`, `ng new <project-name>`.

4. **If you don't want any API routes or access to server-side functionality with Workers**, you can delete the `src/index.ts` file and remove the entrypoint from `wrangler.toml` or `wrangler.json`. This will omit Workers from being run and only your single-page application will be served.

5. Configure your `wrangler.toml`/`wrangler.json` file of your Workers project to add the assets binding. The directory must be the `dist` folder of the SPA application. In the example below, `spa-app` is the folder containing our single-page application project and the build step of our SPA outputs contents to the `dist` folder. Refer to the examples in this repository for more guidance if needed.

   This step is important to configure the fallback of your single-page application, since your single-page application handles the routing client-side (there is only 1 index.html file and routes are handled with JavaScript in the user's browser). If this is not configured, direct request to `example.com/some-page` will not be properly handled.

   - **If you aren't running Workers code and have deleted `src/index.ts` as specified in step 4**, you must specify `not_found_handling` to be `single_page_application`.
   - **If you are running Workers code**, you must specify `binding` which we'll use in our Cloudflare Worker.

   ```
   //if using wrangler.toml
   assets = { binding = "ASSETS", directory = "./vue-app/dist", not_found_handling = "single-page-application" }

   //if using wrangler.json
   "assets": {
       "binding": "ASSETS", // only required when there is Workers code to configure navigation fallback
       "directory": "./spa-app/dist",
       "not_found_handling": "single-page-application" // only required when there is no Workers code
   }
   ```

6. **If you aren't running Workers code and have deleted `src/index.ts`**, no other steps are required. **If you are running Workers code**, you must handle the fallback behavior in your Worker code directly using the [asset binding](https://developers.cloudflare.com/workers/static-assets/binding/#runtime-api-reference).

   ```
   export default {
   async fetch(request, env) {
       const url = new URL(request.url);
       if (url.pathname.startsWith("/api/")) {
       // TODO: Add your custom /api/* logic here.
       return new Response("Ok");
       }

       // Passes the incoming request through to the assets binding.
       // No asset matched this request, so this will evaluate `not_found_handling` behavior.
       return env.ASSETS.fetch(request);
   },
   };
   ```

7. Change your `dev`, `start` and `deploy` scripts in your Workers project's `package.json`. These should first perform a build of the child single-page application project before running the Workers dev commands. In the below example, `spa-app` contains our React/Angular/Vue/SPA app and calls `npm run build` (or otherwise configured) to build the SPA project.

   ```
   {
   "name": "spa-on-workers-assets",
   "scripts": {
       "deploy": "cd spa-app && npm run build && cd .. && wrangler deploy",
       "dev": "cd spa-app && npm run build && cd .. && wrangler dev",
       "start": "cd spa-app && npm run build && cd .. && wrangler dev",
       ...
   },
   ...
   }
   ```

Pro tip: You can use `npx wrangler types` to generate types for your Workers binding if your project is configured with TypeScript.
