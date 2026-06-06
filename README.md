# Task Flow Lite

A simple personal task manager for class training.

## Features

- Add tasks
- Mark tasks complete
- Delete tasks
- Filter all, active, and completed tasks
- Save tasks locally with browser local storage

## Run Locally

```sh
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

## Build Compact Android APK

This project includes a small native Android WebView wrapper. It loads the website from:

```text
android/app/src/main/assets/www
```

Build:

```sh
cd android
./gradlew :app:assembleRelease
```

APK output:

```text
android/app/build/outputs/apk/release/app-release.apk
```

The prebuilt class demo APK is also copied to:

```text
taskflowlite-webview.apk
```
