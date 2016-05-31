# Electron Video GPU/CPU Bug Demo

This is a small Electron app that demonstrates high(er) GPU/CPU usage when playing video in a hidden window until the window is shown and then hidden again.


## The problem:

Animated elements (video tags, img tags with animated sources, etc.) in Electron BrowserWindows still tax the GPU (or CPU if graphics are embedded) when the BrowserWindow is initialized with the `{show: false}` option.

This issue was discovered while creating an Electron app that does video processing on several videos at once.  This can result in several times higher GPU/CPU usage when the animated elements are larger in resolution or higher in frame rate.


## How to reproduce:

### Notes:

* **Note:** If your computer uses a dedicated graphics card, you will have to monitor your graphics processor usage with other software such as AMD Catalyst Software or NVIDIA Control Panel.
* **Note:** If using Windows, you will also need to run `wmic.exe` as the CPU usage calculation relies on it.

### Steps:

1. Install and run electron app with `npm install && npm start`
2. Take note of the GPU/CPU usage in the console once the average levels out.
3. Using the application's tray menu, click `Show application window` and then click `Hide application window`.
  * **Note:** The tray menu will have the ![Icon](/assets/Icon_Video_tiny.png) icon and live in your task bar.
4. Take note of the new GPU/CPU usage in the console once the average levels out again (it should be noticeably lower than in step 3).


## Workaround

Calling `hide()` immediately after initializing the window appears to result in the expected lower GPU/CPU usage.  This can be verified by running this electron app with `npm install && npm start hide-after`.

Unfortunately, this can be sort of janky with windows momentarily appearing and then disappearing, especially when created dynamically.


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
