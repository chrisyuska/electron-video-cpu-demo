# Electron Video CPU Demo

This is a small Electron app that demonstrates high(er) CPU/GPU usage when playing video in a hidden window until the window is shown and then hidden again.

This issue was discovered while creating an Electron app that does video processing on several videos at once.  Each video playing in an always-hidden window seems to result in 50-100% more CPU/GPU usage on the machines tested when compared to hiding windows after initialization.

This seems to be related to drawing with the CPU/GPU and Chromium not knowing the window is hidden/invisible.  This will affect the CPU usage if the computer uses embedded graphics or the GPU usage if the computer has a dedicated graphics card.

## How to reproduce:

1. Install and run electron app with `npm install && npm start`
  * **Note:** If running in Windows, you will also have to run `wmic.exe` as the CPU usage calculation relies on it.
2. Take note of CPU/GPU usage in console once average balances out.
  * **Note:** If your computer has dedicated graphics, you will have to run other software to monitor your graphics processor usage.
3. Using the tray menu, click `Show application window` and then click `Hide application window`.
  * The tray menu will have the ![Icon](/assets/Icon_Video_small.png) icon and live in your task bar.
4. Take note of new CPU/GPU usage in console once average balances out again (it should be ~50% lower than in step 3).
  * **Note:** If your computer has dedicated graphics, you will have to run other software to monitor your graphics processor usage.

## Workaround for CPU usage issue

It appears that calling `hide()` immediately after initializing the window results in the expected lower CPU usage.

This can be verified by running this electron app with `npm install && npm start hide-after`.

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
