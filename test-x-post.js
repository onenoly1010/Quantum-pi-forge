require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');

console.log('🔌 Initializing X API client with OAuth 1.0a...');

// Initialize client with all 4 credentials (already have user context pre-authorized)
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

// ReadWrite client already available
const rwClient = client.readWrite;

async function testPostTweet() {
  try {
    console.log('📤 Sending test tweet...');
    
    const { data: createdTweet } = await rwClient.v2.tweet({
      text: "Test from OINIO sovereign agent — resonance check ✅\n\nQuantum Pi Forge online. Local autonomy verified.",
    });

    console.log('\n✅ SUCCESS! Tweet posted successfully');
    console.log('   Tweet ID:', createdTweet.id);
    console.log('   Direct URL: https://x.com/onenoly11/status/' + createdTweet.id);
    
    return true;
  } catch (error) {
    console.error('\n❌ FAILED to post tweet');
    
    if (error.data) {
      console.error('   Status:', error.status);
      console.error('   Title:', error.data.title);
      console.error('   Detail:', error.data.detail);
      
      if (error.data.errors) {
        error.data.errors.forEach((err, i) => {
          console.error(`   Error ${i+1}:`, err.message, err.code);
        });
      }
    } else {
      console.error('   Error:', error.message);
    }
    
    return false;
  }
}

// Run test
testPostTweet().then(success => {
  console.log('\n🏁 Test complete.');
  
  if (success) {
    console.log('\n🎉 Your credentials are working correctly.');
    console.log('   You can now use this client in your BullMQ worker.');
  } else {
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Verify you are on Pay Per Use plan at console.x.com');
    console.log('   2. Ensure app permissions are set to Read + Write');
    console.log('   3. Regenerate all 4 keys AFTER setting permissions');
    console.log('   4. Check that your app is attached to the project');
  }
  
  process.exit(success ? 0 : 1);
});