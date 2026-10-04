const { spawn } = require('child_process');
const path = require('path');

// Function to run a command in the backend directory
function runInBackend(command, args) {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, 'backend');
    const child = spawn(command, args, { 
      cwd: backendPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log('Social Media App - User Creation Tool');
    console.log('=====================================');
    console.log('\nUsage:');
    console.log('  node create_user_simple.js <username> <email> <password> <full_name> [bio]');
    console.log('  node create_user_simple.js --sample (creates sample users)');
    console.log('\nExamples:');
    console.log('  node create_user_simple.js john_doe john@example.com password123 "John Doe" "Hello world!"');
    console.log('  node create_user_simple.js --sample');
    return;
  }
  
  if (args[0] === '--sample') {
    console.log('Creating sample users...');
    try {
      const result = await runInBackend('node', ['scripts/create_users.js']);
      console.log(result);
    } catch (error) {
      console.error('Error creating sample users:', error.message);
    }
  } else if (args.length >= 4) {
    const [username, email, password, fullName, bio] = args;
    
    console.log(`Creating user: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Full Name: ${fullName}`);
    
    try {
      // Use the existing create_user.js script in backend
      const result = await runInBackend('node', [
        'create_user.js', 
        username, 
        email, 
        password, 
        fullName, 
        bio || `${fullName} is now on Social Media!`
      ]);
      console.log(result);
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  } else {
    console.log('Invalid arguments. Use --help for usage information.');
  }
}

main();