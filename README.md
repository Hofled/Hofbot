# Hofbot [![](https://pbs.twimg.com/profile_images/608652049169850369/Zql9-5sX_normal.png)](https://twitch.tv)
A twitch.tv chat bot.

Hofbot is written in Typescript and uses tmi.js API to integrate with the twitch.tv chat.

Even though the bot shows example configurations with an account under the name "Hofbot", it is not required to be called like that, but can run over any twitch.tv account (using the given authentication key).

The bot has been designed with the thought in mind of it being hosted on a Raspberry pi, altough it can run over any computer and function the same way.

The bot is still in the making and is in its early-versions.

Any suggestions for improvement are welcome, please feel free to open new issues.

# Getting started
To start development using the bot, you would need `nodejs` installed on your machine together with `npm` for installation of packages.

After you have those installed, open the project's folder and run the console command: `npm install` .
This will install the required packages and compiling tools to start develop and run the bot.

To run the bot, simply type out the command `npm start`.

## Twitch account
A twitch account is required to run the bot over (www.twitch.tv).

## Known issues
Before running the bot, it is important to note out a few issues on behalf of twitch's end, which will hopefully get resolved in the near future.

Although those issues are not major and prevent the bot from functioning, it is important to be aware of them:

### Bot whisper shadow bans / blacklists
Twitch monitors whispers sent through their servers and recognize suspicious activity such as bot whispers.
They prevent, after detecting an account as a bot, to get their whispers through the servers, there is no error message sending the whisper itself, but the server "swallows" the whisper and does not get it to the other end.

If whispering is something you want to have you bot being capable of doing, you would have to contact twitch's support team and ask them to manually whitelist the bot's account (I have done so myself and it is a very simple process).
