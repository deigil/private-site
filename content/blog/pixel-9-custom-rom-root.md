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
- crDroid specific images for Recovery. Find these on your devices download page via **Recovery** (get `init_boot.img`, `vendor_boot`, `vendor_kernel_boot`, `dtbo`, and `boot`)
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
6. Move over this file back to the computer. Unlock Devloper settings and enable USB Debugging on phone.
7. Run `adb devices`, accept the RSA, and run `adb reboot bootloader`
8. Then run `fastboot flash init_boot magisk_patched-<random>.img` and reboot back to system.

Once the phone reboots, go back into Magisk, and you should see that it is now rooted. I will not go into much detail about what you can do with a rooted device, but lets just say it opens a lot of doors.

Continue to the next section to learn how to pass integrity so that bank apps and your wallet work properly.

### Pass Play Integrity (SafetyNet)

In Magisk:

1. Settings: enable Zygisk
2. Configure DenyList: add banking apps and Google Play Services/Store
3. 
4. Reboot, then clear data for Play Store and Services
5. Verify with a checker app: [Integrity/SafetyNet checker]([link-to-checker-app])

If you still fail, ensure your ROM’s fingerprint is proper or add a props/spoofing solution per your ROM community guidance.

### Troubleshooting quick hits

- `fastboot` not detecting device: use a good USB‑C cable, different port, or install proper drivers on Windows
- `adb sideload` fails at 47%: that’s normal for some recoveries; check the device screen for success/failure
- Boot loops after flashing: re‑flash matching images for your current build; confirm you used the correct `init_boot.img`
- Bank app still detects root: trim your DenyList and avoid exposing root to those apps; reboot after each change

I’ll keep this post updated with modules I like, my ROM tweaks, and any gotchas on the Pixel 9.


