const { execSync } = require('child_process');

function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return null;
  }
}

console.log('🔄 Reversing port 8081 for all connected devices...');
const output = runCommand('adb devices');
if (!output) {
  console.log('❌ Failed to run adb devices.');
  process.exit(1);
}

const lines = output.split('\n');
let successCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const [serial, status] = line.split(/\s+/);
  if (status === 'device') {
    const result = runCommand(`adb -s ${serial} reverse tcp:8081 tcp:8081`);
    if (result !== null) {
      console.log(`✅ Port 8081 forwarded for device: ${serial}`);
      successCount++;
    } else {
      console.log(`❌ Failed to forward port 8081 for device: ${serial}`);
    }
  }
}

console.log(`✨ Finished. Forwarded port 8081 for ${successCount} device(s).`);
