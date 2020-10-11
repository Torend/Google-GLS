# Google-GLS

guided learning solution for google.com

### Installation

requires [Python](https://www.python.org/) 3.x+ to run.

Running a simple local HTTP server:

1.open your command prompt (Windows)/ terminal (macOS/ Linux)
2.navigate to the directory that your clone is inside, using the cd command
3.enter the command to start up the server in that directory:

```sh
python3 -m http.server
# On windows try "python" instead of "python3", or "py -3"
```

Go to [Google](google.com) (make sure the site is in english) open DevTools Console and write:

```sh
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://127.0.0.1:8000/player.js';
document.head.appendChild(script);
```

### Tests

to add the tests file run the script:

```sh
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://127.0.0.1:8000/tests.js';
document.head.appendChild(script);
```

use the test functions:
- showAll() - show all tooltips
- hideAll() - hide all tooltips
- showById(id) - show specific tooltip (by id)
- getPositions() - print positions of the tooltips and the elements that belong to them

### Comments

- stepOrdinal and id numbers are not follow
- CSS dont match
