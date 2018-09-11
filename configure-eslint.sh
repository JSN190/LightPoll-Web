#!/usr/bin/env bash
printf "$(tput bold)$(tput setaf 6)Ensure you have permission.$(tput sgr 0)\n"
printf "Run with sudo if your current user does not have permission to install global modules.\n\n"
npm install -g eslint eslint-plugin-vue@next
printf "\n$(tput bold)$(tput setaf 3)Configure your editor.$(tput sgr 0)\n"
printf "Your editor might need additional configuration to lint .vue files. Refer to the comment at the end of this script.\n"

: '
VISUAL STUDIO CODE:
Open File > Preferences > Settings and open your settings.json from the three dot menu on the top right.
Then add the following to your settings.json. 

"eslint.validate": [
{
    "language": "vue",
    "autoFix": true
},
{
    "language": "html",
    "autoFix": true
},
{
    "language": "javascript",
    "autoFix": true
}
]

ATOM:
Add text.html.vue to “List of scopes to run eslint on” in Settings > Packages > linter-eslint.
Then restart Atom.
'