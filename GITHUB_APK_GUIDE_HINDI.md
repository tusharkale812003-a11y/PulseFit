# PulseFit APK build guide

## 1. Upload this project to GitHub
1. Create a new GitHub repository named `PulseFit`.
2. Upload all files and folders from this project (including the hidden `.github` folder).
3. Commit the files to the `main` branch.

## 2. Run the APK build
1. Open the repository on GitHub.
2. Select the **Actions** tab.
3. Open **Build PulseFit Android APK**.
4. Click **Run workflow** if it has not started automatically.
5. Wait for the workflow to finish successfully.

## 3. Download the APK
1. Open the completed workflow run.
2. Scroll to **Artifacts**.
3. Download `PulseFit-Android-APK`.
4. Extract the downloaded ZIP. It contains `app-debug.apk`.
5. Transfer the APK to your Android phone and install it. Android may ask you to allow installation from that source.

## Notes
- This workflow creates a debug APK for testing and personal installation.
- A Play Store release requires a signed release build (AAB is normally preferred) and secure signing-key setup.
- The app ID is currently `com.pulsefit.workout`. Choose the final unique application ID before publishing; changing it later means Android treats it as a different app.
- The workflow creates the Android project during CI, so the generated `android/` folder is not required in this source ZIP.
