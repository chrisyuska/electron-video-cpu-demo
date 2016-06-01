# Electron Video GPU/CPU Bug Demo

This is a small Electron app that demonstrates a bug where GPU/CPU usage is unexpectedly high when playing video in a hidden window until the window is shown and then hidden again. Example (usage will vary):

```node
win = new BrowserWindow({
  show: false,
});

// GPU usage: 25% (identical to visible window even though window is hidden)

win.show();

// GPU usage: 25%

win.hide();

// GPU usage: 0%
```


## The problem:

Animated elements (video tags, img tags with animated sources, etc.) in Electron BrowserWindows still tax the GPU (or CPU if graphics are embedded) when the BrowserWindow is initialized with the `{show: false}` option.

This is particularly an issue when an application has numerous windows that are initially hidden, as the GPU is taxed by all of them at once.


## How to reproduce:

### Notes:

* **Note:** If your computer uses a dedicated graphics card, you will have to monitor your graphics processor usage with other software such as AMD Catalyst Software or NVIDIA Control Panel.
* **Note:** If using Windows, you will also need to run `wmic.exe` as the CPU usage calculation relies on it.

### Steps:

1. Install and run electron app with `npm install && npm start`
2. Take note of the GPU/CPU usage in the console once the average levels out.
3. Right click on the ![Icon](/assets/Icon_Video_tiny.png) icon in the task bar, then click `Call show() then hide() on window` to cycle visibility.
4. Take note of the new GPU/CPU usage in the console once the average levels out again. It should be noticeably lower than in step 3.


## Workaround

Calling `show()` and then `hide()` immediately after initializing a hidden window appears to result in the expected lower GPU/CPU usage.  Example:

```node
win = new BrowserWindow({
  show: false,
});

win.show();
win.hide();
```

I have some concerns that this could introduce some unexpected behavior or jank with windows momentarily appearing and then disappearing though.


## Tested with:

1. Ubuntu 14.04, 32-bit
  * Electron v1.1.1
  * CPU: Intel Core i5-2557M CPU @ 1.70GHz × 4
  * GPU: Intel Sandybridge Mobile x86/MMX/SSE2
  * Status: **Affected**

2. Windows 7, 64-bit
  * Electron v1.1.1
  * CPU: Intel Core i7-3770K CPU @ 3.50GHz × 4
  * GPU: AMD Radeon HD 7900 Series
  * Status: **Affected**
