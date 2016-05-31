# Electron Video CPU Demo

This is a small Electron app that demonstrates high(er) cpu usage when playing video in a hidden window until the window is shown and then hidden again.

This issue was discovered while creating an Electron app that does video processing on several videos at once.  Each video playing in an always-hidden window seems to result in 50-100% more CPU usage on the machines tested when compared to hiding windows after initialization.

Note that this has only been tested on computers with embedded graphics.  I suspect this is directly related to drawing with the GPU and Chromium not knowing the window is hidden/invisible.

## How to reproduce:

1. Install and run electron app with `npm install && npm start`
2. Take note of CPU usage in console once average balances out.
3. Using tray menu, click `Show application window` and then click `Hide application window`.
4. Take note of new CPU usage in console once average balances out again (it should be ~50% lower than in step 3).

## Workaround for CPU usage issue

It appears that calling `hide()` immediately after initializing the window results in the expected lower CPU usage.

This can be verified by running this electron app with `npm install && npm start hide-after`.

Unfortunately, this can be sort of janky with windows momentarily appearing and then disappearing, especially when created dynamically.

## Tested with:

* Electron v1.1.1
* OS: Ubuntu 14.04, 32-bit
* CPU: Intel Core i5-2557M CPU @ 1.70GHz × 4
* GPU: Intel Sandybridge Mobile x86/MMX/SSE2
