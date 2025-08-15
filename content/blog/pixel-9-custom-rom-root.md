---
title: Pixel 9 custom ROM + root + Play Integrity pass
date: 2025-08-13T00:00:00Z
draft: true
summary: Unlocking the bootloader, installing a custom ROM (crDroid), rooting with Magisk, and passing Play Integrity on a Pixel 9 running Android 15.
tags: [Android, Pixel 9, Root, Magisk, crDroid, Play Integrity, SafetyNet]
---

As I mention in my About Me, I love tinkering with Android devices. It’s a computer in your pocket, so I want full control and customization. I’ve been unlocking, theming, and rooting since my first Motorola around 2010 — and now I’m on a Pixel 9 running Android 15, fully unlocked and customized.

[/aboutme/#android-and-phone-modding](/aboutme/#android-and-phone-modding)

This write‑up is what I did on my Pixel 9. It also applies to Pixel 9 Pro / 9 Pro XL and most Pixels on Android 15 (with minor device‑specific differences).

### Read this first

- Unlocking wipes your device. Back up first.
- You are responsible for your device. This can void warranty and may affect Widevine DRM, banking apps, etc.
- Always follow your ROM maintainer’s install notes for your exact device build.

### What you’ll need

- Platform‑tools (ADB/Fastboot): [Android SDK Platform‑Tools](https://developer.android.com/tools/releases/platform-tools)
- Archive extractor: [7‑Zip](https://www.7-zip.org/) (or your favorite)
- ROM: Pixel specific downloads [crDroid]([https://crdroid.net/downloads])
- crDroid specific images for Recovery. Find these on your devices [download](https://crdroid.net/downloads) page (get `init_boot.img`, `vendor_boot`, `vendor_kernel_boot`, `dtbo`, and `boot`)
- crDroid specific [GAPPS](https://nikgapps.com/crdroid-official)

### Enable Developer options and prep the phone

1) Settings → About phone → tap Build number 7 times to enable Developer options.
2) Settings → System → Developer options → enable OEM unlocking and USB debugging.

### Connect and verify ADB

Open a terminal in your platform‑tools folder and run:

```bash
adb devices
```

Approve the RSA prompt on the phone if asked.

### Unlock the bootloader (wipes data)

Reboot to the bootloader, then unlock:

```bash
adb reboot bootloader
fastboot flashing unlock
```

Confirm the unlock on the device. It will wipe and reboot to a fresh system.

Do a minimal setup (skip accounts/locks), re‑enable Developer options and USB debugging, then:

```bash
adb devices
adb reboot bootloader
```

### Install the custom ROM (crDroid)

Follow the device‑specific instructions from the ROM maintainer. For my Pixel 9:

1. In bootloader, ensure phone is still connected, and your terminal is open in adb.
2. Move over all of the downloaded recovery images into the adb folder.
2. Run these commands:
```
fastboto flash init_boot init_boot.img
fastboot flash boot boot.img
fastboot flash dtbo dtbo.img
fastboot flash vendor_kernel_boot vendor_kernel_boot.img
fastboot flash vendor_boot vendor_boot.img
```
*File names might be different, you can use tab completions or rename the files to remove the dates*

3. Boot to recovery (from bootloader, choose Recovery Mode)
4. Factory reset once more
5. Apply update → ADB sideload
6. Move over the downloaded ROM .zip file into the adb folder.
7. Run `adb sideload crDroid-<device>-<build>.zip`

    - It might say you are downgrading, just accept and continue with the install.
8. After flashing is complete, it will ask to reboot to recovery. Accept this.
9. Move over the downloaded GAPPS .zip into the adb folder.
10. Apply update → ADB sideload
11. Run `adb sideload gapps.zip`

    - You can rename the long file to just `gapps.zip` here
12. After successful flash, you can reboot to system, and setup your new phone.

You can stop here if you don't want to root and possibly lose safety net for wallets, banks, and other apps.

### Root with Magisk (Android 13+ uses init_boot)

1. We already have the `init_boot` so we can just move it over to our phone from the computer.
2. Download latest [Magisk](https://github.com/topjohnwu/magisk/releases/) beta apk.
3. Install the apk, open, and select Install where it says Magisk.
4. Select and patch a file. Choose the `init_boot` file.
5. It will patch it and save the file to `Downloads` folder.
6. Move over this file back to the computer. Unlock Developer settings and enable USB Debugging on phone.
7. Run `adb devices`, accept the RSA, and run `adb reboot bootloader`
8. Then run `fastboot flash init_boot magisk_patched-<random>.img` and reboot back to system.

Once the phone reboots, go back into Magisk, and you should see that it is now rooted.

Continue to the next section to learn how to pass integrity so that bank apps and your wallet work properly.

### Pass Play Integrity (SafetyNet)

1. In magisk > settings: enable Zygisk
2. Then click Configure DenyList: add banking apps, Google Play, Google Services, Google Wallet. 
3. Download on your phone via browser [NeoZygisk](https://github.com/JingMatrix/NeoZygisk), [Play Integrity Fork](https://github.com/osm0sis/PlayIntegrityFork), [Tricky Store](https://github.com/5ec1cff/TrickyStore), and [Zygisk Assistant](https://github.com/snake-4/Zygisk-Assistant).
4. Go into magisk, modules, install from storage, and select NeoZygisk, then ZygiskAssistant. Reboot.
5. Go back into magisk and do the same for the other two modules. Reboot.
6. Install [WebUIX](https://github.com/MMRLApp/WebUI-X-Portable). It is an apk so just click it and install it.
7. Open WebUIX, confirm any requirmenents first. Then select Tricky Store by clicking on its card in Modules. Then at the top right, select the hamburger, press `Select All`, then `Deselect Unnecessary` and then bottom press save. 
8. Again, go to the hamburger menu, click on `Set Valid Keybox`, then `Set Security Patch` and `Get Security Path Date` and save again.

Reboot and you should have device integrity passed successfully. You can check with the Play Store app [Play Integrity API Checker](https://play.google.com/store/apps/details?id=gr.nikolasspyr.integritycheck&hl=en_US&pli=1).

### Troubleshooting quick hits

- `fastboot` not detecting device: use a good USB‑C cable, different port, or install proper drivers on Windows
- `adb sideload` fails at 47%: that’s normal for some recoveries; check the device screen for success/failure
- Boot loops after flashing: re‑flash matching images for your current build; confirm you used the correct `init_boot.img`
- Bank app still detects root: trim your DenyList and avoid exposing root to those apps; reboot after each change
- **A lot of the links to the repos have important info and steps that can be followed too. Read those!**

### Modules and Root Apps

1. [AdAway](https://adaway.org/) For system wide ad blocker. Might need to allow some hosts through depending on what is blocked. You can do this by following this [guide](https://github.com/AdAway/AdAway/wiki/ProblematicApps).
2. [ReVanced Manager](https://github.com/ReVanced/revanced-manager) Can patch certain apps to allow certain services that otherwise would be paid or not allowed.
3. [Zygisk Detach](https://github.com/j-hc/zygisk-detach) Pairs well with the patcher to block certain apps from not auto updating via Play Store.
4. [Live Boot](https://github.com/symbuzzer/livebootmodule) Cool and faster boot-up animation, terminal style.

And thats about it for now. CrDroid itself has a lot of cool settings and tweaks you can mess with. I will most likely add a comment section to these blog posts soon, for now reach out to me via LinkedIn or GitHub if you have any issues with any of this info!


