This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

---

# 통합 브랜치 안내 (Integration Branch Info)

## feature/integration-pain-flow
이 브랜치는 **main** 브랜치와 팀원의 **feature/pain-flow** 브랜치를 통합하여 테스트하기 위해 생성되었습니다.

### 주요 통합 내용
- **대상 브랜치:** `feature/pain-flow` (최근 API 연동 및 화면 수정 내역 포함)
- **통합 방식:** OS 간 호환성 및 빌드 유물 충돌을 방지하기 위해 `src` 폴더 및 핵심 설정 파일(`package.json`, `tsconfig.json`, `index.js` 등)을 선택적으로 병합함.
- **포함 사항:**
  - 백엔드 API 연동 로직
  - 통증 플로우 관련 화면 및 컴포네트 수정 사항
  - 프로젝트 환경 설정 업데이트

### 참고 사항
- 윈도우 환경에서의 경로 이슈로 인해 안드로이드/iOS 네이티브 빌드 유물(`.cxx`, `build` 등) 중 일부는 의도적으로 제외되었습니다.
- 본인의 로컬 작업 내역은 현재 `git stash`에 보관되어 있으며, 필요 시 이 브랜치 위에서 `git stash pop`을 통해 합칠 수 있습니다.

---

# 📱 무선 디버깅 및 다중 기기 연결 가이드 (Wireless Debugging & Multi-device Setup)

USB 연결 포트 접촉 불량 문제를 해결하고, 여러 기기를 동시에 편리하게 테스트하기 위해 자동화 스크립트가 제공됩니다.

## 1. 쉘 스크립트 실행 권한 오류 발생 시 (Windows PowerShell)
Windows 환경에서 보안 정책(`PSSecurityException`)으로 인해 `npm run ...` 명령어가 막히는 경우, **`node`를 통해 직접 스크립트 파일을 실행**하시면 됩니다.

| 구분 | 일반 명령어 (권장) | 윈도우 보안 정책 우회용 명령어 (대체) |
|---|---|---|
| **무선 디버깅 셋업** | `npm run connect-wireless` | `node scripts/adb-wifi.js` |
| **포트 포워딩 일괄 적용** | `npm run adb-reverse` | `node scripts/adb-reverse.js` |
| **빌드된 APK 직접 설치** | `npm run adb-install` | `node scripts/adb-install.js` |

---

## 2. 자동 무선 연결 설정 순서 (USB -> 무선)
1. 스마트폰을 **USB로 PC에 임시 연결**합니다. (스마트폰과 PC가 **동일한 Wi-Fi** 네트워크에 연결되어 있어야 합니다.)
2. 터미널에서 아래 명령어를 실행합니다:
   ```bash
   node scripts/adb-wifi.js
   ```
3. 연결 성공 메시지가 출력되면 **USB 케이블을 분리**하셔도 무선으로 계속 사용이 가능합니다.

---

## 3. 수동 연결 가이드
자동 스크립트로 연결이 되지 않는 경우 아래의 수동 방식으로 연결할 수 있습니다.

### 방법 A: 무선 디버깅 페어링 방식 (Android 11 이상, USB 불필요)
1. 스마트폰 **설정 -> 개발자 옵션 -> 무선 디버깅**을 활성화하고 들어갑니다.
2. **"페어링 코드로 기기 페어링"**을 선택합니다.
3. 표시된 IP 주소와 포트로 페어링을 시작합니다:
   ```bash
   adb pair [IP]:[페어링포트]
   # 예: adb pair 192.168.1.100:39485
   ```
4. 스마트폰 화면에 뜬 **6자리 페어링 코드**를 터미널에 입력합니다.
5. 페어링 완료 후, 무선 디버깅 메인 화면에 표시된 **최종 IP 주소 및 포트**로 연결합니다.
   ```bash
   adb connect [IP]:[최종연결포트]
   # 예: adb connect 192.168.1.100:41235
   ```
6. Metro 서버 연결을 위해 포트를 포워딩합니다:
   ```bash
   node scripts/adb-reverse.js
   ```

### 방법 B: USB를 통한 TCP/IP 연결 방식
1. 스마트폰을 USB로 연결한 상태에서 아래 명령어로 포트를 개방합니다:
   ```bash
   adb tcpip 5555
   ```
2. 스마트폰의 IP 주소(설정 -> 상태 -> IP 주소)를 확인하고 USB 케이블을 뽑습니다.
3. 무선으로 기기를 연결합니다:
   ```bash
   adb connect [스마트폰IP]:5555
   # 예: adb connect 192.168.1.100:5555
   ```
4. Metro 서버 연결을 위해 포트를 포워딩합니다:
   ```bash
   node scripts/adb-reverse.js
   ```


