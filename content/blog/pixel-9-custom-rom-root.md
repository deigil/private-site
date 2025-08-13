---
title: Pixel 9 custom ROM + root + Play Integrity pass
date: 2025-08-13T00:00:00Z
draft: true
summary: Unlocking the bootloader, installing a custom ROM (crDroid), rooting with Magisk, and passing Play Integrity on a Pixel 9 running Android 15.
tags: [Android, Pixel 9, Root, Magisk, crDroid, Play Integrity, SafetyNet]
---

As I mention in my About Me, I love tinkering with Android devices. It’s a computer in your pocket, so I want full control and customization. I’ve been unlocking, theming, and rooting since my first Motorola around 2010 — and now I’m on a Pixel 9 running Android 15, fully unlocked and customized.

- About Me → [/aboutme/#android-and-phone-modding](/aboutme/#android-and-phone-modding)

This write‑up is what I did on my Pixel 9. It also applies to Pixel 9 Pro / 9 Pro XL and most Pixels on Android 15 (with minor device‑specific differences).

### Read this first

- Unlocking wipes your device. Back up first.
- You are responsible for your device. This can void warranty and may affect Widevine DRM, banking apps, etc.
- Always follow your ROM maintainer’s install notes for your exact device build.

### What you’ll need

- Platform‑tools (ADB/Fastboot): [Android SDK Platform‑Tools](https://developer.android.com/tools/releases/platform-tools)
- Archive extractor: [7‑Zip](https://www.7-zip.org/) (or your favorite)
- ROM: [crDroid for Pixel 9]([link-to-crdroid-device-page]) and its install guide [ROM install notes]([link-to-crdroid-install-notes])
- Optional recovery (if the ROM requires it): [Recovery image]([link-to-recovery-image])
- Factory images for your current build (to get `init_boot.img`): [Google Factory Images](https://developers.google.com/android/images)

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

Follow the device‑specific instructions from the ROM maintainer. Typical Pixel flow:

- Option A: Recovery + ADB sideload
  - Boot to recovery (from bootloader, choose Recovery Mode)
  - Factory reset if coming from stock/another ROM
  - Apply update → ADB sideload
  - On the computer: `adb sideload crDroid-<device>-<build>.zip`

- Option B: Fastboot flash images
  - Flash required images provided by the ROM (e.g., `vendor_boot`, `boot`, `dtbo`, etc.)
  - Exact commands vary: see [ROM install notes]([link-to-crdroid-install-notes])

If your ROM is “vanilla,” sideload Google Apps after ROM sideload if desired: `adb sideload <gapps.zip>`.

Reboot to system and complete initial setup.

### Root with Magisk (Android 13+ uses init_boot)

1) Download the factory image matching your current build from Google.
2) Extract `init_boot.img` for your device/build.
3) Copy `init_boot.img` to the phone. In Magisk, “Select and Patch a File.”
4) Pull the patched image back to your computer.
5) Reboot to bootloader and flash the patched image:

```bash
adb reboot bootloader
fastboot flash init_boot magisk_patched-<random>.img
fastboot reboot
```

Open Magisk, complete setup if prompted, and reboot again.

### Pass Play Integrity (SafetyNet)

In Magisk:

1) Settings: enable Zygisk
2) Configure DenyList: add banking apps and Google Play Services/Store
3) Install a Play Integrity fix module: [Play Integrity Fix]([link-to-play-integrity-fix])
4) Reboot, then clear data for Play Store and Services
5) Verify with a checker app: [Integrity/SafetyNet checker]([link-to-checker-app])

If you still fail, ensure your ROM’s fingerprint is proper or add a props/spoofing solution per your ROM community guidance.

### Troubleshooting quick hits

- `fastboot` not detecting device: use a good USB‑C cable, different port, or install proper drivers on Windows
- `adb sideload` fails at 47%: that’s normal for some recoveries; check the device screen for success/failure
- Boot loops after flashing: re‑flash matching images for your current build; confirm you used the correct `init_boot.img`
- Bank app still detects root: trim your DenyList and avoid exposing root to those apps; reboot after each change

I’ll keep this post updated with modules I like, my ROM tweaks, and any gotchas on the Pixel 9.


