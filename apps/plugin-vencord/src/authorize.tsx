import { env } from "@embellish/env";
import { openModal } from "@vencord/types/utils";
import { findByProps } from "@vencord/types/webpack";

export function authorize() {
  return new Promise<void>((resolve, reject) => {
    const { OAuth2AuthorizeModal } = findByProps("OAuth2AuthorizeModal");

    openModal(props => {
      return <OAuth2AuthorizeModal
        {...props}
        scopes={["identify"]}
        responseType="code"
        redirectUri={env("EXPRESS_AUTH_CALLBACK")}
        permissions={0n}
        clientId={env("DISCORD_CLIENT_ID")}
        cancelCompletesFlow={false}
        callback={async response => {
          console.log(response);
        }}
      />
    })
  });
}
