# embellish vencord and vendetta plugin

Customise your profiles with custom user colors,
message colors, profiles, profile frames and much more


## Development

First create a `.env.local` file (you can copy `.env` as an example)
and set it up to your needs

If you don't already have pnpm installed, please install it with `npm i -g pnpm`.

run `pnpm i` and `pnpm packages:build`.

### Project Structure

`/packages` hosts libraries and configurations
`/apps` hosts the actual applications, such as the http api and the plugins
