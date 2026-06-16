const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return null;
  }
}

const apkPath = path.join(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');

if (!fs.existsSync(apkPath)) {
  console.error(`❌ APK file not found at: ${apkPath}`);
  console.error('👉 Please run build first (e.g. npm run android).');
  process.exit(1);
}

console.log('🔄 Checking active adb devices...');
const devicesOutput = runCommand('adb devices');
if (!devicesOutput) {
  console.error('❌ Failed to run adb devices.');
  process.exit(1);
}

const lines = devicesOutput.split('\n');
const devices = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const [serial, status] = line.split(/\s+/);
  if (status === 'device') {
    devices.push(serial);
  }
}

if (devices.length === 0) {
  console.log('❌ No connected devices found. Please connect a device first.');
  process.exit(1);
}

console.log(`📱 Found ${devices.length} device(s). Starting APK installation...`);
console.log(`📦 APK size: ${(fs.statSync(apkPath).size / (1024 * 1024)).toFixed(2)} MB\n`);

let successCount = 0;
for (const serial of devices) {
  console.log(`⏳ Installing onto ${serial}...`);
  try {
    // Run adb install synchronously with inherited output or captured output
    execSync(`adb -s ${serial} install -r "${apkPath}"`, { stdio: 'inherit' });
    console.log(`✅ Success: Installed onto ${serial}\n`);
    successCount++;
  } catch (error) {
    console.error(`❌ Failed: Could not install onto ${serial}\n`);
  }
}

console.log(`✨ Completed. Successfully installed onto ${successCount}/${devices.length} device(s).`);
