# Plasma Wolf Controller

A floating menu for quick desktop actions on Linux. The project provides a native Qt application with a web-based interface that appears as an overlay menu for fast access to common actions.

## Overview

Plasma Wolf is a hybrid application consisting of:
- A native Qt application (C++)
- A web-based frontend (TypeScript/HTML/CSS)
- An HTTP server that connects the two components

The application creates a floating overlay menu that can be triggered from the desktop environment and provides controls for various quick actions. Currently, the application is Linux-only with testing done primarily on KDE6.

To integrate with your desktop environment, you should bind a keyboard shortcut to send the USR1 signal to the process, for example:
```bash
kill -USR1 $(cat /tmp/plasma-wolf.pid)
```
This will show/hide the floating menu.

## Prerequisites

- [Bun](https://bun.sh/) runtime
- Qt development tools (for building the native component)
- Make
- QMake

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wxn0brp/plasma-wolf-controller
   cd plasma-wolf-controller
   ```

2. Run script:
   ```bash
   ./girl.sh
   ```

## Running

To start the application:
```bash
bun run start
```

## Configuration

The application runs on port 15965 by default and is bound to 127.0.0.1. The authentication token is randomly generated on each startup.

## Contributing

Contributions are welcome! Please open an issue or pull request on GitHub.

## License

MIT