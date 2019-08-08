# LightPoll Web
![Repository Size](https://img.shields.io/github/repo-size/JSN190/LightPollWeb.svg?t&style=flat-square)
![License](https://img.shields.io/github/license/JSN190/LightPollWeb.svg?&style=flat-square)
![Top Language](https://img.shields.io/github/languages/top/JSN190/LightPollWeb.svg?&style=flat-square)
[![Website Uptime](https://img.shields.io/website-up-down-green-red/http/www.lightpoll.org.svg?label=www.lightpoll.org&style=flat-square)](https://www.lightpoll.org)
[![Netlify Status](https://api.netlify.com/api/v1/badges/66474294-5d8d-4286-b610-58d8f85a07d7/deploy-status)](https://www.lightpoll.org)

LightPoll Web is a frontend for the [LightPoll](https://github.com/Tyncture/LightPoll) web application which 
facilites rapid creation and distribution of realtime online web polls.

It is written using the Vue.js framework.

![Voting](https://i.imgur.com/w0335bd.gif)

## Configuration

Before building the static files, ensure that you have all the required dependencies installed by running `npm init`. 

### Environment Variables

- `LPW_API`: The URL pointing to where your instance of the backend is installed.
- `LPW_URL` The URL pointing to where you will host LightPoll Web.
- `LPW_HIST`: Whether to enable (`1`) or disable (`0`) Vue Router history mode.

To build using the `npm run build` script or to set parameters for development, use the `*.env.js` files in `/config`.

### Output

Webpack will build your static assets to the directory `/dist`. All resources needed to deploy to a production server can be
copied over from this directory.

## License
```
MIT License

Copyright (c) 2018 John Su

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


