const { execSync } = require('child_process');

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return null;
  }
}

function getDevices() {
  const output = runCommand('adb devices');
  if (!output) return [];

  const lines = output.split('\n');
  const devices = [];
  
  // Skip the first line ("List of devices attached")
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [serial, status] = line.split(/\s+/);
    if (status === 'device') {
      devices.push(serial);
    }
  }
  return devices;
}

function getDeviceIP(serial) {
  // Try using ip route first
  let output = runCommand(`adb -s ${serial} shell ip route`);
  if (output) {
    const match = output.match(/src\s+([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Try using ip addr show wlan0
  output = runCommand(`adb -s ${serial} shell ip addr show wlan0`);
  if (output) {
    const match = output.match(/inet\s+([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function setupWireless() {
  console.log('🔄 Checking connected devices...');
  const devices = getDevices();
  
  if (devices.length === 0) {
    console.log('❌ No connected devices found. Please connect your device via USB first.');
    return;
  }

  console.log(`📱 Found ${devices.length} active device(s):`);
  devices.forEach(d => console.log(`   - ${d}`));

  const usbDevices = devices.filter(d => {
    // Exclude existing wireless connections (containing ip address or mdns service names)
    return !d.includes(':') && !d.includes('_tcp');
  });

  if (usbDevices.length === 0) {
    console.log('\nℹ️ No USB-connected devices found that need wireless setup.');
    console.log('   (If you want to configure wireless debugging, please connect via USB first.)');
    return;
  }

  console.log(`\n⚙️ Starting wireless setup for ${usbDevices.length} USB device(s)...`);

  for (const serial of usbDevices) {
    console.log(`\n[Device: ${serial}]`);
    console.log('🔍 Fetching device IP address...');
    
    const ip = getDeviceIP(serial);
    if (!ip) {
      console.log(`❌ Failed to retrieve IP address for device ${serial}. Make sure the device is connected to the same Wi-Fi network.`);
      continue;
    }
    console.log(`✅ Found IP Address: ${ip}`);

    console.log('🔌 Restarting ADB in TCP/IP mode on port 5555...');
    const tcpipResult = runCommand(`adb -s ${serial} tcpip 5555`);
    if (tcpipResult === null) {
      console.log('❌ Failed to set port 5555. Please check USB debugging settings.');
      continue;
    }
    console.log('✅ Port 5555 opened.');

    console.log('⏳ Waiting for ADB daemon to restart...');
    // Simple synchronous sleep
    execSync('powershell -Command "Start-Sleep -Seconds 3"');

    console.log(`🌐 Connecting wirelessly to ${ip}:5555...`);
    const connectResult = runCommand(`adb connect ${ip}:5555`);
    console.log(`ℹ️ ADB Output: ${connectResult}`);

    if (connectResult && connectResult.includes('connected to')) {
      console.log(`🎉 Successfully connected wirelessly to ${serial} (${ip}:5555)!`);
      console.log('🔌 You can now safely unplug the USB cable.');
      
      console.log('🔄 Reversing port 8081 for React Native development...');
      runCommand(`adb -s ${ip}:5555 reverse tcp:8081 tcp:8081`);
      console.log('✅ Port 8081 forwarded successfully.');
    } else {
      console.log(`❌ Failed to connect wirelessly to ${ip}:5555.`);
    }
  }

  console.log('\n✨ Wireless setup process completed.');
  console.log('\n👉 Current adb devices:');
  console.log(runCommand('adb devices'));
}

setupWireless();
